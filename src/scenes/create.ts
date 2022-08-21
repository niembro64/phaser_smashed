import Game from "./Game";
import { onHitHandler } from "./helpers/damage";
import { setBlinkTrue } from "./helpers/sprites";

export function create(game: Game) {
  game.timer = new Phaser.Core.TimeStep(game.game, { min: 50, target: 60 });

  createBackground(game);
  createBackgroundTitles(game);
  createTable(game);
  createPlatforms(game);
  createEnergyAttacks(game);
  createScoreboard(game);
  createPlayers(game);
  createCameras(game);
  setPlayersCollide(game);
  setAttackEnergyCollideWithPlayers(game);
  initializeHitboxOverlap(game);
  // game.matter.world.setBounds(
  //   0,
  //   0,
  //   game.SCREEN_DIMENSIONS.WIDTH,
  //   game.SCREEN_DIMENSIONS.HEIGHT
  // );
}

export function initializeHitboxOverlap(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((pj, j) => {
      if (player !== pj) {
        game.physics.add.overlap(
          player.char.sprite,
          pj.char.attackEnergy.sprite,
          function () {
            game.overlappingMatrix[playerIndex][j] = true;

            onHitHandler(
              player,
              pj.char.attackEnergy.damage,
              pj.char.attackEnergy.hitback.x,
              pj.char.attackEnergy.hitback.y,
              game
            );

            game.hitByMatrix[playerIndex][j]++;
          }
        );
      }
    });
  });
}

export function setPlayersInitialPositions(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.char.initializeCharPosition.x =
      // game.playerSpawnLocations[playerIndex];
      game.playerSpawnLocations[game.playerSpawnOrder[playerIndex]];
  });
}

export function createPlayers(game: Game): void {
  setPlayersInitialPositions(game);

  game.players.forEach((player, playerIndex) => {
    player.char.sprite = game.physics.add.sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x,
      game.INITIAL.POSITION.PLAYER_Y,
      player.char.name
    );
  });
  game.players.forEach((player, playerIndex) => {
    for (let i = 0; i < 15; i++) {
      player.char.wallTouchArray.push(false);
    }

    player.char.sprite.setScale(1);
    player.char.sprite.flipX = !player.char.initializeCharPosition.lookingRight;
    player.char.sprite.setCollideWorldBounds(false);

    game.physics.add.collider(player.char.sprite, game.PLATFORMS);
    player.keyboard = game.input.keyboard.addKeys(player.keyboard_static);
  });

  game.players.forEach((player, playerIndex) => {
    setBlinkTrue(player);
  });
}
export function createEnergyAttacks(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.char.attackEnergy.sprite = game.physics.add
      .sprite(-300, -300, player.char.attackEnergy.srcImage)
      .setMass(player.char.attackEnergy.mass)
      .setScale(player.char.attackEnergy.scale)
      .setRotation(player.char.attackEnergy.rotation.initial * Math.PI)
      .setAngularVelocity(player.char.attackEnergy.rotation.speed * Math.PI);

    player.char.attackEnergy.sprite.body.allowGravity =
      player.char.attackEnergy.gravity;
    player.char.attackEnergy.sprite.body.bounce.set(
      player.char.attackEnergy.bounceX,
      player.char.attackEnergy.bounceY
    );
    // player.char.attackEnergy.sprite.body.gravity.set(0, 0);
    if (player.char.attackEnergy.walls) {
      game.physics.add.collider(
        player.char.attackEnergy.sprite,
        game.PLATFORMS
      );
    }
  });
}

export function setAttackEnergyCollideWithPlayers(game: Game): void {
  if (!game.debug.setCollidePlayerEnergyAttacks) {
    return;
  }
  game.players.forEach((player, playerIndex) => {
    for (let i = 0; i < 4; i++) {
      if (playerIndex !== i) {
        game.physics.add.collider(
          player.char.attackEnergy.sprite,
          game.players[i].char.sprite
        );
      }
    }
  });
}

export function createBackground(game: Game): void {
  game.BACKGROUND = game.physics.add.sprite(1920 / 2, 1080 / 2, "background");
  game.BACKGROUND.setScale(1);
  game.BACKGROUND.setImmovable(true);
  game.BACKGROUND.body.allowGravity = false;
}
export function createPlatforms(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();
  game.PLATFORMS.create(1200, 700, "platformVertical");
  game.PLATFORMS.create(1200, 850, "platformShort");
  game.PLATFORMS.create(600, 900, "platformShort");
  game.PLATFORMS.create(1920 / 2, 1080 / 2, "platformHorizontal");
  game.PLATFORMS.create(300, 1080 / 1.5, "platformHorizontal");
  game.PLATFORMS.create(1700, 1080 / 1.5, "platformHorizontal");

  game.PLATFORMS.create(400, 500, "platformShort");
  game.PLATFORMS.create(320, 500 - 33, "brick");
  game.PLATFORMS.create(480, 500 - 33, "brick");
}

export function createTable(game: Game): void {
  game.TABLE = game.physics.add.sprite(1920 / 2, 1080 / 2 - 40, "table");
  game.TABLE.setScale(1);
  game.TABLE.setImmovable(true);
  game.TABLE.body.allowGravity = false;
}
export function createBackgroundTitles(game: Game): void {
  game.TITLE = game.add
    .text(game.SCREEN_DIMENSIONS.WIDTH / 2, 300, "SMASHED", {
      // font: "300px Impact",
      fontFamily: "Impact",
      // fontFamily: "'Press Start 2P'",
      // font: "64px Press Start 2P",
      // font: '"Press Start 2P"',
      fontSize: "500px",
    })
    .setOrigin(0.5)
    .setColor("black")
    .setAlpha(0.3);
  game.SUBTITLE = game.add
    .text(
      game.SCREEN_DIMENSIONS.WIDTH / 13,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + 10,
      "NIEMBRO64",
      {
        // font: "300px Impact",
        fontFamily: "Impact",
        // fontFamily: "'Press Start 2P'",
        // font: "64px Press Start 2P",
        // font: '"Press Start 2P"',
        fontSize: "50px",
      }
    )
    .setOrigin(0.5)
    .setColor("black")
    .setAlpha(0.3);
  game.SUPERTITLE = game.add
    .text(game.SCREEN_DIMENSIONS.WIDTH / 2, 50, "YOUNG-CHEZ", {
      // font: "300px Impact",
      fontFamily: "Impact",
      // fontFamily: "'Press Start 2P'",
      // font: "64px Press Start 2P",
      // font: '"Press Start 2P"',
      fontSize: "80px",
    })
    .setOrigin(0.5)
    .setColor("black")
    .setAlpha(0.3);
}

export function createScoreboard(game: Game): void {
  game.scoreBoardTime = game.add.text(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    "",
    {
      // font: "Arial 100px",
      fontSize: "60px",
      // fontFamily: "'Courier New'",
      fontFamily: "Consolas",
      // fontFamily: "'Press Start 2P'",
      stroke: "black",
      strokeThickness: 1,
      shadow: {
        offsetX: 0,
        offsetY: 3,
        color: "#000",
        blur: 10,
        stroke: true,
        fill: true,
      },
    }
  );
  game.scoreBoardTime
    .setOrigin(1, 0)
    .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDamage = game.add
      .text(
        game.SCREEN_DIMENSIONS.WIDTH / 2 +
          game.playerSpawnLocations[playerIndex],
        game.SCREEN_DIMENSIONS.HEIGHT / 2,
        "XXX",
        {
          // font: "Arial 100px",
          fontSize: "60px",
          fontFamily: "Consolas",
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: player.char.color.primary,
          // stroke: player.char.color.primary,
          stroke: "black",
          strokeThickness: 1,
          shadow: {
            offsetX: 0,
            offsetY: 3,
            color: "#000",
            blur: 10,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(1, 0)
      .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);
  });
}

export function setPlayersCollide(game: Game): void {
  if (!game.debug.setCollidePlayerPlayers) {
    return;
  }
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((p, pj) => {
      if (pj !== playerIndex) {
        game.physics.add.collider(player.char.sprite, p.char.sprite);
      }
    });
  });
}

export function createCameras(game: Game): void {
  var debugAlpha = 1;
  if (!game.debug.seeCameras) {
    debugAlpha = 0;
  }
  game.cameraBox.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2,
      "centerWhite"
    )
    .setScale(0.05)
    .setAlpha(0);
  game.cameraBox.char.sprite.setImmovable(true);
  game.cameraBox.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraBox.char.sprite);

  game.cameraPlayers.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2,
      "centerWhite"
    )
    .setScale(0.05)
    .setRotation(Math.PI / 4)
    .setAlpha(debugAlpha);
  game.cameraPlayers.char.sprite.setImmovable(true);
  game.cameraPlayers.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraPlayers.char.sprite);

  game.cameraPlayersHalfway.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2,
      "centerWhite"
    )
    .setRotation(Math.PI / 4)
    .setScale(0.05)
    .setAlpha(debugAlpha);
  game.cameraPlayersHalfway.char.sprite.setImmovable(true);
  game.cameraPlayersHalfway.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraPlayersHalfway.char.sprite);

  game.cameraCenter.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2,
      "centerWhite"
    )
    .setScale(0.05)
    .setRotation(Math.PI / 4)
    .setAlpha(debugAlpha);
  game.cameraCenter.char.sprite.setImmovable(true);
  game.cameraCenter.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraCenterBoy.char.sprite);

  game.cameraMover.char.sprite = game.physics.add
    .sprite(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      game.SCREEN_DIMENSIONS.HEIGHT / 2,
      "centerWhite"
    )
    .setScale(0.08)
    .setAlpha(debugAlpha)
    .setRotation(Math.PI / 4);
  game.cameraMover.char.sprite.setImmovable(true);
  game.cameraMover.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraMover.char.sprite);

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
