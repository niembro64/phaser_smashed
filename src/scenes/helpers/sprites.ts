import Game from '../Game';
import { Player } from '../interfaces';
import { hasPlayerTouchedWallRecently } from './movement';

export function updateSpritesFlipX(game: Game): void {
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
    updateSpriteFilter(player, playerIndex, game);
  });
}

export function updateSpriteFilter(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (player.char.colorFilter) {
    if (player.state.name === 'player-state-hurt') {
      // HURT
      if (
        Math.floor(
          (game.gameNanoseconds - player.state.gameStamp) /
            game.DURATION_PLAYER_FILTER_FLICKER
        ) %
          2 ===
        0
      ) {
        filterPlayerColorRed(player);
      } else {
        filterPlayerSpriteColorStateNormal(player, playerIndex, game);
        // filterPlayerColorCircleFill(
        //   player,
        //   game.colorCircles[playerIndex].colorNumber
        // );
      }
    } else {
      // NOT HURT
      if (
        Math.floor(
          (game.gameNanoseconds - player.state.gameStamp) /
            game.DURATION_PLAYER_FILTER_FLICKER
        ) %
          2 ===
        0
      ) {
        filterPlayerColorDark(player);
      } else {
        // filterLight(player);
        filterPlayerSpriteColorStateNormal(player, playerIndex, game);
        // filterPlayerColorCircleFill(
        //   player,
        //   game.colorCircles[playerIndex].colorNumber
        // );
      }
    }
  } else {
    filterPlayerSpriteColorStateNormal(player, playerIndex, game);
  }
}

export function filterAttacksColorCircle(
  player: Player,
  circleColor: number
): void {
  player.char.attackEnergy.sprite.setTint(circleColor);
  player.char.attackEnergy.sprite.setAlpha(1);
  player.char.attackPhysical.sprite.setTint(circleColor);
  player.char.attackPhysical.sprite.setAlpha(1);
}
export function filterPlayerColorCircle(
  player: Player,
  circleColor: number
): void {
  // player.char.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.SCREEN);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.COLOR);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.ADD);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.LUMINOSITY);
  player.char.sprite.setTint(circleColor);
  // player.char.sprite.setTintFill(circleColor);
  player.char.sprite.setAlpha(1);
  // player.char.sprite.brighten(0.3);
}
export function filterPlayerColorCircleFill(
  player: Player,
  circleColor: number
): void {
  // player.char.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.SCREEN);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.COLOR);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.ADD);
  // player.char.sprite.setBlendMode(Phaser.BlendModes.LUMINOSITY);
  // player.char.sprite.setTint(circleColor);
  player.char.sprite.setTintFill(circleColor);
  player.char.sprite.setAlpha(1);
  // player.char.sprite.brighten(0.3);
}
export function filterPlayerColorRed(player: Player): void {
  player.char.sprite.setTint(0xaa3333);
  player.char.sprite.setAlpha(0.8);
}
export function filterPlayerColorDark(player: Player): void {
  player.char.sprite.setTint(0x555555);
  player.char.sprite.setAlpha(0.8);
}
export function filterPlayerColorLight(player: Player): void {
  player.char.sprite.setTint(0x888888);
  player.char.sprite.setAlpha(0.8);
}

export function filterPlayerSpriteColorStateNormal(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.setPlayerColorFilterStateNormalActive) {
    filterPlayerColorCircle(player, game.colorCircles[playerIndex].colorNumber);
    player.char.sprite.setAlpha(1);
  } else {
    player.char.sprite.setAlpha(1);
    player.char.sprite.setTint(0xffffff);
  }
}

export function setBlinkTrue(player: Player): void {
  player.char.colorFilter = true;
}
export function setBlinkFalse(player: Player): void {
  player.char.colorFilter = false;
}

export function filterAttackEnergyColorStateNormal(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.setPlayerColorFilterStateNormalActive) {
    filterAttacksColorCircle(
      player,
      game.colorCircles[playerIndex].colorNumber
    );
    player.char.attackEnergy.sprite.setAlpha(1);
    player.char.attackPhysical.sprite.setAlpha(1);
  } else {
    player.char.attackEnergy.sprite.setAlpha(1);
    player.char.attackEnergy.sprite.setTint(0xffffff);
    player.char.attackPhysical.sprite.setAlpha(1);
    player.char.attackPhysical.sprite.setTint(0xffffff);
  }
}
