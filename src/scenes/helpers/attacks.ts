import Game from "../Game";
import { AttackEnergy, Player } from "../interfaces";
import { playerGrabAttackEnergy } from "./pad";

export function updateUpB(player: Player, game: Game): void {
  if (
    player.gamepad.up &&
    player.gamepad.X &&
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

export function updatePhysicalAttackFollowPlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.char.attackPhysical.sprite.y =
      player.char.sprite.y + player.char.attackPhysical.posFromCenter.y;

    // if (player.char.initializeCharPosition.lookingRight) {
    //   if (player.char.sprite.flipX) {
    //     player.char.attackPhysical.sprite.x =
    //       player.char.sprite.x - player.char.attackEnergy.posFromCenter.x;

    //     player.char.attackPhysical.sprite.flipX =
    //       player.char.initializeCharPosition.lookingRight;
    //   } else {
    //     player.char.attackPhysical.sprite.x =
    //       player.char.sprite.x + player.char.attackEnergy.posFromCenter.x;

    //     player.char.attackPhysical.sprite.flipX =
    //       !player.char.initializeCharPosition.lookingRight;
    //   }
    // } else {
    //   if (player.char.sprite.flipX) {
    //     player.char.attackPhysical.sprite.x =
    //       player.char.sprite.x + player.char.attackEnergy.posFromCenter.x;

    //     player.char.attackPhysical.sprite.flipX =
    //       player.char.initializeCharPosition.lookingRight;
    //   } else {
    //     player.char.attackPhysical.sprite.x =
    //       player.char.sprite.x - player.char.attackEnergy.posFromCenter.x;

    //     player.char.attackPhysical.sprite.flipX =
    //       !player.char.initializeCharPosition.lookingRight;
    //   }
    // }

    if (player.char.sprite.flipX) {
      player.char.attackPhysical.sprite.x =
        player.char.sprite.x - player.char.attackPhysical.posFromCenter.x;

      player.char.attackPhysical.sprite.flipX = true;
    } else {
      player.char.attackPhysical.sprite.x =
        player.char.sprite.x + player.char.attackPhysical.posFromCenter.x;

      player.char.attackPhysical.sprite.flipX = false;
    }
  });
}

// player.char.sprite.body.velocity.y

export function updateAttackPhysicalVisually(player: Player, game: Game): void {
  if (player.gamepad.A) {
    player.char.attackPhysical.sprite.setActive(true).setVisible(true);
  } else {
    player.char.attackPhysical.sprite
      .setActive(false)
      .setVisible(false);
  }
}
