import Game from "../Game";

export function updateText(game: Game): void {
  const baseY = 0;
  const zoom = game.cameras.main.zoom;
  const redOffsetY =
    game.cameraMover.char.sprite.y - game.cameraCenter.char.sprite.y;
  const newY =
    baseY +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * ((-1 * 1) / Math.pow(zoom, 1.2) + 1);

  game.scoreBoard.setScale(
    1 / game.cameras.main.zoom,
    1 / game.cameras.main.zoom
  );
  game.scoreBoard.x = game.cameraMover.char.sprite.x;
  game.scoreBoard.y = newY;

  updateCenterText(game);
  updatePlayerText(game, zoom, newY);
}

export function updateCenterText(game: Game): void {
  game.scoreBoard.setText(
    "ZOOM:" + Math.round(100 * game.cameras.main.zoom).toString() + "%"
  );
}

export function updatePlayerText(game: Game, zoom: number, newY: number): void {
  game.players.forEach((player, playerIndex) => {
    player.text
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        "P" +
          playerIndex.toString() +
          "x:" +
          Math.round(player.char.sprite.x).toString() +
          ""
      );
    player.text.x =
      game.cameraMover.char.sprite.x +
      game.textLocations[game.playerSpawnOrder[playerIndex]] * (1 / zoom);

    player.text.y = newY;
  });
}
