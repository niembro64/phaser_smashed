import { setConstantValue } from 'typescript';
import Game from './Game';
import { onHitHandler } from './helpers/damage';
import { setBlinkTrue } from './helpers/sprites';

export function create(game: Game) {
  createSounds(game);
  createBackground(game);
  createBackgroundTitles(game);
  createSplashes(game);
  createPlatforms(game);
  createTable(game);
  createScoreboard(game);
  createCircles(game);
  createEnergyAttacks(game);
  createPlayers(game);
  createCameras(game);
  setPlayersCollide(game);
  setAttackEnergyCollideWithPlayers(game);
  initializeHitboxOverlap(game);
}

export function createPlatforms(game: Game): void {
  switch (game.debug.level) {
    case 0:
      createPlatforms0(game);
      break;
    case 1:
      createPlatforms1(game);
      break;
    case 2:
      createPlatforms2(game);
      break;
    case 3:
      createPlatforms3(game);
      break;
    default:
      createPlatforms0(game);
      break;
  }
}

export function createSounds(game: Game): void {
  game.SOUND_INTRO = game.sound.add('intro', { volume: 0.1 });
  game.SOUND_GUN = game.sound.add('gun', { volume: 0.6 });
  game.SOUND_HIT = game.sound.add('hit', { volume: 0.4 });
  game.SOUND_JUMP = game.sound.add('jump', { volume: 1.5 });
  game.SOUND_JUMP_POWER = game.sound.add('jumpPower', { volume: 0.8 });
  game.SOUND_FIRST_BLOOD = game.sound.add('firstBlood', { volume: 0.8 });
  game.SOUND_SQUISH = game.sound.add('squish', { volume: 0.2 });
  game.SOUND_DIE = game.sound.add('die', { volume: 0.8 });
  game.SOUND_START = game.sound.add('start', { volume: 0.6 });

  game.ENERJA_AH = game.sound.add('enerja_ah', { volume: 0.2 });
  game.ENERJA_DO_AGAIN = game.sound.add('enerja_again', { volume: 0.2 });
  game.ENERJA_FINISH = game.sound.add('enerja_finish', { volume: 0.2 });
  game.ENERJA_GYA = game.sound.add('enerja_gya', { volume: 0.2 });
  game.ENERJA_HAPPEN = game.sound.add('enerja_shit', { volume: 0.2 });
  game.ENERJA_SMASHED = game.sound.add('enerja_smashed', { volume: 0.8 });
  game.ENERJA_TURTLE = game.sound.add('enerja_turtle', { volume: 0.2 });
  game.ENERJA_TWO_SHOTS = game.sound.add('enerja_shots', { volume: 0.2 });
  game.ENERJA_UGH = game.sound.add('enerja_ugh', { volume: 0.2 });

  game.SOUND_PAUSED = game.sound.add('mii', { volume: 0.1, loop: true });
  game.SOUND_BGM = game.sound.add('bgm', { volume: 0.2, loop: true });

  if (!game.debug.useBGM) {
    game.SOUND_BGM.volume = 0;
  }
}

export function createCircles(game: Game): void {
  if (!game.debug.seePlayerCircles) {
    return;
  }

  game.circles.forEach((circle, circleIndex) => {
    circle.graphic = game.add.circle(0, 0, 50, circle.colorNumber);
  });
}

export function initializeHitboxOverlap(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((pj, j) => {
      if (player !== pj) {
        game.physics.add.overlap(
          player.char.sprite,
          pj.char.attackEnergy.sprite,
          function () {
            onHitHandler(
              player,
              playerIndex,
              pj.char.attackEnergy,
              j,
              pj.char.attackEnergy.damage,
              game
            );
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
    for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
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
  game.BACKGROUND = game.physics.add.sprite(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    'background'
  );
  game.BACKGROUND.setScale(game.SCREEN_SCALE.WIDTH, game.SCREEN_SCALE.HEIGHT);
  // game.BACKGROUND.setOrigin(0.5, 0.5);
  game.BACKGROUND.setImmovable(true);
  game.BACKGROUND.body.allowGravity = false;
}

export function createPlatforms0(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
}
export function createPlatforms1(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 3 + 320,
    'platformVertical'
  );
  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
}
export function createPlatforms2(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2 - 34 * 10,
    game.SCREEN_DIMENSIONS.HEIGHT / 2 - 34,
    'brick'
  );
  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2 + 34 * 10,
    game.SCREEN_DIMENSIONS.HEIGHT / 2 - 34,
    'brick'
  );
}

export function createPlatforms3(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();
  game.PLATFORMS.create(
    1200 * game.SCREEN_SCALE.WIDTH,
    700 * game.SCREEN_SCALE.HEIGHT,
    'platformVertical'
  );
  game.PLATFORMS.create(
    1200 * game.SCREEN_SCALE.WIDTH,
    850 * game.SCREEN_SCALE.HEIGHT,
    'platformShort'
  );
  game.PLATFORMS.create(
    800 * game.SCREEN_SCALE.WIDTH,
    900 * game.SCREEN_SCALE.HEIGHT,
    'platformShort'
  );
  game.PLATFORMS.create(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
  game.PLATFORMS.create(
    300 * game.SCREEN_SCALE.WIDTH,
    (1080 / 1.5) * game.SCREEN_SCALE.HEIGHT,
    'platformHorizontal'
  );
  game.PLATFORMS.create(
    1700 * game.SCREEN_SCALE.WIDTH,
    (1080 / 1.5) * game.SCREEN_SCALE.HEIGHT,
    'platformHorizontal'
  );

  game.PLATFORMS.create(
    400 * game.SCREEN_SCALE.WIDTH,
    500 * game.SCREEN_SCALE.HEIGHT,
    'platformShort'
  );
  game.PLATFORMS.create(
    320 * game.SCREEN_SCALE.WIDTH,
    (500 - 33) * game.SCREEN_SCALE.HEIGHT,
    'brick'
  );
  game.PLATFORMS.create(
    480 * game.SCREEN_SCALE.WIDTH,
    (500 - 33) * game.SCREEN_SCALE.HEIGHT,
    'brick'
  );
}

export function createTable(game: Game): void {
  game.TABLE = game.physics.add.sprite(
    (1920 / 2) * game.SCREEN_SCALE.WIDTH,
    (1080 / 2 - 43) * game.SCREEN_SCALE.HEIGHT,
    'table'
  );
  game.TABLE.setScale(1);
  game.TABLE.setImmovable(true);
  game.TABLE.body.allowGravity = false;

  game.FLAG = game.physics.add.sprite(
    (1920 / 2 - 493) * game.SCREEN_SCALE.WIDTH,
    (1080 / 2 - 200 - 35) * game.SCREEN_SCALE.HEIGHT,
    'flag'
  );
  game.FLAG.setScale(1);
  game.FLAG.setImmovable(true);
  game.FLAG.body.allowGravity = false;
}
export function createBackgroundTitles(game: Game): void {
  game.TITLE = game.add
    .text(
      game.SCREEN_DIMENSIONS.WIDTH / 2,
      300 * game.SCREEN_SCALE.HEIGHT,
      'SMASHED',
      {
        // font: "300px Impact",
        fontFamily: 'Impact',
        // fontFamily: "'Press Start 2P'",
        // font: "64px Press Start 2P",
        // font: '"Press Start 2P"',
        fontSize: '500px',
        // fontSize: "500px",
      }
    )
    .setOrigin(0.5)
    .setColor('black')
    .setAlpha(0.3);
  game.SUBTITLE = game.add
    .text(
      game.SCREEN_DIMENSIONS.WIDTH / 13,
      game.SCREEN_DIMENSIONS.HEIGHT / 2 + 10,
      'NIEMBRO64',
      {
        // font: "300px Impact",
        fontFamily: 'Impact',
        // fontFamily: "'Press Start 2P'",
        // font: "64px Press Start 2P",
        // font: '"Press Start 2P"',
        fontSize: '50px',
      }
    )
    .setOrigin(0.5)
    .setColor('black')
    .setAlpha(0.3);
  game.SUPERTITLE = game.add
    .text(game.SCREEN_DIMENSIONS.WIDTH / 2, 50, 'YOUNG-CHEZ', {
      // font: "300px Impact",
      fontFamily: 'Impact',
      // fontFamily: "'Press Start 2P'",
      // font: "64px Press Start 2P",
      // font: '"Press Start 2P"',
      fontSize: '80px',
    })
    .setOrigin(0.5)
    .setColor('black')
    .setAlpha(0.3);
}

export function createSplashes(game: Game): void {
  game.splashes.forEach((splash, splashIndex) => {
    splash.text = game.add
      .text(
        game.SCREEN_DIMENSIONS.WIDTH / 2,
        game.SCREEN_DIMENSIONS.HEIGHT / 2,
        splash.word,
        {
          // font: "Arial 100px",
          fontSize: splash.size,
          // fontFamily: "'Courier New'",
          fontFamily: 'Impact',
          // fontFamily: "'Press Start 2P'",
          color: splash.color,
          stroke: splash.backgroundColor,
          strokeThickness: splash.strokeThickness,
          shadow: {
            offsetX: 0,
            offsetY: 9,
            color: 'black',
            blur: 10,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(1);
  });
}

export function createScoreboard(game: Game): void {
  game.scoreBoardTimeGame = game.add.text(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2,
    '',
    {
      // font: "Arial 100px",
      fontSize: '80px',
      // fontFamily: "'Courier New'",
      fontFamily: game.FONT_DEFAULT,
      // fontFamily: "'Press Start 2P'",
      stroke: 'black',
      strokeThickness: 1,
      shadow: {
        offsetX: 0,
        offsetY: 3,
        color: '#000',
        blur: 10,
        stroke: true,
        fill: true,
      },
    }
  );
  game.scoreBoardTimeGame
    .setOrigin(0.5, 0)
    .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);

  game.scoreBoardTimeTime = game.add.text(
    game.SCREEN_DIMENSIONS.WIDTH / 2,
    game.SCREEN_DIMENSIONS.HEIGHT / 2 + 100,
    '',
    {
      // font: "Arial 100px",
      fontSize: '40px',
      // fontFamily: "'Courier New'",
      fontFamily: game.FONT_DEFAULT,
      // fontFamily: "'Press Start 2P'",
      color: 'gray',
      stroke: 'black',
      strokeThickness: 1,
      shadow: {
        offsetX: 0,
        offsetY: 3,
        color: '#000',
        blur: 10,
        stroke: true,
        fill: true,
      },
    }
  );
  game.scoreBoardTimeTime
    .setOrigin(0.5, 1)
    .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom)
    .setAlpha(1);

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDamage = game.add
      .text(
        game.SCREEN_DIMENSIONS.WIDTH / 2 +
          game.playerSpawnLocations[playerIndex],
        game.SCREEN_DIMENSIONS.HEIGHT / 2,
        'XXX',
        {
          // font: "Arial 100px",
          fontSize: '60px',
          fontFamily: game.FONT_DEFAULT,
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: game.circles[playerIndex].colorString,
          // stroke: player.char.color.primary,
          stroke: 'black',
          strokeThickness: 1,
          shadow: {
            offsetX: 0,
            offsetY: 3,
            color: '#000',
            blur: 10,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(1, 0)
      .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);
  });

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardDeathsKillsShots = game.add
      .text(
        game.SCREEN_DIMENSIONS.WIDTH / 2 +
          game.playerSpawnLocations[playerIndex],
        game.SCREEN_DIMENSIONS.HEIGHT / 2 + 100,
        'XXX',
        {
          // font: "Arial 100px",
          fontSize: '60px',
          fontFamily: game.FONT_DEFAULT,
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: game.circles[playerIndex].colorString,
          // stroke: player.char.color.primary,
          stroke: 'black',
          strokeThickness: 1,
          shadow: {
            offsetX: 0,
            offsetY: 3,
            color: '#000',
            blur: 10,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(1, 1)
      .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);
  });

  game.players.forEach((player, playerIndex) => {
    player.glass = game.add
      .sprite(
        game.SCREEN_DIMENSIONS.WIDTH / 2 +
          game.playerSpawnLocations[playerIndex],
        game.SCREEN_DIMENSIONS.HEIGHT / 2 + 200,
        'glass_full'
      )
      .setScale(
        1 / game.cameras.main.zoom / 10,
        1 / game.cameras.main.zoom / 10
      );
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
      'centerWhite'
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
      'centerWhite'
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
      'centerWhite'
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
      'centerWhite'
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
      'centerWhite'
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
