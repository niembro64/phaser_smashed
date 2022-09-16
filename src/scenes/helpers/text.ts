import Game from "../Game";
import { SplashName } from "../interfaces";
import { isPlayerReady } from "./pad";
import { pauseReadySoundPlayer, playReadySoundPlayer } from "./sound";

export function updateSplashes(game: Game, zoom: number, newY: number): void {
  game.splashRules.forEach((splash, splashIndex) => {
    splash.text.setScale(1 / zoom, 1 / zoom);
    splash.text.x = game.cameraMover.char.sprite.x;
    splash.text.y = newY;
  });
}

export function turnOnSplashRule(splashName: SplashName, game: Game): void {
  game.splashRules.forEach((splash, splashIndex) => {
    splash.text.setAlpha(0);
    if (splash.name === splashName) {
      splash.text.setAlpha(1);
    }
  });

  if (splashName !== "none") {
    game.splashRules[0].text.setAlpha(1);
  } else {
    game.splashRules[0].text.setAlpha(0);
  }
}

export function updateText(game: Game): void {
  const dataY = game.SCREEN_DIMENSIONS.HEIGHT / 16;
  const splashY = game.SCREEN_DIMENSIONS.HEIGHT / 2;
  const controllerY = game.SCREEN_DIMENSIONS.HEIGHT - 150;
  const glassY = game.SCREEN_DIMENSIONS.HEIGHT - 150;
  const damageY = game.SCREEN_DIMENSIONS.HEIGHT - 120;

  const killsY = game.SCREEN_DIMENSIONS.HEIGHT;
  const zoom = game.cameras.main.zoom;
  const redOffsetY =
    game.cameraMover.char.sprite.y - game.cameraCenter.char.sprite.y;

  const newDataY =
    dataY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newSplashY =
    splashY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newControllerY =
    controllerY * (1 / zoom) +
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
  updateControllerText(game, zoom, newControllerY);
  updateReadyText(game, zoom, newTopY);
  updateSplashes(game, zoom, newSplashY);
  updateDeathsKillsText(game, zoom, newLowerY);

  updateEndDataMatrices(game, zoom, newDataY);
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
    player.shotGlass.setScale(0.7 / zoom, 0.7 / zoom);
    player.shotGlass.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.glassLocationLROffset) *
        (1 / zoom);

    player.shotGlass.y = newY;
  });
}

export function updateDamageText(game: Game, zoom: number, newY: number): void {
  updateShotsOnPlayers(game);
  // if (game.debug.statsInit) {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardUpper
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        Math.round((100 / (100 + player.char.damage)) * 100).toString() +
          game.GAMEBAR_CHARS.damage +
          "  " +
          player.shotCount.toString() +
          game.GAMEBAR_CHARS.shots
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

export function updateReadyText(game: Game, zoom: number, newY: number): void {
  game.players.forEach((player, playerIndex) => {
    if (game.state.name === "play" || game.state.name === "end") {
      player.scoreBoardReady.setAlpha(0);
    } else {
      if (isPlayerReady(player, game)) {
        player.scoreBoardReady.setAlpha(1);
        playReadySoundPlayer(player);
      } else {
        player.scoreBoardReady.setAlpha(0);
        pauseReadySoundPlayer(player);
      }
    }
  });

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardReady.setScale(1 / zoom, 1 / zoom);

    player.scoreBoardReady.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.readyLocationLROffset) *
        (1 / zoom);

    player.scoreBoardReady.y = newY;
  });
  return;
}
export function updateControllerText(
  game: Game,
  zoom: number,
  newY: number
): void {
  game.players.forEach((player, playerIndex) => {
    if (game.state.name === "play" || game.state.name === "end") {
      player.scoreBoardController.setAlpha(0);
    } else {
      if (isPlayerReady(player, game)) {
        player.scoreBoardController.setAlpha(1);
        playReadySoundPlayer(player);
      } else {
        player.scoreBoardController.setAlpha(0);
        pauseReadySoundPlayer(player);
      }
    }
  });

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardController.setScale(1 / zoom, 1 / zoom);

    player.scoreBoardController.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.readyLocationLROffset) *
        (1 / zoom);

    player.scoreBoardController.y = newY;
  });
  return;
}

export function updateDeathsKillsText(
  game: Game,
  zoom: number,
  newY: number
): void {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardLower
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        player.killCount.toString() +
          game.GAMEBAR_CHARS.kills +
          "" +
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
export function updateEndDataMatrices(
  game: Game,
  zoom: number,
  newY: number
): void {
  let numSplashes: number = game.splashesEndData.length;

  game.splashesEndData.forEach((splash, splashIndex) => {
    // for (let i = 0; i < game.players.length; i++) {
    //   splash.text.push([""]);
    //   for (let j = 0; j < game.players.length; j++) {
    //     splash.text.push([""]);
    //   }
    // }
    splash.text.setScale(1 / zoom, 1 / zoom);
    for (let i = 0; i < game.players.length; i++) {
      switch (splashIndex) {
        case 0:
          splash.words[i] = "[";
          break;
        case 1:
          splash.words[i] = "[";
          break;
        case 2:
          splash.words[i] = "[";
          break;
        default:
          splash.words[i] = "[";
      }
      for (let j = 0; j < game.players.length; j++) {
        switch (splashIndex) {
          case 0:
            if (game.numberHitByMatrix[i][j] < 10) {
              splash.words[i] += " ";
            }
            if (game.numberHitByMatrix[i][j] === 0) {
              splash.words[i] += " ";
            } else {
              splash.words[i] += game.numberHitByMatrix[i][j].toString();
            }
            break;
          case 1:
            if (game.numberKilledByMatrix[i][j] < 10) {
              splash.words[i] += " ";
            }
            if (game.numberKilledByMatrix[i][j] === 0) {
              splash.words[i] += " ";
            } else {
              splash.words[i] += game.numberKilledByMatrix[i][j].toString();
            }
            break;
          case 2:
            if (game.numberShotsTakenByMeMatrix[i][j] < 10) {
              splash.words[i] += " ";
            }
            if (game.numberShotsTakenByMeMatrix[i][j] === 0) {
              splash.words[i] += " ";
            } else {
              splash.words[i] +=
                game.numberShotsTakenByMeMatrix[i][j].toString();
            }
            break;
          default:
            splash.words[i] += "XXX";
        }
        splash.words[i] += j === game.players.length - 1 ? "" : ",";
      }
      splash.words[i] += "] " + game.players[i].char.name;
    }
    splash.text.setText(splash.words);
    splash.text.x =
      game.cameraMover.char.sprite.x +
      ((game.splashEndDataOffset +
        game.SCREEN_DIMENSIONS.WIDTH *
          (Math.floor(numSplashes / 2) - splashIndex)) /
        (numSplashes + 1)) *
        (1 / zoom);

    splash.text.y = newY;
  });
}

// export function updateEndDataMatrices(
//   game: Game,
//   zoom: number,
//   newEndSplashY: number
// ): void {
//   let numSplashes: number = game.splashesEndData.length;

//   // game.splashesEndData.forEach((splash, splashIndex) => {
//   //   // game.SCREEN_DIMENSIONS.WIDTH * ((splashIndex + 1) / (numSplashes + 1)),
//   //   // game.SCREEN_DIMENSIONS.HEIGHT / 6,
//   // });

//   game.splashesEndData.forEach((splash, splashIndex) => {
//     splash.text.setText("ASDF");
//     splash.text.setScale(1 / zoom, 1 / zoom);
//     splash.text.x =
//       game.cameraMover.char.sprite.x +
//       (game.SCREEN_DIMENSIONS.WIDTH * ((splashIndex + 1) / (numSplashes + 1))) /
//         5;

//     splash.text.y = newEndSplashY;
//   });
// }
