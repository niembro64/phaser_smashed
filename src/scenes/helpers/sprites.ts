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

export function updateSpriteFilter(player: Player, game: Game): void {
  if (player.char.colorFilter) {
    if (player.state.name === "hurt") {
      // HURT
      if (Math.floor(game.millisecondsTime / 100) % 2 === 0) {
        setFilterDark(player);
      } else {
        setFilterLight(player);
      }
    } else {
      // NOT HURT
      if (Math.floor(game.millisecondsTime / 100) % 2 === 0) {
        setFilterDark(player);
      } else {
        setFilterLight(player);
      }
    }
    return;
  }
  filterOff(player);
}

export function setFilterRerd(player: Player): void {
  player.char.sprite.setTint(0xaa3333);
  player.char.sprite.setAlpha(0.8);
}
export function setFilterDark(player: Player): void {
  player.char.sprite.setTint(0x555555);
  player.char.sprite.setAlpha(0.8);
}
export function setFilterLight(player: Player): void {
  player.char.sprite.setTint(0x888888);
  player.char.sprite.setAlpha(0.8);
}

export function filterOff(player: Player): void {
  player.char.sprite.setAlpha(1);
  player.char.sprite.setTint(0xffffff);
}

export function setSpriteFilterTrue(player: Player): void {
  player.char.colorFilter = true;
}
export function setSpriteFilterFalse(player: Player): void {
  player.char.colorFilter = false;
}
