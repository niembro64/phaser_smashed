import Game from "../Game";

export function updateText(game: Game): void {
  const baseDamageY = game.SCREEN_DIMENSIONS.HEIGHT - 120;
  const baseDeadKillY = game.SCREEN_DIMENSIONS.HEIGHT;
  const zoom = game.cameras.main.zoom;
  const redOffsetY =
    game.cameraMover.char.sprite.y - game.cameraCenter.char.sprite.y;
  const newUpperY =
    baseDamageY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * (-1 / zoom + 1);
  const newLowerY =
    baseDeadKillY * (1 / zoom) +
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
  updateDamageText(game, zoom, newUpperY);
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

export function updateDamageText(game: Game, zoom: number, newY: number): void {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDamage.setScale(1 / zoom, 1 / zoom).setText(
      // "p" +
      // playerIndex.toString() +
      // " " +
      Math.round(player.char.damage).toString() +
        "% " +
        player.shotCount.toString() +
        "*"
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
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDeathsKillsShots
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        "" +
          player.killCount.toString() +
          "+ " +
          player.deathCount.toString() +
          "-"
      );
    player.scoreBoardDeathsKillsShots.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.textLocationLROffset) *
        (1 / zoom);

    player.scoreBoardDeathsKillsShots.y = newY;
  });
}
