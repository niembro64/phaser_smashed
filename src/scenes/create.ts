import Game from "./Game";
import { hasPlayerTouchedWallRecently } from "./movement";

export function create(game: Game) {
  game.background = game.physics.add.sprite(1920 / 2, 1080 / 2, "background");
  game.background.setScale(1);
  game.background.setImmovable(true);
  game.background.body.allowGravity = false;
  game.table = game.physics.add.sprite(1920 / 2, 1080 / 2 - 40, "table");
  game.table.setScale(1);
  game.table.setImmovable(true);
  game.table.body.allowGravity = false;

  game.platforms = game.physics.add.staticGroup();
  game.platforms.create(1200, 850, "platformShorter");
  game.platforms.create(600, 900, "platformShort");
  game.platforms.create(1920 / 2, 1080 / 2, "platformHorizontal");
  game.platforms.create(300, 1080 / 1.5, "platformHorizontal");
  game.platforms.create(1700, 1080 / 1.5, "platformHorizontal");
  game.platforms.create(1200, 700, "platformVertical");

  for (let i = 0; i < 4; i++) {
    game.players[game.playersOrder[i]].char.sprite = game.physics.add.sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2 + game.playerLocations[i],
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

  game.cameraPlayers.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + game.CAMERA_OFFSET_Y,
      "centerWhite"
    )
    .setScale(0.05);
  game.cameraPlayers.char.sprite.setImmovable(true);
  game.cameraPlayers.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraPlayers.char.sprite);

  game.cameraMover.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + game.CAMERA_OFFSET_Y,
      "centerRed"
    )
    .setScale(0.08)
    .setRotation(Math.PI / 4);
  game.cameraMover.char.sprite.setImmovable(true);
  game.cameraMover.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraMover.char.sprite);

  game.cameraPlayersHalfway.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + game.CAMERA_OFFSET_Y,
      "centerWhite"
    )
    .setScale(0.05);
  game.cameraPlayersHalfway.char.sprite.setImmovable(true);
  game.cameraPlayersHalfway.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraPlayersHalfway.char.sprite);

  game.cameraCenter.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + game.CAMERA_OFFSET_Y,
      "centerWhite"
    )
    .setScale(0.05);
  game.cameraCenter.char.sprite.setImmovable(true);
  game.cameraCenter.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraCenterBoy.char.sprite);

  game.cameraBox.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + game.CAMERA_OFFSET_Y,
      "centerWhite"
    )
    .setScale(0.08)
    .setRotation(Math.PI / 4);
  game.cameraBox.char.sprite.setImmovable(true);
  game.cameraBox.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraBox.char.sprite);

  // game.cameraSlow.char.sprite = game.physics.add
  //   .sprite(200, 200, "center")
  //   .setScale(0.05);
  // game.cameraSlow.char.sprite.setImmovable(true);
  // game.cameraSlow.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.center_80.char.sprite);

  // for (let i = 0; i < 11; i++) {
  //   game.center_10.helperState.push({ x: 800, y: 300, zoom: 0.3 });
  // }
  // for (let i = 0; i < 79; i++) {
  //   game.center_80.helperState.push({ x: 800, y: 300, zoom: 0.3 });
  // }
  // game.cameras.main.setBounds(
  //   0,
  //   0,
  //   game.SCREEN_DIMENSIONS.WIDTH,
  //   game.SCREEN_DIMENSIONS.HEIGHT
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
