import Game from "../Game";

export function updateText(game: Game): void {
  const baseDamageY = 0;
  const baseDeadKillY = game.SCREEN_DIMENSIONS.HEIGHT;
  const zoom = game.cameras.main.zoom;
  const redOffsetY =
    game.cameraMover.char.sprite.y - game.cameraCenter.char.sprite.y;
  const newDamageY =
    baseDamageY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * ((-1 * 1) / Math.pow(zoom, 1) + 1);
  const newDeathKillY =
    baseDeadKillY * (1 / zoom) +
    redOffsetY * (1 / zoom) +
    game.cameraMover.char.sprite.y * ((-1 * 1) / Math.pow(zoom, 1) + 1);

  game.scoreBoardTime.setScale(1 / zoom, 1 / zoom);
  game.scoreBoardTime.x =
    game.cameraMover.char.sprite.x + game.textLocationLROffset * (1 / zoom);
  game.scoreBoardTime.y = newDamageY;

  updateClockText(game);
  updateDamageText(game, zoom, newDamageY);
  updateDeathsKillsText(game, zoom, newDeathKillY);
}

export function updateClockText(game: Game): void {
  game.scoreBoardTime.setText(
    game.clockTime.minutes.toString() +
      ":" +
      (game.clockTime.seconds < 10 ? "0" : "") +
      game.clockTime.seconds.toString()
  );
}

export function updateDamageText(game: Game, zoom: number, newY: number): void {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDamage.setScale(1 / zoom, 1 / zoom).setText(
      // "p" +
      // playerIndex.toString() +
      // " " +
      Math.round(player.char.damage).toString() + "%"
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
    player.scoreBoardDeathsKills
      .setScale(1 / zoom, 1 / zoom)
      .setText(
        "+" + player.killCount.toString() + ":-" + player.deathCount.toString()
      );
    player.scoreBoardDeathsKills.x =
      game.cameraMover.char.sprite.x +
      (game.textLocations[game.playerSpawnOrder[playerIndex]] +
        game.textLocationLROffset) *
        (1 / zoom);

    player.scoreBoardDeathsKills.y = newY;
  });
}
