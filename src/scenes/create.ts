import Game from "./Game";

export function create(game: Game) {
  game.platforms = game.physics.add.staticGroup();
  game.platforms.create(500, 300, "platformHorizontal");
  game.platforms.create(800, 500, "platformHorizontal");
  game.platforms.create(1100, 300, "platformVertical");

  for (let i = 0; i < 4; i++) {
    game.players[game.playersOrder[i]].char.sprite = game.physics.add.sprite(
      150 * i + 450,
      game.INITIAL.POSITION.PLAYER_Y,
      game.players[game.playersOrder[i]].char.name
    );
  }

  game.players.forEach((player, playerIndex) => {
    // for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
    for (let i = 0; i < 15; i++) {
      player.char.wallTouchArray.push(false);
    }

    player.char.sprite.setScale(1);
    player.char.sprite.setCollideWorldBounds(false);
    game.physics.add.collider(player.char.sprite, game.platforms);
    player.keyboard = game.input.keyboard.addKeys(player.keyboard_static);
    // }
  });

  charsCollide(game);

  game.cameraFast.char.sprite = game.physics.add
    .sprite(200, 200, "center")
    .setScale(0.1);
  game.cameraFast.char.sprite.setImmovable(true);
  game.cameraFast.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraFast.char.sprite);

  game.cameraSlow.char.sprite = game.physics.add
    .sprite(200, 200, "center")
    .setScale(0.1);
  game.cameraSlow.char.sprite.setImmovable(true);
  game.cameraSlow.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.center_80.char.sprite);

  // for (let i = 0; i < 11; i++) {
  //   game.center_10.helperState.push({ x: 800, y: 300, zoom: 0.3 });
  // }
  // for (let i = 0; i < 79; i++) {
  //   game.center_80.helperState.push({ x: 800, y: 300, zoom: 0.3 });
  // }
  // game.cameras.main.setBounds(
  //     0,
  //     0,
  //     game.SCREEN_DIMENSIONS.WIDTH,
  //     game.SCREEN_DIMENSIONS.HEIGHT
  // );
}

export function charsCollide(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((p, pj) => {
      if (pj !== playerIndex) {
        game.physics.add.collider(player.char.sprite, p.char.sprite);
      }
    });
  });
}
