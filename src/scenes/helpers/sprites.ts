import Game from "../Game";
import { Player } from "../interfaces";
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

export function updateAllSpriteFilters(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    updateSpriteFilter(player, game);
  });
}

export function updateSpriteFilter(player: Player, game: Game): void {
  if (player.char.colorFilter) {
    if (player.state.name === "hurt") {
      // HURT
      if (Math.floor(game.millisecondsTime / 100) % 2 === 0) {
        filterRed(player);
      } else {
        filterLight(player);
      }
    } else {
      // NOT HURT
      if (Math.floor(game.millisecondsTime / 100) % 2 === 0) {
        filterDark(player);
      } else {
        filterLight(player);
      }
    }
  } else {
    filterNormal(player);
  }
}

export function filterRed(player: Player): void {
  player.char.sprite.setTint(0xaa3333);
  player.char.sprite.setAlpha(0.8);
}
export function filterDark(player: Player): void {
  player.char.sprite.setTint(0x555555);
  player.char.sprite.setAlpha(0.8);
}
export function filterLight(player: Player): void {
  player.char.sprite.setTint(0x888888);
  player.char.sprite.setAlpha(0.8);
}

export function filterNormal(player: Player): void {
  player.char.sprite.setAlpha(1);
  player.char.sprite.setTint(0xffffff);
}

export function setBlinkTrue(player: Player): void {
  player.char.colorFilter = true;
}
export function setBlinkFalse(player: Player): void {
  player.char.colorFilter = false;
}
