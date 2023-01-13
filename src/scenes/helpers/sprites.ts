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
          filterPlayerRed(player, playerIndex, game);
        } else {
          filterPlayerDark(player, playerIndex, game);
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
          filterPlayerRed(player, playerIndex, game);
        } else {
          filterPlayerNormal(player, playerIndex, game);
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
        filterPlayerDark(player, playerIndex, game);
      } else {
        filterPlayerNormal(player, playerIndex, game);
      }
    }
    return;
  }

  if (player.char.powerStateCurr.name === 'dark') {
    filterPlayerDark(player, playerIndex, game);
    return;
  }

  if (player.emitterPlayer.on) {
    filterPlayerID(player, playerIndex, game);
    return;
  }

  filterPlayerNormal(player, playerIndex, game);
}

////////////////////////
// FILTER PLAYERS
////////////////////////

export function filterPlayerTDark(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerTDark(player, game);
  } else {
    setTintPlayerTDark(player, game);
  }
}
export function filterPlayerDark(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerDark(player, game);
  } else {
    setTintPlayerDark(player, game);
  }
}

export function filterPlayerNormal(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerID(player, game.colorCircles[playerIndex].colorNumber);
  } else {
    setTintPlayerNormal(player, game);
  }
}

export function filterPlayerTRed(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerTRed(player, game);
  } else {
    setTintPlayerTRed(player, game);
  }
}
export function filterPlayerRed(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerRed(player, game);
  } else {
    setTintPlayerRed(player, game);
  }
}

export function filterPlayerID(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillPlayerID(player, game.colorCircles[playerIndex].colorNumber);
  } else {
    setTintPlayerID(player, game.colorCircles[playerIndex].colorNumber);
  }
}

export function setTintPlayerNormal(player: Player, game: Game): void {
  player.char.sprite.setTint(0xffffff);
  player.char.sprite.setAlpha(1);
}
export function setTintPlayerID(player: Player, circleColor: number): void {
  player.char.sprite.setTint(circleColor);
  player.char.sprite.setAlpha(1);
}
export function setTintPlayerRed(player: Player, game: Game): void {
  player.char.sprite.setTint(0xaa3333);
  player.char.sprite.setAlpha(1);
}
export function setTintPlayerTRed(player: Player, game: Game): void {
  player.char.sprite.setTint(0xaa3333);
  player.char.sprite.setAlpha(0.8);
}
export function setTintPlayerDark(player: Player, game: Game): void {
  player.char.sprite.setTint(0x444444);
  player.char.sprite.setAlpha(1);
}
export function setTintPlayerTDark(player: Player, game: Game): void {
  player.char.sprite.setTint(0x444444);
  player.char.sprite.setAlpha(0.8);
}
export function setTintPlayerLight(player: Player, game: Game): void {
  player.char.sprite.setTint(0xaaaaaa);
  player.char.sprite.setAlpha(1);
}
export function setTintPlayerTLight(player: Player, game: Game): void {
  player.char.sprite.setTint(0xaaaaaa);
  player.char.sprite.setAlpha(0.8);
}

// FILL
export function setFillPlayerID(player: Player, circleColor: number): void {
  player.char.sprite.setTint('transparent');
  player.char.sprite.setTintFill(circleColor);
  player.char.sprite.setAlpha(1);
}
export function setFillPlayerTDark(player: Player, game: Game): void {
  player.char.sprite.setTint('transparent');
  player.char.sprite.setTintFill(0x444444);
  player.char.sprite.setAlpha(0.8);
}
export function setFillPlayerDark(player: Player, game: Game): void {
  player.char.sprite.setTint('transparent');
  player.char.sprite.setTintFill(0x444444);
  player.char.sprite.setAlpha(1);
}
export function setFillPlayerRed(player: Player, game: Game): void {
  player.char.sprite.setTint('transparent');
  player.char.sprite.setTintFill(0xaa3333);
  player.char.sprite.setAlpha(1);
}
export function setFillPlayerTRed(player: Player, game: Game): void {
  player.char.sprite.setTint('transparent');
  player.char.sprite.setTintFill(0xaa3333);
  player.char.sprite.setAlpha(0.8);
}

// BLINK
export function setBlinkTrue(player: Player): void {
  player.char.colorFilter = true;
}
export function setBlinkFalse(player: Player): void {
  player.char.colorFilter = false;
}

////////////////
// FILTER ATTACKS
////////////////

export function filterAttackEnergyNormal(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (game.debug.CharacterTinted) {
    setFillAttacksID(player, game.colorCircles[playerIndex].colorNumber);
  } else {
    setTintAttacksNormal(player);
  }
}

export function setTintAttacksID(player: Player, circleColor: number): void {
  player.char.attackEnergy.sprite.setTint(circleColor);
  player.char.attackEnergy.sprite.setAlpha(1);
  player.char.attackPhysical.sprite.setTint(circleColor);
  player.char.attackPhysical.sprite.setAlpha(1);
}
export function setTintAttacksNormal(player: Player): void {
  player.char.attackEnergy.sprite.setTint(0xffffff);
  player.char.attackEnergy.sprite.setAlpha(1);
  player.char.attackPhysical.sprite.setTint(0xffffff);
  player.char.attackPhysical.sprite.setAlpha(1);
}
export function setFillAttacksID(player: Player, circleColor: number): void {
  player.char.attackEnergy.sprite.setTint('transparent');
  player.char.attackEnergy.sprite.setTintFill(circleColor);
  player.char.attackEnergy.sprite.setAlpha(1);
  player.char.attackPhysical.sprite.setTint('transparent');
  player.char.attackPhysical.sprite.setTintFill(circleColor);
  player.char.attackPhysical.sprite.setAlpha(1);
}

// player.char.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
// player.char.sprite.setBlendMode(Phaser.BlendModes.SCREEN);
// player.char.sprite.setBlendMode(Phaser.BlendModes.COLOR);
// player.char.sprite.setBlendMode(Phaser.BlendModes.ADD);
// player.char.sprite.setBlendMode(Phaser.BlendModes.LUMINOSITY);
// player.char.sprite.brighten(0.3);

/////////////////////
// SPRITSHEETS
/////////////////////

export function setAnimationsOff(game: Game): void {
  game.players.forEach((player) => {
    if (player.char.sprite?.anims) {
      player.char.sprite.anims.pause();
    }
  });
  if (game.chomp.sprite?.anims) {
    game.chomp.sprite.anims.pause();
  }
  for (let i = 0; i < game.lavas.length; i++) {
    game.lavas[i].sprite.anims.pause();
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
  for (let i = 0; i < game.lavas.length; i++) {
    game.lavas[i].sprite.anims.resume();
  }
}

export function updateSpritesheets(game: Game): void {
  const movingXThreshold = 10;
  const movingYThreshold = 40;
  // update player spritesheets
  game.players.forEach((player, playerIndex) => {
    if (player.char.srcSpriteSheet !== '') {
      let s = player.char.sprite;

      let tDown = s.body.touching.down;
      let tWall = s.body.touching.left || s.body.touching.right;
      let mUp = s.body.velocity.y < -movingYThreshold;
      let mDown = s.body.velocity.y > movingYThreshold;
      let mHoriz =
        s.body.velocity.x > movingXThreshold ||
        s.body.velocity.x < -movingXThreshold;

      let newSpriteStateName: SpriteStateName | null = null;

      if (tWall && !tDown && mDown) {
        newSpriteStateName = 'climb';
      } else if (tDown) {
        newSpriteStateName = mHoriz ? 'walk' : 'idle';
      } else if (mUp) {
        newSpriteStateName = 'jumpUp';
      } else if (mDown) {
        newSpriteStateName = 'jumpDown';
      }

      if (newSpriteStateName !== null) {
        updateSpriteState(newSpriteStateName, player, game);
      }
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
