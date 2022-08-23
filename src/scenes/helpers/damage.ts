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
  if (game.currentlyOverlappingSpritesMatrix[playerIndex][j]) {
    game.currentlyOverlappingSpritesMatrix[playerIndex][j] = true;
    return;
  }
  if (player.state.name !== "alive") {
    return;
  }

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.wasLastHitByMatrix[playerIndex][bj] = true;
      game.numberHitByMatrix[playerIndex][j]++;
    } else {
      game.wasLastHitByMatrix[playerIndex][bj] = false;
    }
  }

  let vector = getNormalizedVector(attackEnergy, player);

  player.char.damage += damage;

  hitbackFly(
    player,
    game,
    attackEnergy.hitback.x * vector.x,
    attackEnergy.hitback.y * vector.y
  );

  console.log(game.wasLastHitByMatrix[0]);
  console.log(game.numberHitByMatrix[0]);
}

export function onDeadUpdateMatrix(playerIndex: number, game: Game): void {
  let killedSelf: boolean = true;
  for (let j = 0; j < game.players.length; j++) {
    if (game.wasLastHitByMatrix[playerIndex][j]) {
      killedSelf = false;
      game.numberKilledByMatrix[playerIndex][j]++;
    }
  }
  if (killedSelf) {
    game.numberKilledByMatrix[playerIndex][playerIndex]++;
  }
}

export function updateDeathsAndKillsMatrices(game: Game): void {
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
  player.deathCount = game.numberKilledByMatrix[playerIndex].reduce(
    (partialSum, a) => partialSum + a,
    0
  );
}
export function updatePlayerNumberKills(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  player.killCount = 0;
  for (let i = 0; i < game.players.length; i++) {
    if (i !== playerIndex) {
      player.killCount += game.numberKilledByMatrix[i][playerIndex];
    }
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
