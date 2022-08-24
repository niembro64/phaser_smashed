import Game from "../Game";
import { AttackEnergy, Player } from "../interfaces";
import { playerGrabAttackEnergy } from "./pad";

export function upB(player: Player, game: Game): void {
  if (
    player.pad.up &&
    player.pad.X &&
    !player.padPrev.X &&
    player.char.upB.canUse
  ) {
    game.SOUND_JUMP_POWER.play();
    player.char.sprite.body.setVelocityY(game.DEFAULT_UPB);
    player.char.upB.canUse = false;
  }
  if (player.char.sprite.body.touching.down) {
    player.char.upB.canUse = true;
  }
}

export function turnOffPhysicsAttackEnergy(player: Player): void {
  player.char.attackEnergy.sprite.body.enable = false;
  player.char.attackEnergy.sprite.body.allowGravity = false;
}
export function turnOnPhysicsAttackEnergy(player: Player): void {
  player.char.attackEnergy.sprite.body.enable = true;
  player.char.attackEnergy.sprite.body.allowGravity =
    player.char.attackEnergy.gravity;
}

export function isAttackEnergyOffscreen(
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

// player.char.sprite.body.velocity.y
