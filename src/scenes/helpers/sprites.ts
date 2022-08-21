import Game from "../Game";
import { hasPlayerTouchedWallRecently } from "./movement";

export function updateSpritesLR(game: Game): void {
  game.players.forEach((player) => {
    if (!hasPlayerTouchedWallRecently(player)) {
      if (player.char.sprite.body.velocity.x === 0) {
      } else if (player.char.sprite.body.velocity.x > 0) {
        player.char.sprite.flipX = false;
        // player.char.sprite.scaleX = 1;
      } else {
        player.char.sprite.flipX = true;
        // player.char.sprite.scaleX = -1;
      }
    }
  });
}
