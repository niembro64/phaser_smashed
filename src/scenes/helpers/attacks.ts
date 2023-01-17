import Game, { SCREEN_DIMENSIONS } from '../Game';
import { AttackEnergy, Player } from '../interfaces';
import { setEmitterPlayerOnFalse } from './damage';

export function updateJumpEnergy(player: Player, game: Game): void {
  if (player.state.name === 'player-state-dead') {
    setEmitterPlayerOnFalse(player);
    return;
  }
  // if (
  //   !player.padCurr.up &&
  //   !player.padCurr.down &&
  //   !player.padCurr.left &&
  //   !player.padCurr.right
  // ) {
  //   return;
  // }
  let base = game.BASE_PLAYER_JUMP_ENERGY;
  let pBias = player.char.upB.speedMultiplier;
  let pCurr = player.padCurr;
  let pPrev = player.padPrev;
  let pBody = player.char.sprite.body;
  let pSprite = player.char.sprite;
  let pTouch = pBody.touching;
  if (
    player.padCurr.B &&
    !player.padPrev.B &&
    // player.padCurr.X &&
    // !player.padPrev.X &&
    player.char.upB.canUse &&
    !player.char.sprite.body.touching.down &&
    !player.char.sprite.body.touching.left &&
    !player.char.sprite.body.touching.right
  ) {
    game.SOUND_JUMP_ENERGY.play();
    if (pCurr.up && pCurr.left) {
      pBody.setVelocityY((base * pBias) / Math.SQRT2);
      pBody.setVelocityX((base * pBias) / Math.SQRT2);
    } else if (pCurr.up && pCurr.right) {
      pBody.setVelocityY((base * pBias) / Math.SQRT2);
      pBody.setVelocityX((-base * pBias) / Math.SQRT2);
    } else if (pCurr.down && pCurr.left) {
      pBody.setVelocityY((-base * pBias) / Math.SQRT2);
      pBody.setVelocityX((base * pBias) / Math.SQRT2);
    } else if (pCurr.down && pCurr.right) {
      pBody.setVelocityY((-base * pBias) / Math.SQRT2);
      pBody.setVelocityX((-base * pBias) / Math.SQRT2);
    } else if (pCurr.up) {
      pBody.setVelocityY(base * pBias);
      pBody.setVelocityX(0);
    } else if (pCurr.down) {
      pBody.setVelocityY(-base * pBias);
      pBody.setVelocityX(0);
    } else if (pCurr.left) {
      pBody.setVelocityY(0);
      pBody.setVelocityX(base * pBias);
    } else if (pCurr.right) {
      pBody.setVelocityY(0);
      pBody.setVelocityX(-base * pBias);
    } else if (player.char.sprite.flipX) {
      pBody.setVelocityY(0);
      pBody.setVelocityX(base * pBias);
    } else if (!pSprite.flipX) {
      pBody.setVelocityY(0);
      pBody.setVelocityX(-base * pBias);
    }
    // player.char.sprite.body.setVelocityY(game.BASE_PLAYER_JUMP_ENERGY);
    player.char.upB.canUse = false;
    player.emitterPlayer.active = true;
    // player.emitterPlayer.visible = true;
    player.emitterPlayer.on = true;
    // player.emitterPlayer.setAlpha(1);
    // setTimeout(() => {
    //   player.emitterPlayer.on = false;
    // }, 1000);
  }

  if (!pCurr.B && !pPrev.B) {
    player.emitterPlayer.on = false;
  }
  // if (player.char.sprite.body.velocity.y > 0) {
  //   player.emitterPlayer.on = false;
  // }

  if (
    (pTouch.down || pTouch.left || pTouch.right) &&
    !player.emitterPlayer.on
  ) {
    player.char.upB.canUse = true;
    // player.emitterPlayer.on = false;
  }
  updatePlayerGravityIfEmitterPlayer(player);
}

export function updatePlayerGravityIfEmitterPlayer(player: Player): void {
  if (player.emitterPlayer.on) {
    player.char.sprite.body.allowGravity = false;
  } else {
    player.char.sprite.body.allowGravity = true;
  }
}

export function setPhysicsAttackEnergyOff(player: Player): void {
  player.char.attackEnergy.sprite.body.enable = false;
  player.char.attackEnergy.sprite.body.allowGravity = false;
}

export function setPhysicsAttackEnergyOn(player: Player): void {
  player.char.attackEnergy.sprite.body.enable = true;
  player.char.attackEnergy.sprite.body.allowGravity =
    player.char.attackEnergy.gravity;
}
export function setPhysicsBulletOff(player: Player, bulletIndex: number): void {
  let b =
    player.char.attackEnergy.attackBullets?.bullets?.getChildren()[bulletIndex];

  if (!b) {
    return;
  }

  b.body.gameObject.body.enable = false;
  b.body.gameObject.body.allowGravity = false;

  // player.char.attackEnergy.sprite.body.enable = false;
  // player.char.attackEnergy.sprite.body.allowGravity = false;
}

export function setPhysicsBulletOn(player: Player, bulletIndex: number): void {
  let b =
    player.char.attackEnergy.attackBullets?.bullets?.getChildren()[bulletIndex];

  if (!b) {
    return;
  }

  b.body.gameObject.body.enable = true;
  b.body.gameObject.body.allowGravity = player.char.attackEnergy.gravity;

  // player.char.attackEnergy.sprite.body.enable = true;
  // player.char.attackEnergy.sprite.body.allowGravity =
  //   player.char.attackEnergy.gravity;
}

export function updateAttackEnergyOffscreen(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    let ae = player.char.attackEnergy;
    if (getIsAttackEnergyOffscreen(ae, game)) {
      ae.offscreenCurr = true;
    } else {
      ae.offscreenCurr = false;
    }

    ae.offscreenPrev = ae.offscreenCurr;
  });
}

export function getIsAttackEnergyOffscreen(
  attackEnergy: AttackEnergy,
  game: Game
): boolean {
  if (
    attackEnergy.sprite.y < 0 ||
    attackEnergy.sprite.y > SCREEN_DIMENSIONS.HEIGHT ||
    attackEnergy.sprite.x < 0 ||
    attackEnergy.sprite.x > SCREEN_DIMENSIONS.WIDTH
  ) {
    return true;
  }
  return false;
}

export function isAttackEnergyMoving(attackEnergy: AttackEnergy): boolean {
  if (
    attackEnergy.sprite.body.velocity.y < 0.1 ||
    attackEnergy.sprite.body.velocity.y > -0.1 ||
    attackEnergy.sprite.body.velocity.x < 0.1 ||
    attackEnergy.sprite.body.velocity.x > -0.1
  ) {
    return true;
  }
  return false;
}
export function isAttackEnergyNearPlayer(player: Player): boolean {
  let distance = 120;
  let a = player.char.attackEnergy.sprite;
  let p = player.char.sprite;
  if (
    a.x > p.x - distance &&
    a.x < p.x + distance &&
    a.y > p.y - distance &&
    a.y < p.y + distance
  ) {
    return true;
  }
  return false;
}

export function setAttackPhysicalOffscreen(player: Player, game: Game): void {
  player.char.attackPhysical.sprite.y = -1000;
  player.char.attackPhysical.sprite.x = SCREEN_DIMENSIONS.WIDTH / 2;
  player.char.attackPhysical.sprite.body.velocity.x = 0;
  player.char.attackPhysical.sprite.body.velocity.y = 0;
}

export function setAttackEnergyOffscreen(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  let ae = player.char.attackEnergy;

  ae.sprite.y = -1000 - playerIndex * 500;
  ae.sprite.x = SCREEN_DIMENSIONS.WIDTH / 2 + playerIndex * 500;
  ae.sprite.body.velocity.x = 0;
  ae.sprite.body.velocity.y = 0;
}

export function setBulletOffscreen(
  bulletIndex: number,
  player: Player,
  playerIndex: number,
  game: Game
): void {
  let b =
    player.char.attackEnergy.attackBullets?.bullets?.getChildren()[bulletIndex];

  if (!b) {
    return;
  }

  b.body.position.y = -1000 - playerIndex * 500;
  b.body.position.x = SCREEN_DIMENSIONS.WIDTH / 2 + playerIndex * 500;
  b.body.velocity.x = 0;
  b.body.velocity.y = 0;
}

export function updatePhysicalAttackFollowsPlayer(
  player: Player,
  game: Game
): void {
  let ap = player.char.attackPhysical;
  let ae = player.char.attackEnergy;
  let s = player.char.sprite;

  // FOR LINK SWORD
  // DON"T ALLOW AP IF AE
  if (
    ae.ON_SCREEN_PREVENT_ATTACK_PHYSICAL &&
    !getIsAttackEnergyOffscreen(ae, game)
  ) {
    return;
  }

  let pCooldown =
    (game.gameNanoseconds - ap.state.gameStamp) / ap.durationAttack;

  pCooldown = Math.pow(pCooldown, 0.5);
  // console.log(pCooldown);

  ap.sprite.y = s.y + ap.posFromCenter.y;

  if (s.flipX) {
    ap.sprite.x = s.x - ap.posFromCenter.x * pCooldown;

    ap.sprite.flipX = true;
  } else {
    ap.sprite.x = s.x + ap.posFromCenter.x * pCooldown;

    ap.sprite.flipX = false;
  }
}
