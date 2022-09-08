import Game from "../Game";
import { isPlayerReady } from "./pad";
import { pauseReadySound, pauseReadySoundPlayer, playReadySound, playReadySoundPlayer } from "./sound";

export function updateSplashes(game: Game, zoom: number, newY: number): void {
  game.splashes.forEach((splash, splashIndex) => {
    splash.text.setScale(1 / zoom, 1 / zoom);
    splash.text.x = game.cameraMover.char.sprite.x;
    splash.text.y = newY;
  });
}

export function turnOnSplash(
  splashName: "none" | "start" | "first-blood" | "screen-clear" | "end",
  game: Game
): void {
  game.splashes.forEach((splash, splashIndex) => {
    splash.text.setAlpha(0);
    if (splash.name === splashName) {
      splash.text.setAlpha(1);
    }
  });

  if (splashName !== "none") {
    game.splashes[0].text.setAlpha(1);
  } else {
    game.splashes[0].text.setAlpha(0);
  }
}

export function updateText(game: Game): void {
  const splashY = game.SCREEN_DIMENSIONS.HEIGHT / 2;
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
  game.scoreBoardTimeGame.x = game.cameraMover.char.sprite.x;
  // game.cameraMover.char.sprite.x + game.textLocationLROffset * (1 / zoom);
  game.scoreBoardTimeGame.y = newUpperY;

  game.scoreBoardTimeTime.setScale(1 / zoom, 1 / zoom);
  game.scoreBoardTimeTime.x = game.cameraMover.char.sprite.x;
  // game.cameraMover.char.sprite.x + game.textLocationLROffset * (1 / zoom);
  game.scoreBoardTimeTime.y = newLowerY;
  //  game.SCREEN_DIMENSIONS.HEIGHT / 2;

  updateClockText(game);
  updateGlasses(game, zoom, newTopY);
  updateDamageText(game, zoom, newUpperY);
  updateReadyText(game, zoom, newTopY);
  updateSplashes(game, zoom, newSplashY);
  updateDeathsKillsText(game, zoom, newLowerY);
}

export function updateClockText(game: Game): void {
  game.scoreBoardTimeGame.setText(
    game.gameClock.minutes.toString() +
      ":" +
      (game.gameClock.seconds < 10 ? "0" : "") +
      game.gameClock.seconds.toString()
  );
  game.scoreBoardTimeTime.setText(
    game.timeClock.minutes.toString() +
      ":" +
      (game.timeClock.seconds < 10 ? "0" : "") +
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
    player.shotGlass.setAlpha(0);

    if (player.state.name === "dead" && game.state.name !== "play") {
      player.shotGlass.setAlpha(1);
    }
  });
}

export function updateGlasses(game: Game, zoom: number, newY: number): void {
  updateShotsOnPlayers(game);
  game.players.forEach((player, playerIndex) => {
    player.shotGlass.setScale(1 / zoom / 5, 1 / zoom / 5);
    player.shotGlass.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.glassLocationLROffset -
        85) *
        (1 / zoom);

    player.shotGlass.y = newY;
  });
}

export function updateDamageText(game: Game, zoom: number, newY: number): void {
  updateShotsOnPlayers(game);
  if (game.debug.statsInit) {
    game.players.forEach((player, playerIndex) => {
      player.scoreBoardUpper
        .setScale(1 / zoom, 1 / zoom)
        .setText(
          Math.round(player.char.damage).toString() +
            game.GAMEBAR_CHARS.damage +
            "  " +
            game.GAMEBAR_CHARS.shots +
            player.shotCount.toString()
        );
      player.scoreBoardUpper.x =
        game.cameraMover.char.sprite.x +
        (game.textLocations[game.playerSpawnOrder[playerIndex]] +
          game.upperTextLocationLROffset) *
          (1 / zoom);

      player.scoreBoardUpper.y = newY;
    });
    return;
  }
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardUpper
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        Math.round(player.char.damage).toString() +
          game.GAMEBAR_CHARS.damage +
          " " +
          player.shotCount.toString() +
          game.GAMEBAR_CHARS.shots
      );
    player.scoreBoardUpper.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.lowerTextLocationLROffset) *
        (1 / zoom);

    player.scoreBoardUpper.y = newY;
  });
}
// export function updateSomeReadySound(game: Game): void {
//   let numPlayersReady = 0;
//   let play = false;
//   game.players.forEach((player, playerIndex) => {
//     if (isPlayerReady(player, game)) {
//       numPlayersReady++;
//     }
//   });
//   if (numPlayersReady === game.PLAYER_CHOICES.length - 1) {
//     playReadySound(game);
//   } else {
//     pauseReadySound(game);
//   }
// }

export function updateReadyText(game: Game, zoom: number, newY: number): void {
  game.players.forEach((player, playerIndex) => {
    if (game.state.name === "play" || game.state.name === "end") {
      player.scoreBoardNameReady.setAlpha(0);
    } else {
      if (isPlayerReady(player, game)) {
        player.scoreBoardNameReady.setAlpha(1);
        playReadySoundPlayer(player);
      } else {
        player.scoreBoardNameReady.setAlpha(0);
        pauseReadySoundPlayer(player);
      }
    }
  });



  if (game.debug.statsInit) {
    game.players.forEach((player, playerIndex) => {
      player.scoreBoardNameReady.setScale(1 / zoom, 1 / zoom);

      player.scoreBoardNameReady.x =
        game.cameraMover.char.sprite.x +
        game.textLocations[game.playerSpawnOrder[playerIndex]] * (1 / zoom);

      player.scoreBoardNameReady.y = newY;
    });
    return;
  }
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardNameReady
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        Math.round(player.char.damage).toString() +
          game.GAMEBAR_CHARS.damage +
          " " +
          player.shotCount.toString() +
          game.GAMEBAR_CHARS.shots
      );
    player.scoreBoardNameReady.x =
      game.cameraMover.char.sprite.x +
      game.textLocations[game.playerSpawnOrder[playerIndex]] * (1 / zoom);

    player.scoreBoardNameReady.y = newY;
  });
}

export function updateDeathsKillsText(
  game: Game,
  zoom: number,
  newY: number
): void {
  if (game.debug.statsInit) {
    game.players.forEach((player, playerIndex) => {
      player.scoreBoardLower
        .setScale(1 / zoom, 1 / zoom)
        .setText(
          player.killCount.toString() +
            game.GAMEBAR_CHARS.kills +
            " " +
            player.deathCount.toString() +
            game.GAMEBAR_CHARS.deaths
        );
      player.scoreBoardLower.x =
        game.cameraMover.char.sprite.x +
        (game.textLocations[game.playerSpawnOrder[playerIndex]] +
          game.lowerTextLocationLROffset) *
          (1 / zoom);

      player.scoreBoardLower.y = newY;
    });
    return;
  }

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardLower
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        player.killCount.toString() +
          game.GAMEBAR_CHARS.kills +
          " " +
          player.deathCount.toString() +
          game.GAMEBAR_CHARS.deaths
      );
    player.scoreBoardLower.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.lowerTextLocationLROffset) *
        (1 / zoom);

    player.scoreBoardLower.y = newY;
  });
}
