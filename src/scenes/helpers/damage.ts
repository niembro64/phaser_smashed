import Game from '../Game';
import { AttackEnergy, AttackPhysical, Player, xyVector } from '../interfaces';
import {
  setAttackEnergyOffscreen,
  setBulletOffscreen,
  setPhysicsAttackEnergyOff,
} from './attacks';
import { hitbackFly } from './movement';
import { setPlayerState } from './state';

export function onHitHandlerAttackPhysical(
  player: Player,
  playerIndex: number,
  attackPhysical: AttackPhysical,
  j: number,
  damage: number,
  game: Game
): void {
  if (player.state.name !== 'player-state-alive') {
    return;
  }

  if (
    game.players[j].char.attackPhysical.state.name !== 'attackphysical-state-on'
  ) {
    return;
  }

  setPlayerState(player, playerIndex, 'player-state-hurt', game);

  game.overlappingPlayerIAttackPhysicalJ[playerIndex][j] = true;

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.wasLastHitByMatrix[playerIndex][bj] = true;
      game.numberHitByMatrix[playerIndex][j]++;
    } else {
      game.wasLastHitByMatrix[playerIndex][bj] = false;
    }
  }

  let vector = getNormalizedVectorAP(attackPhysical, player);

  player.char.damage += damage;

  if (game.debug.DefaultHitback) {
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
  playerHit: Player,
  playerHitIndex: number,
  attackEnergy: AttackEnergy,
  j: number,
  damage: number,
  game: Game
): void {
  if (playerHit.state.name !== 'player-state-alive') {
    return;
  }

  game.overlappingPlayerIAttackEnergyJ[playerHitIndex][j] = true;

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.wasLastHitByMatrix[playerHitIndex][bj] = true;
      game.numberHitByMatrix[playerHitIndex][j]++;
    } else {
      game.wasLastHitByMatrix[playerHitIndex][bj] = false;
    }
  }

  let vector = getNormalizedVectorAP(attackEnergy, playerHit);

  playerHit.char.damage += damage;

  if (game.debug.DefaultHitback) {
    hitbackFly(
      playerHit,
      game,
      game.DEFAULT_ATTACK_HITBACK.x * vector.x,
      game.DEFAULT_ATTACK_HITBACK.y * vector.y
    );
    return;
  }

  hitbackFly(
    playerHit,
    game,
    attackEnergy.hitback.x * vector.x,
    attackEnergy.hitback.y * vector.y
  );

  if (attackEnergy.diesOnHitbox) {
    setAttackEnergyOffscreen(game.players[j], j, game);
    setPhysicsAttackEnergyOff(game.players[j]);
  }
}

export function onHitHandlerBullets(
  playerHit: Player,
  playerHitIndex: number,
  pj: Player,
  attackEnergy: AttackEnergy,
  bullet: Phaser.GameObjects.GameObject,
  bulletIndex: number,
  j: number,
  damage: number,
  game: Game
): void {
  let b = attackEnergy.attackBullets?.bullets?.getChildren()[bulletIndex];

  if (!b) {
    return;
  }

  if (bullet === null) {
    return;
  }

  if (
    playerHit.state.name === 'player-state-start' ||
    playerHit.state.name === 'player-state-dead'
  ) {
    return;
  }

  // game.overlappingPlayerIAttackEnergyJ[playerIndex][j] = true;

  for (var bj = 0; bj < game.players.length; bj++) {
    if (bj === j) {
      game.wasLastHitByMatrix[playerHitIndex][bj] = true;
    } else {
      game.wasLastHitByMatrix[playerHitIndex][bj] = false;
    }
  }

  // let vector = getNormalizedVector(
  //   b.body.gameObject.x,
  //   b.body.gameObject.y,
  //   playerHit.char.sprite.x,
  //   playerHit.char.sprite.y
  // );

  let vector = {
    x: b.body.gameObject.body.velocity.x,
    y: b.body.gameObject.body.velocity.y,
  };

  // player.char.damage += damage;

  let pHit = playerHit.char.sprite;
  let ae = pj.char.attackEnergy;

  pHit.setVelocityX(pHit.body.velocity.x + vector.x * 3 * ae.hitback.x);
  pHit.setVelocityY(pHit.body.velocity.y + vector.y * 2 * ae.hitback.y - 25);

  if (attackEnergy.diesOnHitbox) {
    setBulletOffscreen(bulletIndex, pj, j, game);
    // setPhysicsAttackEnergyOff(game.players[j]);
  }
}

export function setEmitterPlayerOnFalse(player: Player): void {
  player.emitterPlayer.on = false;
}
export function setEmitterPlayerOnTrue(player: Player): void {
  player.emitterPlayer.on = true;
}
export function setEmitterHurtActiveTrue(player: Player): void {
  player.emitterHurt.active = true;
}
export function setEmitterHurtActiveFalse(player: Player): void {
  player.emitterHurt.active = false;
}

export function setEmitterHurtVisibleTrue(player: Player): void {
  player.emitterHurt.visible = true;
}
export function setEmitterHurtVisibleFalse(player: Player): void {
  player.emitterHurt.visible = false;
}

export function setEmitterPlayerActiveTrue(player: Player): void {
  player.emitterPlayer.active = true;
}
export function setEmitterPlayerActiveFalse(player: Player): void {
  player.emitterPlayer.active = false;
}

export function setEmitterPlayerVisibleTrue(player: Player): void {
  player.emitterPlayer.visible = true;
}
export function setEmitterPlayerVisibleFalse(player: Player): void {
  player.emitterPlayer.visible = false;
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
  if (player.state.name === 'player-state-alive') {
    player.char.damage -= damage;
  }
}

export function setResetDamage(player: Player): void {
  player.char.damage = 0;
}

// export function addHit(player: Player, game: Game): void {
// }

export function getNormalizedVectorAP(
  attack: AttackEnergy | AttackPhysical,
  player: Player
): xyVector {
  let newX = player.char.sprite.x - attack.sprite.x;
  let newY = player.char.sprite.y - attack.sprite.y;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
}

export function getNormalizedVector(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): xyVector {
  let newX = endX - startX;
  let newY = endY - startY;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
}

export function getVector(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): xyVector {
  let newX = endX - startX;
  let newY = endY - startY;

  return { x: newX, y: newY };
}

export function getDistance(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): number {
  let newX = endX - startX;
  let newY = endY - startY;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return newRatio;
}
