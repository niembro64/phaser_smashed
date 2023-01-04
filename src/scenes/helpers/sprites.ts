import Game from '../Game';
import { Player, SpriteStateName } from '../interfaces';
import { hasPlayerTouchedWallRecently } from './movement';
import { getHasBeenGameDurationSinceMoment } from './powers';

export function updateSpritesFlipX(game: Game): void {
  game.players.forEach((player) => {
    if (!hasPlayerTouchedWallRecently(player)) {
      if (player.char.sprite.body.velocity.x === 0) {
      } else if (player.char.sprite.body.velocity.x > 0) {
        player.char.sprite.flipX = false;
      } else {
        player.char.sprite.flipX = true;
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
      if (player.char.powerStateCurr.name === 'dark') {
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
          filterPlayerSpriteColorStateDark(player, playerIndex, game);
        }
      } else {
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
        }
      }
    }
    if (player.state.name !== 'player-state-hurt') {
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
        filterPlayerSpriteColorStateNormal(player, playerIndex, game);
      }
    }
    return;
  }

  if (player.char.powerStateCurr.name === 'dark') {
    filterPlayerSpriteColorStateDark(player, playerIndex, game);
    return;
  }

  if (player.emitterPlayer.on) {
    filterPlayerColorCircle(player, game.colorCircles[playerIndex].colorNumber);
    return;
  }

  filterPlayerSpriteColorStateNormal(player, playerIndex, game);
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
  player.char.sprite.setTint('transparent');
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

export function filterPlayerSpriteColorStateDark(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  player.char.sprite.setAlpha(1);
  player.char.sprite.setTint(0x888888);
}

export function filterPlayerSpriteColorStateNormal(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
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
  if (game.debug.CharacterTinted) {
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

export function setAnimationsOff(game: Game): void {
  game.players.forEach((player) => {
    if (player.char.sprite?.anims) {
      player.char.sprite.anims.pause();
    }
  });
  if (game.chomp.sprite?.anims) {
    game.chomp.sprite.anims.pause();
  }
}

export function setAnimationsOn(game: Game): void {
  game.players.forEach((player) => {
    if (player.char.sprite?.anims) {
      player.char.sprite.anims.resume();
    }
  });
  if (game.chomp.sprite?.anims) {
    game.chomp.sprite.anims.resume();
  }
}

/////////////////////
// spritesheets
/////////////////////

export function updateSpritesheets(game: Game): void {
  const movingXThreshold = 10;
  // update player spritesheets
  game.players.forEach((player, playerIndex) => {
    if (player.char.srcSpriteSheet !== '') {
      let s = player.char.sprite;
      let n = player.char.name;

      let tDown = s.body.touching.down;
      let tWall = s.body.touching.left || s.body.touching.right;
      let movingUp = s.body.velocity.y <= 0;
      let movingHoriz =
        s.body.velocity.x > movingXThreshold ||
        s.body.velocity.x < -movingXThreshold;

      let newSpriteStateName: SpriteStateName;

      if (tWall && !tDown && !movingUp) {
        newSpriteStateName = 'climb';
      } else if (tDown) {
        newSpriteStateName = movingHoriz ? 'walk' : 'idle';
      } else {
        newSpriteStateName = movingUp ? 'jumpUp' : 'jumpDown';
      }

      updateSpriteState(newSpriteStateName, player, game);
    }
  });
}

export function updateSpriteState(
  newState: SpriteStateName,
  player: Player,
  game: Game
): void {
  if (player.char.srcSpriteSheet !== '') {
    if (newState === player.char.ssCurr.name) {
      return;
    }

    if (
      !getHasBeenGameDurationSinceMoment(
        100,
        player.char.ssCurr.timeStamp,
        game
      )
    ) {
      return;
    }

    // console.log('TOUCHING', player.char.sprite.body.touching.down);

    player.char.ssPrev.name = player.char.ssCurr.name;
    player.char.ssPrev.timeStamp = player.char.ssCurr.timeStamp;
    player.char.ssCurr.name = newState;
    player.char.ssCurr.timeStamp = game.gameNanoseconds;

    let curr = player.char.ssCurr.name;
    let n = player.char.name;
    let s = player.char.sprite;

    switch (curr) {
      case 'idle':
        s.anims.play(n + '_idle', true);
        break;
      case 'walk':
        s.anims.play(n + '_walk', true);
        break;
      case 'jumpUp':
        s.anims.play(n + '_jumpUp', true);
        break;
      case 'jumpDown':
        s.anims.play(n + '_jumpDown', true);
        break;
      case 'climb':
        s.anims.play(n + '_climb', true);
        break;
    }
  }
}
