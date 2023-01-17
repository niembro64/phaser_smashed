import Game, { SCREEN_DIMENSIONS } from '../Game';
import { Loc } from '../interfaces';

export function updateCamera(game: Game): void {
  if (game.debug.DevMode || !game.debug.Camera) {
    game.cameras.main.zoom = game.debug.DevZoom / 10;
    return;
  }
  var cPlayer = getCameraPlayerStatus(game);
  var cMover = getCameraMoverStatus(game);
  var cBorder = getCameraBorderStatus(game);
  var cBox = getCameraBoxStatus(game);

  game.cameraPlayers.char.sprite.x = cPlayer.x;
  game.cameraPlayers.char.sprite.y = cPlayer.y;
  game.cameraPlayers.char.zoom = game.cameraPlayers.char.zoom = cPlayer.zoom;

  game.cameraMover.char.sprite.x =
    game.cameraMover.char.sprite.x * game.ZOOM_RATIO_FAST +
    cMover.x * (1 - game.ZOOM_RATIO_FAST);
  game.cameraMover.char.sprite.y =
    game.cameraMover.char.sprite.y * game.ZOOM_RATIO_FAST +
    (cMover.y + game.CAMERA_OFFSET_Y) * (1 - game.ZOOM_RATIO_FAST);
  game.cameraMover.char.zoom = game.cameraMover.char.zoom = cMover.zoom;

  game.cameraPlayersHalfway.char.sprite.x = cBorder.x;
  game.cameraPlayersHalfway.char.sprite.y = cBorder.y;
  game.cameraPlayersHalfway.char.zoom = game.cameraPlayersHalfway.char.zoom =
    cBorder.zoom;

  game.cameraBox.char.sprite.x = cBox.x;
  game.cameraBox.char.sprite.y = cBox.y;
  game.cameraBox.char.zoom = game.cameraBox.char.zoom = cBox.zoom;

  var newZoom = game.cameraPlayers.char.zoom;
  // var newZoom = game.cameraPlayers.char.zoom * game.ZOOM_MULTIPLIER_X;
  // var newZoom = Math.max(game.cameraPlayers.char.zoom, 1);

  game.cameras.main.startFollow(game.cameraMover.char.sprite);

  if (game.cameras.main.zoom < newZoom) {
    game.cameras.main.zoom =
      game.cameras.main.zoom * game.ZOOM_RATIO_SLOW +
      newZoom * (1 - game.ZOOM_RATIO_SLOW);
  } else {
    game.cameras.main.zoom =
      game.cameras.main.zoom * game.ZOOM_RATIO_FAST +
      newZoom * (1 - game.ZOOM_RATIO_FAST);
  }
  // var newZoom = game.cameraPlayers.char.zoom;

  // if (game.cameras.main.zoom < newZoom) {
  //   game.cameras.main.zoom =
  //     game.cameras.main.zoom * game.zoomRatioSlow + newZoom * (1 - game.zoomRatioSlow);
  // } else {
  //   game.cameras.main.zoom =
  //     game.cameras.main.zoom * game.zoomRatioFast + newZoom * (1 - game.zoomRatioFast);
  // }
}

export function getBorderZoom(game: Game): number {
  var curr_x: number = 0;
  var curr_y: number = 0;

  if (game.cameraPlayers.char.sprite.x < SCREEN_DIMENSIONS.WIDTH / 2) {
    curr_x = game.BORDER_PADDING_X + game.cameraPlayers.char.sprite.x;
  } else {
    curr_x =
      game.BORDER_PADDING_X +
      SCREEN_DIMENSIONS.WIDTH -
      game.cameraPlayers.char.sprite.x;
  }

  if (game.cameraPlayers.char.sprite.y < SCREEN_DIMENSIONS.HEIGHT / 2) {
    curr_y = game.BORDER_PADDING_Y + game.cameraPlayers.char.sprite.y;
  } else {
    curr_y =
      game.BORDER_PADDING_Y +
      SCREEN_DIMENSIONS.HEIGHT -
      game.cameraPlayers.char.sprite.y;
  }

  let return_x = 1 / ((curr_x * 2) / SCREEN_DIMENSIONS.WIDTH);
  let return_y = 1 / ((curr_y * 2) / SCREEN_DIMENSIONS.HEIGHT);

  return Math.max(return_x, return_y);
}

export function getPlayerZoom(game: Game): number {
  let curr_x = 0;
  let curr_y = 0;

  game.players.forEach((player, playerIndex) => {
    if (
      Math.abs(
        game.BORDER_PADDING_X +
          player.char.sprite.x -
          game.cameraPlayers.char.sprite.x
      ) > curr_x
    ) {
      curr_x = Math.abs(
        game.BORDER_PADDING_X +
          player.char.sprite.x -
          game.cameraPlayers.char.sprite.x
      );
    }
  });
  game.players.forEach((player, playerIndex) => {
    if (
      Math.abs(
        game.BORDER_PADDING_Y +
          player.char.sprite.y -
          game.cameraPlayers.char.sprite.y
      ) > curr_y
    ) {
      curr_y = Math.abs(
        game.BORDER_PADDING_Y +
          player.char.sprite.y -
          game.cameraPlayers.char.sprite.y
      );
    }
  });

  let return_x = 1 / ((curr_x * 2) / SCREEN_DIMENSIONS.WIDTH);
  let return_y = 1 / ((curr_y * 2) / SCREEN_DIMENSIONS.HEIGHT);

  return Math.min(
    return_x * game.ZOOM_MULTIPLIER_X,
    return_y * game.ZOOM_MULTIPLIER_Y
  );
}

export function getCameraBorderStatus(game: Game): Loc {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  return {
    x: ((x_low + x_high) / 2 + SCREEN_DIMENSIONS.WIDTH / 2) / 2,
    y: ((y_low + y_high) / 2 + SCREEN_DIMENSIONS.HEIGHT / 2) / 2,
    zoom: getBorderZoom(game),
  };
}

export function getCameraPlayerStatus(game: Game): Loc {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  x_low =
    game.cameraCenter.char.sprite.x > x_low
      ? x_low
      : game.cameraCenter.char.sprite.x;
  x_high =
    game.cameraCenter.char.sprite.x < x_high
      ? x_high
      : game.cameraCenter.char.sprite.x;
  y_low =
    game.cameraCenter.char.sprite.y > y_low
      ? y_low
      : game.cameraCenter.char.sprite.y;
  y_high =
    game.cameraCenter.char.sprite.y < y_high
      ? y_high
      : game.cameraCenter.char.sprite.y;

  return {
    x: (x_low + x_high) / 2,
    y: (y_low + y_high) / 2,
    zoom: getPlayerZoom(game),
  };
}

export function getCameraMoverStatus(game: Game): Loc {
  // var x_low: number = Infinity;
  // var x_high: number = 0;
  // var y_low: number = Infinity;
  // var y_high: number = 0;

  var spritePlayer = game.cameraPlayers.char.sprite;
  // var spriteMover = game.cameraMover.char.sprite;
  var spriteCenter = game.cameraCenter.char.sprite;

  game.cameraMoverZoomStatusKeeper =
    game.cameraMoverZoomStatusKeeper * game.ZOOM_RATIO_SLOW +
    Math.max(getPlayerZoom(game), 1) * (1 - game.ZOOM_RATIO_SLOW);

  var percentCloseToCenter = Math.pow(1 / game.cameraMoverZoomStatusKeeper, 3);

  let x =
    spritePlayer.x * (1 - percentCloseToCenter) +
    spriteCenter.x * percentCloseToCenter;
  let y =
    spritePlayer.y * (1 - percentCloseToCenter) +
    spriteCenter.y * percentCloseToCenter;

  return {
    x: x,
    y: y,
    zoom: getPlayerZoom(game),
  };
}

export function getCameraBoxStatus(game: Game): Loc {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  var x = Math.max(SCREEN_DIMENSIONS.WIDTH / 4, (x_low + x_high) / 2);
  var y = Math.max(SCREEN_DIMENSIONS.HEIGHT / 4, (y_low + y_high) / 2);

  x = Math.min((SCREEN_DIMENSIONS.WIDTH / 4) * 3, x);
  y = Math.min((SCREEN_DIMENSIONS.HEIGHT / 4) * 3, y);

  return {
    x: x,
    y: y,
    zoom: 2,
  };
}
