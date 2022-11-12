import Game from '../Game';
import { AttackEnergy, Player } from '../interfaces';

export function updateJumpEnergy(player: Player, game: Game): void {
  if (
    player.padCurr.up &&
    player.padCurr.B &&
    !player.padPrev.B &&
    // player.padCurr.X &&
    // !player.padPrev.X &&
    player.char.upB.canUse
  ) {
    game.SOUND_JUMP_ENERGY.play();
    player.char.sprite.body.setVelocityY(game.BASE_PLAYER_JUMP_ENERGY);
    player.char.sprite.body.setVelocityX(0);
    player.char.upB.canUse = false;
    player.emitterPlayer.active = true;
    // player.emitterPlayer.visible = true;
    player.emitterPlayer.on = true;
    // player.emitterPlayer.setAlpha(1);
    setTimeout(() => {
      player.emitterPlayer.on = false;
    }, 200);
  }
  if (
    player.char.sprite.body.touching.down ||
    player.char.sprite.body.touching.left ||
    player.char.sprite.body.touching.right
  ) {
    player.char.upB.canUse = true;
    player.emitterPlayer.on = false;
    // player.emitterPlayer.active = false;
    // player.emitterPlayer.setAlpha(0);
    // player.emitterPlayer.setALpha(0.5);
    // player.emitterPlayer.stop;
    // setTimeout(() => {
    //   player.emitterPlayer.active = false;
    //   player.emitterPlayer.visible = false;
    // }, 300);
  }
  // if (player.char.sprite.body.velocity.y > 0) {
  //   player.emitterPlayer.on = false;
  // }
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

export function getIsAttackEnergyOffscreen(
  attackEnergy: AttackEnergy,
  game: Game
): boolean {
  if (
    attackEnergy.sprite.y < 0 ||
    attackEnergy.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT ||
    attackEnergy.sprite.x < 0 ||
    attackEnergy.sprite.x > game.SCREEN_DIMENSIONS.WIDTH
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
  let distance = 100;
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

export function setPhysicalAttackOffscreen(player: Player, game: Game): void {
  player.char.attackPhysical.sprite.y = -300;
  player.char.attackPhysical.sprite.x = game.SCREEN_DIMENSIONS.WIDTH / 2;
}
export function updatePhysicalAttackFollowsPlayer(
  player: Player,
  game: Game
): void {
  player.char.attackPhysical.sprite.y =
    player.char.sprite.y + player.char.attackPhysical.posFromCenter.y;

  if (player.char.sprite.flipX) {
    player.char.attackPhysical.sprite.x =
      player.char.sprite.x - player.char.attackPhysical.posFromCenter.x;

    player.char.attackPhysical.sprite.flipX = true;
  } else {
    player.char.attackPhysical.sprite.x =
      player.char.sprite.x + player.char.attackPhysical.posFromCenter.x;

    player.char.attackPhysical.sprite.flipX = false;
  }
}

// export function updatePhysicalAttackFollowPlayers(game: Game): void {
//   game.players.forEach((player, playerIndex) => {
//     player.char.attackPhysical.sprite.y =
//       player.char.sprite.y + player.char.attackPhysical.posFromCenter.y;

//     if (player.char.sprite.flipX) {
//       player.char.attackPhysical.sprite.x =
//         player.char.sprite.x - player.char.attackPhysical.posFromCenter.x;

//       player.char.attackPhysical.sprite.flipX = true;
//     } else {
//       player.char.attackPhysical.sprite.x =
//         player.char.sprite.x + player.char.attackPhysical.posFromCenter.x;

//       player.char.attackPhysical.sprite.flipX = false;
//     }
//   });
// }
