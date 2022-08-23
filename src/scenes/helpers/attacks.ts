import Game from "../Game";
import { Player } from "../interfaces";

export function upB(player: Player, game: Game): void {
  if (
    player.pad.up &&
    player.pad.X &&
    !player.padPrev.X &&
    player.char.upB.canUse
  ) {
    player.char.sprite.body.setVelocityY(game.DEFAULT_UPB);
    player.char.upB.canUse = false;
  }
  if (player.char.sprite.body.touching.down) {
    player.char.upB.canUse = true;
  }
}
