import Game from "../Game";
import { AttackEnergy, NormalizedVector, Player } from "../interfaces";
import { hitbackFly } from "./movement";

export function onHitHandler(
  player: Player,
  playerIndex: number,
  attackEnergy: AttackEnergy,
  j: number,
  damage: number,
  game: Game
): void {
  game.overlappingMatrix[playerIndex][j] = true;

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.lastHitByMatrix[playerIndex][bj] = true;
    } else {
      game.lastHitByMatrix[playerIndex][bj] = false;
    }
  }

  let vector = getNormalizedVector(attackEnergy, player);

  if (player.state.name === "alive") {
    player.char.damage += damage;

    hitbackFly(
      player,
      game,
      attackEnergy.hitback.x * vector.x,
      attackEnergy.hitback.y * vector.y
    );

    game.hitByMatrix[playerIndex][j] = game.hitByMatrix[playerIndex][j] + 1;

    // console.log(game.lastHitByMatrix[0]);
    // console.log(game.hitByMatrix[0]);
  }
}

export function updateDeadMatrix(playerIndex: number, game: Game): void {
  for (let j = 0; j < game.players.length; j++) {
    if (game.lastHitByMatrix[playerIndex][j]) {
      // console.log(playerIndex, j);
      game.killedByMatrix[playerIndex][j]++;
    }
  }

  // console.log(game.killedByMatrix[0]);
}

export function updateDeathsAndKills(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    updatePlayerNumberDeaths(player, playerIndex, game);
    updatePlayerNumberKills(player, playerIndex, game);
  });
}

export function updatePlayerNumberDeaths(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  player.deathCount = game.killedByMatrix[playerIndex].reduce(
    (partialSum, a) => partialSum + a,
    0
  );
}
export function updatePlayerNumberKills(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  for (let i = 0; i < game.players.length; i++) {
    player.killCount += game.killedByMatrix[i][playerIndex];
  }
}

export function removeDamage(player: Player, damage: number): void {
  if (player.state.name === "alive") {
    player.char.damage -= damage;
  }
}

export function resetDamage(player: Player): void {
  player.char.damage = 0;
}

// export function addHit(player: Player, game: Game): void {
// }

export function getNormalizedVector(
  attack: AttackEnergy,
  player: Player
): NormalizedVector {
  let newX = player.char.sprite.x - attack.sprite.x;
  let newY = player.char.sprite.y - attack.sprite.y;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
}
