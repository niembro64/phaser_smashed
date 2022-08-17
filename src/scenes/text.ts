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

  game.players.forEach((player, playerIndex) => {
    player.text.setScale(
      1 / game.cameras.main.zoom,
      1 / game.cameras.main.zoom
    );
    player.text.x =
      game.cameraMover.char.sprite.x +
      game.playerLocations[playerIndex] * (1 / game.cameras.main.zoom);

    player.text.y = newY;
  });
}
