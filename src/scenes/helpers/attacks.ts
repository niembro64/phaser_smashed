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
}
export function turnOnPhysicsAttackEnergy(player: Player): void {
  player.char.attackEnergy.sprite.body.enable = true;
}
