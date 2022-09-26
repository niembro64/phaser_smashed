import Game from "../Game";
import {
  AttackEnergy,
  AttackPhysical,
  NormalizedVector,
  Player,
} from "../interfaces";
import { hitbackFly } from "./movement";
import {
  getHasGameDurationPassedAttack,
  setAttackPhysicalState,
  setPlayerState,
} from "./state";

export function onHitHandlerAttackPhysical(
  player: Player,
  playerIndex: number,
  attackPhysical: AttackPhysical,
  j: number,
  damage: number,
  game: Game
): void {
  if (player.state.name !== "player-state-alive") {
    return;
  }

  if (
    game.players[j].char.attackPhysical.state.name !== "attackphysical-state-on"
  ) {
    return;
  }

  setPlayerState(player, playerIndex, "player-state-hurt", game);

  game.overlappingPlayerIAttackPhysicalJ[playerIndex][j] = true;

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.wasLastHitByMatrix[playerIndex][bj] = true;
      game.numberHitByMatrix[playerIndex][j]++;
    } else {
      game.wasLastHitByMatrix[playerIndex][bj] = false;
    }
  }

  let vector = getNormalizedVector(attackPhysical, player);

  player.char.damage += damage;

  if (game.debug.setDefaultHitback) {
    hitbackFly(
      player,
      game,
      game.DEFAULT_ATTACK_HITBACK.x * vector.x,
      game.DEFAULT_ATTACK_HITBACK.y * vector.y
    );
    return;
  }

  hitbackFly(
    player,
    game,
    attackPhysical.hitback.x * vector.x,
    attackPhysical.hitback.y * vector.y
  );
}

export function onHitHandlerAttackEnergy(
  player: Player,
  playerIndex: number,
  attackEnergy: AttackEnergy,
  j: number,
  damage: number,
  game: Game
): void {
  if (player.state.name !== "player-state-alive") {
    return;
  }
  game.overlappingPlayerIAttackEnergyJ[playerIndex][j] = true;

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

  if (game.debug.setDefaultHitback) {
    hitbackFly(
      player,
      game,
      game.DEFAULT_ATTACK_HITBACK.x * vector.x,
      game.DEFAULT_ATTACK_HITBACK.y * vector.y
    );
    return;
  }

  hitbackFly(
    player,
    game,
    attackEnergy.hitback.x * vector.x,
    attackEnergy.hitback.y * vector.y
  );
}

export function setActiveHurtEmitterOn(player: Player): void {
  player.emitterHurt.active = true;
}
export function setActiveHurtEmitterOff(player: Player): void {
  player.emitterHurt.active = false;
}

export function setVisibleHurtEmitterOn(player: Player): void {
  player.emitterHurt.visible = true;
}
export function setVisibleHurtEmitterOff(player: Player): void {
  player.emitterHurt.visible = false;
}

export function setOnDeadUpdateMatrix(playerIndex: number, game: Game): void {
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
  if (player.state.name === "player-state-alive") {
    player.char.damage -= damage;
  }
}

export function setResetDamage(player: Player): void {
  player.char.damage = 0;
}

// export function addHit(player: Player, game: Game): void {
// }

export function getNormalizedVector(
  attack: AttackEnergy | AttackPhysical,
  player: Player
): NormalizedVector {
  let newX = player.char.sprite.x - attack.sprite.x;
  let newY = player.char.sprite.y - attack.sprite.y;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
}

export function updateAttackPhysicalSwitch(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  let attackPhysical = player.char.attackPhysical;

  switch (attackPhysical.state.name) {
    case "attackphysical-state-on":
      if (
        getHasGameDurationPassedAttack(
          attackPhysical,
          attackPhysical.durationAttack,
          game
        )
      ) {
        setAttackPhysicalState(
          attackPhysical,
          playerIndex,
          "attackphysical-state-cooldown",
          game
        );
      }
      break;
    case "attackphysical-state-cooldown":
      if (
        getHasGameDurationPassedAttack(
          attackPhysical,
          attackPhysical.durationCooldown,
          game
        )
      ) {
        setAttackPhysicalState(
          attackPhysical,
          playerIndex,
          "attackphysical-state-off",
          game
        );
      }
      break;
    case "attackphysical-state-off":
      if (player.gamepad.A && !player.padPrev.A) {
        setAttackPhysicalState(
          attackPhysical,
          playerIndex,
          "attackphysical-state-on",
          game
        );
      }
  }
}
