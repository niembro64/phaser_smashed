import Game from "./Game";

export function updateText(game: Game): void {
  const baseY = 0;

  game.scoreBoard.setText(
    "ZOOM " + Math.round(100 * game.cameras.main.zoom).toString() + "%"
  );
  // game.scoreBoard.setText(Math.round(game.players[2].char.sprite.y).toString());
  game.scoreBoard.setScale(
    1 / game.cameras.main.zoom,
    1 / game.cameras.main.zoom
  );
  game.scoreBoard.x = game.cameraMover.char.sprite.x;

  const newY =
    game.cameraMover.char.sprite.y *
    ((-1 * 1) / Math.pow(game.cameras.main.zoom, 1.2) + 1);

  game.scoreBoard.y = newY;
  // const newY =
  //   game.cameraMover.char.sprite.y *
  //   ((-1 * 1) / Math.pow(game.cameras.main.zoom, 1.2) + 1);

  // game.scoreBoard.y =
  //   game.scoreBoard.y * game.zoomRatioFast + newY * (1 - game.zoomRatioFast);
}

//   game.scoreBoard.y * game.zoomRatioFast +
//   (1 - game.zoomRatioFast) *
//     (game.cameraMover.char.sprite.y - game.CAMERA_OFFSET_Y) *
//     (1 - 1 / game.cameras.main.zoom);
