import { addEmitHelper } from 'typescript';
import Game from '../Game';
import { gameStatePlay } from '../gameStates.ts/gameStatePlay';

export function updateSplashes(game: Game, zoom: number, newY: number): void {
  game.splashes.forEach((splash, splashIndex) => {
    splash.text.setScale(1 / zoom, 1 / zoom);
    splash.text.x = game.cameraMover.char.sprite.x;
    splash.text.y = newY;
  });
}

export function turnOnSplash(
  splashName: 'none' | 'start' | 'first-blood' | 'screen-clear' | 'end',
  game: Game
): void {
  game.splashes.forEach((splash, splashIndex) => {
    splash.text.setAlpha(0);
    if (splash.name === splashName) {
      splash.text.setAlpha(1);
    }
  });
}

export function updateText(game: Game): void {
  const splashY = game.SCREEN_DIMENSIONS.HEIGHT - 700;
  const glassY = game.SCREEN_DIMENSIONS.HEIGHT - 200;
  const damageY = game.SCREEN_DIMENSIONS.HEIGHT - 120;

  const killsY = game.SCREEN_DIMENSIONS.HEIGHT;
  const zoom = game.cameras.main.zoom;
  const redOffsetY =
    game.cameraMover.char.sprite.y - game.cameraCenter.char.sprite.y;

  const newSplashY =
    splashY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newTopY =
    glassY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newUpperY =
    damageY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newLowerY =
    killsY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * ((-1 * 1) / Math.pow(zoom, 1) + 1);

  game.scoreBoardTimeGame.setScale(1 / zoom, 1 / zoom);
  game.scoreBoardTimeGame.x =
    game.cameraMover.char.sprite.x + game.textLocationLROffset * (1 / zoom);
  game.scoreBoardTimeGame.y = newUpperY;

  game.scoreBoardTimeTime.setScale(1 / zoom, 1 / zoom);
  game.scoreBoardTimeTime.x =
    game.cameraMover.char.sprite.x + game.textLocationLROffset * (1 / zoom);
  game.scoreBoardTimeTime.y = newLowerY;
  //  game.SCREEN_DIMENSIONS.HEIGHT / 2;

  updateClockText(game);
  updateGlasses(game, zoom, newTopY);
  updateDamageText(game, zoom, newUpperY);
  updateSplashes(game, zoom, newSplashY);
  updateDeathsKillsText(game, zoom, newLowerY);
}

export function updateClockText(game: Game): void {
  game.scoreBoardTimeGame.setText(
    game.gameClock.minutes.toString() +
      ':' +
      (game.gameClock.seconds < 10 ? '0' : '') +
      game.gameClock.seconds.toString()
  );
  game.scoreBoardTimeTime.setText(
    game.timeClock.minutes.toString() +
      ':' +
      (game.timeClock.seconds < 10 ? '0' : '') +
      game.timeClock.seconds.toString()
  );
}

export function updateShotsOnPlayers(game: Game) {
  game.players.forEach((player, playerIndex) => {
    player.shotCount = 0;
    for (let j = 0; j < game.PLAYER_CHOICES.length; j++) {
      player.shotCount += game.numberShotsTakenByMeMatrix[playerIndex][j];
    }
  });
}

export function updateGlassesTransparency(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.glass.setAlpha(0);

    if (player.gameState.name === 'dead' && game.state.name !== 'play') {
      player.glass.setAlpha(1);
    }
  });
}

export function updateGlasses(game: Game, zoom: number, newY: number): void {
  updateShotsOnPlayers(game);
  game.players.forEach((player, playerIndex) => {
    player.glass.setScale(1 / zoom / 5, 1 / zoom / 5);
    player.glass.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.textLocationLROffset -
        85) *
        (1 / zoom);

    player.glass.y = newY;
  });
}
export function updateDamageText(game: Game, zoom: number, newY: number): void {
  updateShotsOnPlayers(game);
  if (game.debug.statsInit) {
    game.players.forEach((player, playerIndex) => {
      player.scoreBoardDamage
        .setScale(1 / zoom, 1 / zoom)
        .setText(
          Math.round(player.char.damage).toString() +
            game.GAMEBAR_CHARS.damage +
            ' ' +
            player.shotCount.toString() +
            game.GAMEBAR_CHARS.shots
        );
      player.scoreBoardDamage.x =
        game.cameraMover.char.sprite.x +
        (game.textLocations[game.playerSpawnOrder[playerIndex]] +
          game.textLocationLROffset) *
          (1 / zoom);

      player.scoreBoardDamage.y = newY;
    });
    return;
  }
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDamage
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        Math.round(player.char.damage).toString() +
          game.GAMEBAR_CHARS.damage +
          ' ' +
          player.shotCount.toString() +
          game.GAMEBAR_CHARS.shots
      );
    player.scoreBoardDamage.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.textLocationLROffset) *
        (1 / zoom);

    player.scoreBoardDamage.y = newY;
  });
}
export function updateDeathsKillsText(
  game: Game,
  zoom: number,
  newY: number
): void {
  if (game.debug.statsInit) {
    game.players.forEach((player, playerIndex) => {
      player.scoreBoardDeathsKillsShots
        .setScale(1 / zoom, 1 / zoom)
        .setText(
          player.killCount.toString() +
            game.GAMEBAR_CHARS.kills +
            ' ' +
            player.deathCount.toString() +
            game.GAMEBAR_CHARS.deaths
        );
      player.scoreBoardDeathsKillsShots.x =
        game.cameraMover.char.sprite.x +
        (game.textLocations[game.playerSpawnOrder[playerIndex]] +
          game.textLocationLROffset) *
          (1 / zoom);

      player.scoreBoardDeathsKillsShots.y = newY;
    });
    return;
  }

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDeathsKillsShots
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        player.killCount.toString() +
          game.GAMEBAR_CHARS.kills +
          ' ' +
          player.deathCount.toString() +
          game.GAMEBAR_CHARS.deaths
      );
    player.scoreBoardDeathsKillsShots.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.textLocationLROffset) *
        (1 / zoom);

    player.scoreBoardDeathsKillsShots.y = newY;
  });
}
