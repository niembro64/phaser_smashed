import ShakePosition from 'phaser3-rex-plugins/plugins/behaviors/shake/ShakePosition';
import Game, { SCREEN_DIMENSIONS } from './Game';
import { setAttackPhysicalOffscreen } from './helpers/attacks';
import {
  onHitHandlerAttackEnergy,
  onHitHandlerAttackPhysical,
  onHitHandlerBullets,
} from './helpers/damage';
import {
  getDoesAnythingHaveDark,
  getHasBeenGameDurationSinceMoment,
  setChompPowerState,
  setPlayerPowerState,
  updateChompFilterState,
} from './helpers/powers';
import { filterAttackEnergyNormal, setBlinkTrue } from './helpers/sprites';
import { setPreUpdate } from './update';
import { Bullets } from './helpers/bullets';

export function create(game: Game) {
  createPreCreate(game);
  createDataMatrices(game);
  createSoundsGame(game);
  createBackground(game);
  createBackgroundTitles(game);
  createSplashBlack(game);
  createBackgroundOutline(game);
  createLavas(game);
  createSplashes(game);
  createExplosions(game);
  createFlag(game);
  createEmitterChomp(game);
  createEmittersPlayers(game);
  createPlatforms(game);
  createTable(game);
  createColliderTablePlatforms(game);
  createAttackPhysicals(game);
  createColliderTableAttackPhysicals(game);
  createAttackEnergies(game);
  createColliderTableAttackEnergies(game);
  createScoreboardShotGlass(game);
  createSplashRuleFinished(game);
  createChomp(game);
  createGun(game);
  createEmitterChompFollowChomp(game);
  createPlayers(game);
  createEmittersFollowPlayers(game);
  createColliderTablePlayers(game);
  createKeyboards(game);
  createPlayerIdCircles(game);
  createScoreboard(game);
  createScoreboardReady(game);
  createCameras(game);
  createCollidersPvP(game);
  createCollidersPvAP(game);
  createCollidersPvAE(game);
  createCollidersAEvAE(game);
  createCollidersAEvAP(game);
  createHitboxOverlap(game);
  createEndDataMatrices(game);
  createShake(game);

  // INIT UPDATE
  setPreUpdate(game);
}

export function createGun(game: Game): void {
  let ggs = game.gun.sprite;
  ggs = game.physics.add.sprite(
    SCREEN_DIMENSIONS.WIDTH * 0.8,
    SCREEN_DIMENSIONS.HEIGHT * 0.3,
    'centerWhite'
  );
  ggs.setImmovable(true).setBounce(0).setOrigin(0.5, 1).setScale(0.1);
  ggs.allowGravity = false;
}

export function createShake(game: Game): void {
  const shakeConfig: ShakePosition.IConfig = {
    duration: 400,
    magnitude: 100,
    magnitudeMode: 'decay',
  };

  game.shake = new ShakePosition(game.cameraPlayers.char.sprite, shakeConfig);
  game.shake.setEnable(true);
}

export function createExplosions(game: Game): void {
  var config = {
    key: 'explsionanimation',
    frames: game.anims.generateFrameNumbers('explosion256', {
      start: 0,
      end: 47,
      first: 0,
    }),
    frameRate: 60,
    repeat: 0,
  };

  game.anims.create(config);

  let c = game.chomp;
  let eArray = c.darknessMoments.explosions;

  eArray.forEach((e, eIndex) => {
    e.sprite = game.physics.add.sprite(
      SCREEN_DIMENSIONS.WIDTH / 2,
      -500,
      'explosion256'
    );
    e.sprite.setScale(2);
    e.sprite.body.allowGravity = false;
    e.sprite.setBounce(0);
    e.sprite.setOrigin(0.5, 0.5);
    e.sprite.setImmovable(true);
    e.sprite.setRotation((Math.PI / 4) * eIndex);
    e.sprite.setTint(0x000000);

    // e.sprite.on('animationcomplete', () => {
    //   console.log('animationcomplete');
    // });

    // add sounds to explosions
    e.sound = game.sound.add(
      eIndex % 2 === 0 ? 'boom_short_01' : 'boom_short_02',
      {
        volume: game.debug.DevMode ? 0 : 0.2,
      }
    );
  });
}

export function createChomp(game: Game): void {
  let c = game.chomp;
  let b = c.block;

  c.soundAttack = game.sound.add('chainChompAttack', {
    volume: game.debug.DevMode ? 0 : 0.2,
  });

  c.soundBBBambalam = game.sound.add('bb_bam', {
    volume: game.debug.DevMode ? 0 : 0.4,
  });

  c.soundBBWoah = game.sound.add('bb_woah', {
    volume: game.debug.DevMode ? 0 : 0.25,
  });

  // b.sprite = game.physics.add.sprite(b.x, b.y, 'chomp_block');
  // b.sprite.setScale(1);
  // b.sprite.body.allowGravity = false;
  // b.sprite.setBounce(0);
  // b.sprite.setOrigin(0.5, 1);
  // b.sprite.setImmovable(true);
  // game.physics.add.collider(c.block.sprite, game.PLATFORMS);

  for (let i = 0; i < c.NUM_LINKS; i++) {
    c.links.push({ sprite: null });
    c.links[i].sprite = game.physics.add.sprite(b.x, b.y, 'chomp_link');
    c.links[i].sprite.setScale(0.5);
    c.links[i].sprite.body.allowGravity = false;
    c.links[i].sprite.setBounce(0);
    c.links[i].sprite.setOrigin(0.5, 1);
    c.links[i].sprite.setImmovable(true);
    game.physics.add.collider(c.links[i].sprite, game.PLATFORMS);
  }

  var config_chomping = {
    key: 'chompanimation_chomping',
    frames: game.anims.generateFrameNumbers('chomp', {
      start: 0,
      end: 3,
      first: 0,
    }),
    frameRate: 30,
    repeat: -1,
    yoyo: true,
  };

  var config_walking = {
    key: 'chompanimation_walking',
    frames: game.anims.generateFrameNumbers('chomp', {
      start: 2,
      end: 3,
      first: 2,
    }),
    frameRate: 10,
    repeat: -1,
    yoyo: true,
  };

  game.anims.create(config_chomping);
  game.anims.create(config_walking);

  c.sprite = game.physics.add.sprite(c.originX, c.originY - 10, 'chomp');
  c.sprite.setScale(1.3);
  c.sprite.body.allowGravity = true;
  c.sprite.setBounceX(1);
  c.sprite.setBounceY(0.5);
  c.sprite.setOrigin(0.5, 1);
  c.sprite.setVelocityX(30);
  c.sprite.setVelocityY(-100);
  c.sprite.setMass(c.MASS);
  c.sprite.play('chompanimation_walking');

  // setChompFilterState('none', game);

  game.physics.add.collider(c.sprite, game.PLATFORMS);
  // game.players.forEach((player, playerIndex) => {
  //   game.physics.add.collider(c.sprite, player.char.sprite);
  //   game.physics.add.collider(c.sprite, player.char.attackEnergy.sprite);
  // });
}

export function createPreCreate(game: Game): void {
  for (let i = 0; i < game.playerChoicesCharacterType.length; i++) {
    game.players.push(
      JSON.parse(
        JSON.stringify(game.playerOptions[game.playerChoicesCharacterType[i]])
      )
    );
  }

  game.players.forEach((player, playerIndex) => {
    player.gamepad = Phaser.Input.Gamepad.Gamepad;
  });
}

export function createEndDataMatrices(game: Game): void {
  let numSplashes: number = game.splashesEndData.length;
  // let splashSizeTitleDefault = "40px";
  let splashSize = '';
  game.splashesEndData.forEach((splash, splashIndex) => {
    for (let i = 0; i < game.players.length; i++) {
      if (i === 0) {
        splashSize = splash.size;
      } else {
        splashSize = game.splashSizeTitleDefault;
      }
      splash.words[i] =
        game.players[i].char.name + ' ' + game.colorCircles[i].text;
    }
    splash.textTitle = game.add
      .text(
        SCREEN_DIMENSIONS.WIDTH * ((splashIndex + 1) / (numSplashes + 1)),
        SCREEN_DIMENSIONS.HEIGHT / 6,
        splash.name + ' ' + splash.emoji,
        {
          align: 'right',
          fontSize: splashSize,
          fontFamily: game.FONT_DEFAULT_MONOSPACE,
          color: splash.color,
          stroke: splash.backgroundColor,
          strokeThickness: splash.strokeThickness,
          shadow: {
            offsetX: 0,
            offsetY: splash.offsetY,
            color: 'black',
            blur: splash.blur,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(0.5, 0)
      .setAlpha(1);
    splash.textData = game.add
      .text(
        SCREEN_DIMENSIONS.WIDTH * ((splashIndex + 1) / (numSplashes + 1)),
        SCREEN_DIMENSIONS.HEIGHT / 6,
        splash.words,
        {
          align: 'right',
          fontSize: splash.size,
          fontFamily: game.FONT_DEFAULT_MONOSPACE,
          color: splash.color,
          stroke: splash.backgroundColor,
          strokeThickness: splash.strokeThickness,
          shadow: {
            offsetX: 0,
            offsetY: splash.offsetY,
            color: 'black',
            blur: splash.blur,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(0.5, 0)
      .setAlpha(1);
  });
}

export function createDataMatrices(game: Game): void {
  game.overlappingPlayerIAttackPhysicalJ = [];
  game.overlappingPlayerIAttackEnergyJ = [];
  game.wasLastHitByMatrix = [];
  game.numberHitByMatrix = [];
  game.numberKilledByMatrix = [];
  game.numberShotsTakenByMeMatrix = [];
  for (let i = 0; i < game.players.length; i++) {
    game.overlappingPlayerIAttackPhysicalJ.push([]);
    game.overlappingPlayerIAttackEnergyJ.push([]);
    game.wasLastHitByMatrix.push([]);
    game.numberHitByMatrix.push([]);
    game.numberKilledByMatrix.push([]);
    game.numberShotsTakenByMeMatrix.push([]);
    for (let j = 0; j < game.players.length; j++) {
      game.overlappingPlayerIAttackPhysicalJ[i].push(false);
      game.overlappingPlayerIAttackEnergyJ[i].push(false);
      game.wasLastHitByMatrix[i].push(false);
      game.numberHitByMatrix[i].push(0);
      game.numberKilledByMatrix[i].push(0);
      game.numberShotsTakenByMeMatrix[i].push(0);
    }
  }
}

export function createPlatforms(game: Game): void {
  switch (game.debug.Level) {
    case 0:
      createPlatforms0(game);
      console.log('createPlatforms', 0, 'game.debug.Level', game.debug.Level);
      break;
    case 1:
      createPlatforms1(game);
      console.log('createPlatforms', 1, 'game.debug.Level', game.debug.Level);
      break;
    case 2:
      createPlatforms2(game);
      console.log('createPlatforms', 2, 'game.debug.Level', game.debug.Level);
      break;
    case 3:
      createPlatforms3(game);
      console.log('createPlatforms', 3, 'game.debug.Level', game.debug.Level);
      break;
    case 4:
      createPlatforms4(game);
      console.log('createPlatforms', 4, 'game.debug.Level', game.debug.Level);
      break;
    case 5:
      createPlatforms5(game);
      console.log('createPlatforms', 5, 'game.debug.Level', game.debug.Level);
      break;
    case 6:
      createPlatforms6(game);
      console.log('createPlatforms', 6, 'game.debug.Level', game.debug.Level);
      break;
    default:
      createPlatforms0(game);
      console.log(
        'createPlatforms',
        'DEFAULT',
        'game.debug.Level',
        game.debug.Level
      );
      break;
  }
}

export function createSoundsGame(game: Game): void {
  game.SOUND_INTRO = game.sound.add('intro', { volume: 0.1 });
  game.SOUND_GUN = game.sound.add('gun', { volume: 0.6 });
  game.SOUND_HIT = game.sound.add('hit', { volume: 0.25 });
  game.SOUND_JUMP_PHYSICAL = game.sound.add('jump', { volume: 1 });
  game.SOUND_JUMP_ENERGY = game.sound.add('jumpPower', { volume: 0.8 });
  game.SOUND_FIRST_BLOOD = game.sound.add('firstBlood', { volume: 0.8 });
  game.SOUND_SQUISH = game.sound.add('squish', { volume: 0.2 });
  game.SOUND_DIE = game.sound.add('die', { volume: 0.8 });
  game.SOUND_START_LIQUID = game.sound.add('startLiquid', { volume: 0.1 });
  game.SOUND_START = game.sound.add('start', { volume: 0.4 });
  game.SOUND_READY = game.sound.add('ready', { volume: 0.6 });
  game.SOUND_READY_REPEAT = game.sound.add('readyRepeat', {
    volume: 0.3,
    loop: true,
  });

  game.players.forEach((player, playerIndex) => {
    player.playerReadySound = game.sound.add(
      'readyRepeat' + playerIndex.toString(),
      { volume: 0.3, loop: true }
    );
    if (!game.debug.ReadySoundActive) {
      player.playerReadySound.volume = 0;
    }
  });

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

  if (!game.debug.MusicActive) {
    game.SOUND_BGM.volume = 0;
  }

  if (!game.debug.ReadySoundActive) {
    game.SOUND_READY_REPEAT.volume = 0;
  }
}

export function createShields(game: Game): void {
  game.colorCircles.forEach((circle, circleIndex) => {
    circle.graphic = game.add.circle(0, 0, 50, circle.colorNumber);
  });
}
export function createPlayerIdCircles(game: Game): void {
  if (!game.debug.PlayerIdVisible) {
    return;
  }

  // game.circles.forEach((circle, circleIndex) => {
  game.players.forEach((player, playerIndex) => {
    game.colorCircles[playerIndex].graphic = game.add.circle(
      0,
      0,
      10,
      game.colorCircles[playerIndex].colorNumber
    );
  });
  // });
}

export function createHitboxOverlap(game: Game): void {
  // ATTACK PHYSICAL CHOMP OVERLAP
  game.players.forEach((player, playerIndex) => {
    game.physics.add.overlap(
      player.char.attackPhysical.sprite,
      game.chomp.sprite,
      function () {
        updateChompFilterState(player, player.char.attackPhysical.damage, game);
        // setChompFilterState('hurt', game);
        if (!getDoesAnythingHaveDark(game)) {
          game.chomp.emitterDark.visible = true;
          setChompPowerState('dark', game);
          game.chomp.soundAttack.play();
          game.SOUND_HIT.play();
        }
        // console.log(
        //   "OVERLAP",
        //   "CHOMP",
        //   game.chomp.powerStateCurr.name,
        //   "PLAYER",
        //   player.char.powerStateCurr.name
        // );
      }
    );
  });

  // ATTACK ENERGY CHOMP OVERLAP
  game.players.forEach((player, playerIndex) => {
    game.physics.add.overlap(
      player.char.attackEnergy.sprite,
      game.chomp.sprite,
      function () {
        updateChompFilterState(player, player.char.attackEnergy.damage, game);
        if (!getDoesAnythingHaveDark(game)) {
          game.chomp.emitterDark.visible = true;
          setChompPowerState('dark', game);
          game.chomp.soundAttack.play();
          game.SOUND_HIT.play();
        }
        // console.log(
        //   "OVERLAP",
        //   "CHOMP",
        //   game.chomp.powerStateCurr.name,
        //   "PLAYER",
        //   player.char.powerStateCurr.name
        // );
      }
    );
  });

  // PLAYER CHOMP OVERLAP
  game.players.forEach((player, playerIndex) => {
    game.physics.add.overlap(
      player.char.sprite,
      game.chomp.sprite,
      function () {
        if (game.chomp.powerStateCurr.name === 'dark') {
          setPlayerPowerState('dark', player, game);
          setChompPowerState('none', game);
          game.chomp.soundBBBambalam.play();
        }
        // console.log(
        //   "OVERLAP",
        //   "CHOMP",
        //   game.chomp.powerStateCurr.name,
        //   "PLAYER",
        //   player.char.powerStateCurr.name
        // );
      }
    );

    game.players.forEach((pj, j) => {
      if (player !== pj) {
        // PLAYER PLAYER OVERLAP
        game.physics.add.overlap(
          player.char.sprite,
          pj.char.sprite,
          function () {
            let hasBeen = getHasBeenGameDurationSinceMoment(
              2000,
              game.chomp.darknessMoments.passed,
              game
            );
            // console.log("hasBeen", hasBeen);
            if (player.char.powerStateCurr.name === 'dark' && hasBeen) {
              setPlayerPowerState('dark', pj, game);
              setPlayerPowerState('none', player, game);
              game.chomp.soundBBWoah.setRate(
                game.chomp.soundBBWoah.rate * 0.95
              );
              game.chomp.soundBBWoah.play();
            }
            // console.log(
            //   "OVERLAP",
            //   "PLAYER",
            //   player.char.powerStateCurr.name,
            //   "PJ",
            //   pj.char.powerStateCurr.name
            // );
          }
        );

        // PLAYER ATTACK PHYSICAL OVERLAP
        game.physics.add.overlap(
          player.char.sprite,
          pj.char.attackPhysical.sprite,
          function () {
            if (game.debug.DefaultDamage) {
              onHitHandlerAttackPhysical(
                player,
                playerIndex,
                pj.char.attackPhysical,
                j,
                game.DEFAULT_ATTACK_DAMAGE,
                game
              );
              return;
            }
            onHitHandlerAttackPhysical(
              player,
              playerIndex,
              pj.char.attackPhysical,
              j,
              pj.char.attackPhysical.damage,
              game
            );
          }
        );

        // PLAYER ATTACK ENERGY OVERLAP
        game.physics.add.overlap(
          player.char.sprite,
          pj.char.attackEnergy.sprite,
          function () {
            if (game.debug.DefaultDamage) {
              onHitHandlerAttackEnergy(
                player,
                playerIndex,
                pj.char.attackEnergy,
                j,
                game.DEFAULT_ATTACK_DAMAGE,
                game
              );
              return;
            }
            onHitHandlerAttackEnergy(
              player,
              playerIndex,
              pj.char.attackEnergy,
              j,
              pj.char.attackEnergy.damage,
              game
            );
          }
        );

        if (
          pj.char.attackEnergy.attackBullets !== null &&
          pj.char.attackEnergy.attackBullets.bullets !== null
        ) {
          pj.char.attackEnergy.attackBullets.bullets
            .getChildren()
            .forEach((bullet, bi) => {
              // PLAYER BULLETS OVERLAP
              game.physics.add.overlap(player.char.sprite, bullet, function () {
                // console.log('BULLET OVERLAP', bi);

                if (game.debug.DefaultDamage) {
                  onHitHandlerBullets(
                    player,
                    playerIndex,
                    pj,
                    pj.char.attackEnergy,
                    bullet,
                    bi,
                    j,
                    game.DEFAULT_ATTACK_DAMAGE,
                    game
                  );
                  return;
                }
                onHitHandlerBullets(
                  player,
                  playerIndex,
                  pj,
                  pj.char.attackEnergy,
                  bullet,
                  bi,
                  j,
                  pj.char.attackEnergy.damage,
                  game
                );
              });
            });

          // game.physics.add.overlap(
          //   player.char.sprite,
          //   pj.char.attackEnergy.bullets.sprite,
          //   function () {
          //     if (game.debug.DefaultDamage) {
          //       onHitHandlerBullets(
          //         player,
          //         playerIndex,
          //         pj.char.attackEnergy,
          //         pj.char.attackEnergy.bullets,
          //         j,
          //         game.DEFAULT_ATTACK_DAMAGE,
          //         game
          //       );
          //       return;
          //     }
          //     onHitHandlerBullets(
          //       player,
          //       playerIndex,
          //       pj.char.attackEnergy,
          //       pj.char.attackEnergy.bullets,
          //       j,
          //       pj.char.attackEnergy.damage,
          //       game
          //     );
          //   }
          // );
        }
      }
    });
  });
}

export function createKeyboards(game: Game): void {
  let kIndex = 0;

  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].inputType === 2) {
      game.players[i].keyboard = game.input.keyboard.addKeys(
        game.keyboardHandPositions[kIndex]
      );
      kIndex++;
      if (kIndex >= game.keyboardHandPositions.length) {
        return;
      }
    }
  }
}
export function createKeyboardsOld(game: Game): void {
  const k = game.keyboardHandPositions.length;
  const p = game.players.length;
  const d = p - k > 0 ? p - k : 0;

  for (let i = 0; i < k; i++) {
    if (game?.players[i + d]) {
      game.players[i + d].keyboard = game.input.keyboard.addKeys(
        game.keyboardHandPositions[i]
      );
    }
  }
}
export function setPlayersInitialPositions(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.char.initializeCharPosition.x =
      game.playerSpawnLocationsX[game.playerSpawnOrder[playerIndex]];

    player.char.initializeCharPosition.y =
      game.playerSpawnLocationsY[game.playerSpawnOrder[playerIndex]];
  });
}

export function createEmitterChomp(game: Game): void {
  let c = game.chomp;
  c.particles = game.add.particles('tail_0');
  c.emitterDark = c.particles.createEmitter({
    speed: 1500,
    // scale: { start: 0.05, end: 0 },
    scale: { start: 1 * 2.5, end: 1.5 },
    blendMode: 'SUBTRACT',
    // bounce: 1,
    // length: 100,
    lifespan: 40,
    // gravityY: 1000,
  });
}

export function createEmittersPlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.particles = game.add.particles('tail_' + playerIndex);

    player.emitterLight = player.particles.createEmitter({
      speed: 10,
      // scale: { start: 0.05, end: 0 },
      scale: { start: 1.5 * player.char.scaleCharSpriteReality, end: 0 },
      blendMode: 'ADD',
      // bounce: 1,
      // length: 100,
      lifespan: 30,
    });

    player.emitterDark = player.particles.createEmitter({
      speed: 1000,
      // scale: { start: 0.05, end: 0 },
      scale: { start: 1 * player.char.scaleCharSpriteReality, end: 0.5 },
      blendMode: 'SUBTRACT',
      // bounce: 1,
      // length: 100,
      lifespan: 40,
      // gravityY: 1000,
    });

    player.emitterPlayer = player.particles.createEmitter({
      speed: 80,
      // scale: { start: 0.05, end: 0 },
      scale: { start: 0.7 * player.char.scaleCharSpriteReality, end: 0 },
      // blendMode: 'SUBTRACT',
      blendMode: 'ADD',
      // bounce: 1,
      // length: 100,
      gravityY: -500,
    });

    player.emitterHurt = player.particles.createEmitter({
      speed: 0,
      // scale: { start: 0.05, end: 0 },
      scale: { start: 0.3 * player.char.scaleCharSpriteReality, end: 0 },
      // blendMode: 'SUBTRACT'3,
      // bounce: 1,
      // length: 100,
    });
  });
}

export function createColliderTablePlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.physics.add.collider(player.char.sprite, game.TABLE);
  });
}

export function createColliderTableAttackPhysicals(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.physics.add.collider(player.char.attackPhysical.sprite, game.TABLE);
  });
}
export function createColliderTableAttackEnergies(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.bouncePlatforms) {
      game.physics.add.collider(player.char.attackEnergy.sprite, game.TABLE);
    }
  });
}

export function createEmitterChompFollowChomp(game: Game): void {
  game.chomp.emitterDark
    .startFollow(game.chomp.block)
    .setAlpha(1)
    .setTint(0x000000);

  game.chomp.emitterDark.active = true;
  game.chomp.emitterDark.on = true;
  game.chomp.emitterDark.visible = false;
}

export function createEmittersFollowPlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    // player.emitterLight.setScale(player.char.scaleCharSpriteReality);
    // player.emitterDark.setScale(player.char.scaleCharSpriteReality);
    // player.emitterPlayer.setScale(player.char.scaleCharSpriteReality);
    // player.emitterHurt.setScale(player.char.scaleCharSpriteReality);

    player.emitterLight.startFollow(player.char.sprite);
    player.emitterDark.startFollow(player.char.sprite);
    player.emitterPlayer.startFollow(player.char.sprite);
    player.emitterHurt.startFollow(player.char.sprite);

    player.emitterLight.setAlpha(0.3);
    player.emitterDark.setAlpha(1);
    player.emitterPlayer.setAlpha(1);
    player.emitterHurt.setAlpha(0.5);
    // player.emitterPlayer.setAlpha(0.3);

    player.emitterLight.setTint(0xffffff);
    player.emitterDark.setTint(0x000000);
    player.emitterPlayer.setTint(game.colorCircles[playerIndex].colorNumber);
    player.emitterHurt.setTint(game.colorCircles[playerIndex].colorNumber);

    // EMN ACTIVE
    player.emitterLight.active = false;
    player.emitterDark.active = true;
    player.emitterPlayer.active = false;
    player.emitterHurt.active = false;

    player.emitterLight.on = false;
    player.emitterDark.on = true;
    player.emitterPlayer.on = false;
    player.emitterHurt.on = true; // always on

    player.emitterLight.visible = false;
    player.emitterDark.visible = false;
    // player.emitterPlayer.visible = false;
    // player.emitterHurt.visible = false;
  });
}

export function createLavas(game: Game): void {
  const initialLeftMostLava = (-1 * SCREEN_DIMENSIONS.WIDTH) / 2;

  for (let i = 0; i < game.lavas.length; i++) {
    createLava(i, game, initialLeftMostLava + i * game.lavas[i].width);
  }
}

export function createLava(i: number, game: Game, posX: number): void {
  const bottomOfMap = SCREEN_DIMENSIONS.HEIGHT + 10;
  // const bottomOfMap = SCREEN_DIMENSIONS.HEIGHT + 28;

  game.lavas[i].sprite = game.physics.add.sprite(posX, bottomOfMap, 'lava');

  var config_lava = {
    key: 'lava_moving',
    frames: game.anims.generateFrameNumbers('lava', {
      start: 0,
      end: game.lavas[i].numFrames - 1,
      first: 0,
    }),
    frameRate: game.lavas[i].rate,
    repeat: -1,
    yoyo: false,
  };

  game.anims.create(config_lava);
  game.lavas[i].sprite.setScale(3);
  game.lavas[i].sprite.setImmovable(true);
  game.lavas[i].sprite.body.allowGravity = false;
  game.lavas[i].sprite.play('lava_moving');
  game.lavas[i].sprite.setOrigin(0, 0);
}

export function createPlayers(game: Game): void {
  setPlayersInitialPositions(game);

  game.players.forEach((player, playerIndex) => {
    player.inputType = game.playerChoicesInputType[playerIndex];
  });

  game.players.forEach((player, playerIndex) => {
    if (player.char.srcSpriteSheet === '') {
      player.char.sprite = game.physics.add.sprite(
        SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x,
        game.BASE_PLAYER_INITIAL_POSITION.POSITION.PLAYER_Y,
        player.char.name
      );
    } else {
      player.char.sprite = game.physics.add.sprite(
        SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x,
        game.BASE_PLAYER_INITIAL_POSITION.POSITION.PLAYER_Y,
        player.char.name + '_spritesheet'
      );

      var config_idle = {
        key: player.char.name + '_idle',
        frames: game.anims.generateFrameNumbers(
          player.char.name + '_spritesheet',
          {
            start: 0,
            end: 0,
            first: 0,
          }
        ),
        frameRate: 1,
        repeat: -1,
      };

      var config_walk = {
        key: player.char.name + '_walk',
        frames: game.anims.generateFrameNumbers(
          player.char.name + '_spritesheet',
          {
            start: 1,
            end: 3,
            first: 1,
          }
        ),
        frameRate: 20,
        repeat: -1,
      };

      var config_jumpUp = {
        key: player.char.name + '_jumpUp',
        frames: game.anims.generateFrameNumbers(
          player.char.name + '_spritesheet',
          {
            start: 4,
            end: 4,
            first: 4,
          }
        ),
        frameRate: 1,
        repeat: -1,
      };

      var config_jumpDown = {
        key: player.char.name + '_jumpDown',
        frames: game.anims.generateFrameNumbers(
          player.char.name + '_spritesheet',
          {
            start: 7,
            end: 7,
            first: 7,
          }
        ),
        frameRate: 1,
        repeat: -1,
      };

      var config_climb = {
        key: player.char.name + '_climb',
        frames: game.anims.generateFrameNumbers(
          player.char.name + '_spritesheet',
          {
            start: 5,
            end: 6,
            first: 5,
          }
        ),
        frameRate: 10,
        repeat: -1,
      };

      game.anims.create(config_idle);
      game.anims.create(config_walk);
      game.anims.create(config_jumpUp);
      game.anims.create(config_jumpDown);
      game.anims.create(config_climb);
    }
  });

  game.players.forEach((player, playerIndex) => {
    player.char.attackPhysical.audio = game.sound.add('gun', { volume: 0.6 });
  });

  game.players.forEach((player, playerIndex) => {
    // for (let i = 0; i < 15; i++) {
    for (let i = 0; i < 10; i++) {
      player.char.wallTouchArray.push(false);
    }

    player.char.sprite.setScale(player.char.scaleCharSpriteImage);
    // player.char.sprite.flipX = !player.char.initializeCharPosition.lookingRight;
    player.char.sprite.flipX = playerIndex % 2 ? true : false;

    player.char.sprite.setCollideWorldBounds(false);

    game.physics.add.collider(player.char.sprite, game.PLATFORMS);

    // player.keyboard = game.input.keyboard.addKeys(player.keyboard_static);
  });

  game.players.forEach((player, playerIndex) => {
    setBlinkTrue(player);
  });
}

export function createAttackPhysicals(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.char.attackPhysical.sprite = game.physics.add
      .sprite(-500, -500, player.char.attackPhysical.srcImage)
      .setMass(player.char.attackPhysical.mass)
      .setScale(player.char.attackPhysical.scale)
      .setOrigin(0.5, 0.5)
      .setActive(true)
      .setVisible(true)
      .setTint(game.colorCircles[playerIndex].colorNumber)
      .setAlpha(0.5);

    player.char.attackPhysical.sprite.body.allowGravity = false;

    setAttackPhysicalOffscreen(player, game);
  });
}
export function createAttackEnergies(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    let ae = player.char.attackEnergy;
    ae.sprite = game.physics.add
      .sprite(-300, -300, ae.srcImage)
      .setMass(ae.mass)
      .setScale(ae.scale)
      .setRotation(ae.rotation.initial * Math.PI)
      .setAngularVelocity(ae.rotation.speed * Math.PI);

    ae.sprite.body.allowGravity = ae.gravity;
    ae.sprite.body.bounce.set(ae.bounceX, ae.bounceY);
    // ae.sprite.body.gravity.set(0, 0);
    if (ae.bouncePlatforms) {
      game.physics.add.collider(ae.sprite, game.PLATFORMS);
    }

    filterAttackEnergyNormal(player, playerIndex, game);
  });

  game.players.forEach((player, playerIndex) => {
    let ae = player.char.attackEnergy;
    if (game.debug.BulletsAllowGroups && ae.attackBullets) {
      ae.attackBullets.bullets = new Bullets(game, player);
      let aebs = ae.attackBullets.bullets;
      let x = ae.attackBullets;
      ae.attackBullets.soundB1 = game.sound.add(x.sB1, {
        volume: x.vB1,
      });
      ae.attackBullets.soundB2 = game.sound.add(x.sB2, { volume: x.vB2 });
      ae.attackBullets.soundP1 = game.sound.add(x.sP1, { volume: x.vP1 });
      ae.attackBullets.soundP2 = game.sound.add(x.sP2, { volume: x.vP2 });

      game.physics.add.collider(aebs, game.PLATFORMS);

      for (let i = 0; i < game.players.length; i++) {
        game.physics.add.collider(aebs, game.players[i].char.sprite);

        if (game.debug.CollidersABvAE) {
          game.physics.add.collider(
            aebs,
            game.players[i].char.attackEnergy.sprite
          );
        }
        if (game.debug.CollidersABvAP) {
          game.physics.add.collider(
            aebs,
            game.players[i].char.attackPhysical.sprite
          );
        }
      }

      game.physics.add.collider(aebs, game.chomp.sprite);
      game.physics.add.collider(aebs, game.TABLE);

      // turn off gravity for bullets
      aebs.children.iterate((child: any) => {
        if (player.char.attackEnergy.gravity) {
          child.body.allowGravity = true;
        } else {
          child.body.allowGravity = false;
        }
      });
    }

    // game.input.on('pointerdown', (pointer: any) => {
    //   console.log('pointerdown');
    //   if (ae.bullets) {
    //     // x: pointer.worldX,
    //     // y: pointer.worldY,
    //     ae.bullets.soundBullets.rate = Math.random() * 0.2 + 1.5;
    //     ae.bullets.soundBullets.play();

    //     let posStart: Position = {
    //       x: player.char.sprite.x,
    //       y: player.char.sprite.y,
    //     };

    //     let posEnd: Position = {
    //       x: pointer.worldX,
    //       y: pointer.worldY,
    //     };

    //     let vector = getNormalizedVector(
    //       posStart.x,
    //       posStart.y,
    //       posEnd.x,
    //       posEnd.y
    //     );

    //     let vectorMult = {
    //       x: vector.x * 2000,
    //       y: vector.y * 2000,
    //     };

    //     ae.bullets.sprite.fireBullet(posStart, vectorMult);
    //   }
    // });
  });
}

export function createCollidersPvP(game: Game): void {
  if (!game.debug.CollidersPvP) {
    return;
  }

  game.players.forEach((iPlayer, i) => {
    game.colliderPvP.push([]);
    game.players.forEach((jPlayer, j) => {
      if (j !== i) {
        game.colliderPvP[i].push(
          game.physics.add.collider(iPlayer.char.sprite, jPlayer.char.sprite)
        );
      } else {
        game.colliderPvP[i].push('XXX');
      }
    });
  });
}

export function createCollidersPvAP(game: Game): void {
  if (!game.debug.CollidersPvAP) {
    return;
  }

  game.players.forEach((iPlayer, i) => {
    game.colliderPvAP.push([]);
    game.players.forEach((jPlayer, j) => {
      if (i !== j) {
        game.colliderPvAP[i].push(
          game.physics.add.collider(
            iPlayer.char.sprite,
            jPlayer.char.attackPhysical.sprite
          )
        );
      } else {
        game.colliderPvAP[i].push('XXX');
      }
    });
  });
}
export function createCollidersPvAE(game: Game): void {
  if (!game.debug.CollidersPvAE) {
    return;
  }

  game.players.forEach((iPlayer, i) => {
    game.colliderPvAE.push([]);
    game.players.forEach((jPlayer, j) => {
      if (i !== j) {
        game.colliderPvAE[i].push(
          game.physics.add.collider(
            iPlayer.char.sprite,
            jPlayer.char.attackEnergy.sprite
          )
        );
      } else {
        game.colliderPvAE[i].push('XXX');
      }
    });
  });

  console.log('game.colliderPvAE', game.colliderPvAE);
}
export function createCollidersAEvAE(game: Game): void {
  if (!game.debug.CollidersAEvAE) {
    return;
  }

  game.players.forEach((iPlayer, i) => {
    game.colliderAEvAE.push([]);
    game.players.forEach((jPlayer, j) => {
      if (i !== j) {
        game.colliderAEvAE[i].push(
          game.physics.add.collider(
            iPlayer.char.attackEnergy.sprite,
            jPlayer.char.attackEnergy.sprite
          )
        );
      } else {
        game.colliderAEvAE[i].push('XXX');
      }
    });
  });
}
export function createCollidersAEvAP(game: Game): void {
  if (!game.debug.CollidersAEvAP) {
    return;
  }

  game.players.forEach((iPlayer, i) => {
    game.colliderAEvAP.push([]);
    game.players.forEach((jPlayer, j) => {
      if (i !== j) {
        game.colliderAEvAP[i].push(
          game.physics.add.collider(
            iPlayer.char.attackEnergy.sprite,
            jPlayer.char.attackPhysical.sprite
          )
        );
      } else {
        game.colliderAEvAP[i].push('XXX');
      }
    });
  });
}

export function createBackground(game: Game): void {
  const scaleUp = 1.1;

  game.BACKGROUND = game.physics.add.sprite(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    'background'
  );
  game.BACKGROUND.setScale(
    game.SCREEN_SCALE.WIDTH * scaleUp,
    game.SCREEN_SCALE.HEIGHT * scaleUp
  );
  // game.BACKGROUND.setOrigin(0.5, 0.5);
  game.BACKGROUND.setImmovable(true);
  game.BACKGROUND.body.allowGravity = false;
}

export function createBackgroundOutline(game: Game): void {
  game.BACKGROUND_OUTLINE = game.physics.add.sprite(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    'background_outline'
  );
  game.BACKGROUND_OUTLINE.setScale(
    game.SCREEN_SCALE.WIDTH,
    game.SCREEN_SCALE.HEIGHT
  );
  // game.BACKGROUND_OUTLINE.setOrigin(0.5, 0.5);
  game.BACKGROUND_OUTLINE.setImmovable(true);
  game.BACKGROUND_OUTLINE.body.allowGravity = false;
}

export function createPlatforms0(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
}
export function createPlatforms1(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 3 + 320,
    'platformVertical'
  );
  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
}
export function createPlatforms2(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    'platformHorizontal'
  );
  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2 - 34 * 10,
    SCREEN_DIMENSIONS.HEIGHT / 2 - 34,
    'brick'
  );
  game.PLATFORMS.create(
    SCREEN_DIMENSIONS.WIDTH / 2 + 34 * 10,
    SCREEN_DIMENSIONS.HEIGHT / 2 - 34,
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
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
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

export function createPlatforms4(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  for (let i = 0; i < 3; i++) {
    game.PLATFORMS.create(
      1207 * game.SCREEN_SCALE.WIDTH + i * game.ASSET_BRICK_WIDTH,
      710 * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }

  for (let i = 0; i < 20; i++) {
    game.PLATFORMS.create(
      600,
      SCREEN_DIMENSIONS.HEIGHT / 2 + 300 + i * game.ASSET_BRICK_HEIGHT,
      'platformHorizontal'
    );
  }

  for (let i = 0; i < 2; i++) {
    game.PLATFORMS.create(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2 + i * game.ASSET_BRICK_HEIGHT,
      'platformHorizontal'
    );
  }

  for (let i = 0; i < 25; i++) {
    game.PLATFORMS.create(
      1700 * game.SCREEN_SCALE.WIDTH,
      (1080 / 1.5) * game.SCREEN_SCALE.HEIGHT + game.ASSET_BRICK_HEIGHT * i,
      'platformShort'
    );
  }

  for (let i = 0; i < 5; i++) {
    game.PLATFORMS.create(
      1617 * game.SCREEN_SCALE.WIDTH,
      (686 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
      'brick'
    );
  }
  for (let i = 0; i < 5; i++) {
    game.PLATFORMS.create(
      1783 * game.SCREEN_SCALE.WIDTH,
      (686 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
      'brick'
    );
  }
}
export function createPlatforms5(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  // for (let i = 0; i < 3; i++) {
  //   game.PLATFORMS.create(
  //     1920 * game.SCREEN_SCALE.WIDTH * game.ASSET_BRICK_WIDTH,
  //     1080 * game.SCREEN_SCALE.HEIGHT * i,
  //     "platformVertical"
  //   );
  // }

  // for (let i = 0; i < 25; i++) {
  //   game.PLATFORMS.create(
  //     1700 * game.SCREEN_SCALE.WIDTH,
  //     (1080 / 1.5) * game.SCREEN_SCALE.HEIGHT + game.ASSET_BRICK_HEIGHT * i,
  //     "platformShort"
  //   );
  // }

  for (let i = 0; i < 2; i++) {
    game.PLATFORMS.create(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2 + i * game.ASSET_BRICK_HEIGHT,
      'platformHorizontal'
    );
  }

  for (let i = 0; i < 2; i++) {
    game.PLATFORMS.create(
      614 * game.SCREEN_SCALE.WIDTH + i * game.ASSET_BRICK_WIDTH,
      710 * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }

  for (let i = 0; i < 2; i++) {
    game.PLATFORMS.create(
      (1207 + 34 * 5) * game.SCREEN_SCALE.WIDTH + i * game.ASSET_BRICK_WIDTH,
      (710 - 34) * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }

  for (let i = 0; i < 6; i++) {
    game.PLATFORMS.create(
      (1518 + 0 * 33) * game.SCREEN_SCALE.WIDTH + i * game.ASSET_BRICK_WIDTH,
      (924 - 34 * 2) * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }
}

export function createPlatforms6(game: Game): void {
  game.PLATFORMS = game.physics.add.staticGroup();

  // for (let i = 0; i < 3; i++) {
  //   game.PLATFORMS.create(
  //     1920 * game.SCREEN_SCALE.WIDTH * game.ASSET_BRICK_WIDTH,
  //     1080 * game.SCREEN_SCALE.HEIGHT * i,
  //     "platformVertical"
  //   );
  // }

  // for (let i = 0; i < 25; i++) {
  //   game.PLATFORMS.create(
  //     1700 * game.SCREEN_SCALE.WIDTH,
  //     (1080 / 1.5) * game.SCREEN_SCALE.HEIGHT + game.ASSET_BRICK_HEIGHT * i,
  //     "platformShort"
  //   );
  // }

  for (let i = 0; i < 1; i++) {
    game.PLATFORMS.create(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2 + i * game.ASSET_BRICK_HEIGHT + 3 * 34,
      'platformHorizontal'
    );
  }
  for (let i = 0; i < 3; i++) {
    game.PLATFORMS.create(
      SCREEN_DIMENSIONS.WIDTH / 2 - 10 * 33,
      SCREEN_DIMENSIONS.HEIGHT / 2 +
        10 * 34 +
        i * game.ASSET_BRICK_HEIGHT +
        3 * 34,
      'platformHorizontal'
    );
  }

  for (let i = 0; i < 3; i++) {
    game.PLATFORMS.create(
      (614 - 8 * 33) * game.SCREEN_SCALE.WIDTH + i * game.ASSET_BRICK_WIDTH,
      (710 + 5 * 34) * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }

  for (let i = 0; i < 1; i++) {
    game.PLATFORMS.create(
      (1207 + 33 * 5) * game.SCREEN_SCALE.WIDTH +
        i * game.ASSET_BRICK_WIDTH +
        13,
      (710 - 5 * 34) * game.SCREEN_SCALE.HEIGHT + 3 * 34,
      'platformVertical'
    );
  }

  for (let i = 0; i < 5; i++) {
    game.PLATFORMS.create(
      (1518 + 1 * 33) * game.SCREEN_SCALE.WIDTH +
        i * game.ASSET_BRICK_WIDTH +
        3 * 33,
      (924 - 34 * 2) * game.SCREEN_SCALE.HEIGHT,
      'platformVertical'
    );
  }

  for (let i = 0; i < 5; i++) {
    game.PLATFORMS.create(
      1617 * game.SCREEN_SCALE.WIDTH,
      (686 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
      'brick'
    );
  }
  for (let j = 0; j < 20; j++) {
    for (let i = 0; i < 9; i++) {
      game.PLATFORMS.create(
        1617 * game.SCREEN_SCALE.WIDTH - j * 33,
        (686 - 68 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT +
          j * 34 +
          4 * 34,
        'brick'
      );
    }
  }
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 2; i++) {
      game.PLATFORMS.create(
        1617 * game.SCREEN_SCALE.WIDTH - j * 33 + 33 * 6,
        (686 - 68 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT +
          j * 34 +
          2 * 34,
        'brick'
      );
    }
  }
  // for (let j = 0; j < 14; j++) {
  //   game.PLATFORMS.create(
  //     1617 * game.SCREEN_SCALE.WIDTH - 33 * 7,
  //     (686 - 68 + game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT -
  //       j * 34 +
  //       34 * 4,
  //     'brick'
  //   );
  // }
  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 2; i++) {
      game.PLATFORMS.create(
        1617 * game.SCREEN_SCALE.WIDTH - j * 33 - 33 * 8,
        (686 - 68 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT +
          j * 34 +
          5 * 34,
        'brick'
      );
    }
  }
  // for (let i = 0; i < 3; i++) {
  //   game.PLATFORMS.create(
  //     (1617 - 33) * game.SCREEN_SCALE.WIDTH,
  //     (686 - 34 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
  //     'brick'
  //   );
  // }
  // for (let i = 0; i < 3; i++) {
  //   game.PLATFORMS.create(
  //     (1617 - 66) * game.SCREEN_SCALE.WIDTH,
  //     (686 - 0 + i * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
  //     'brick'
  //   );
  // }
  // for (let i = 0; i < 50; i++) {
  //   game.PLATFORMS.create(
  //     (1617 - 33 * i) * game.SCREEN_SCALE.WIDTH,
  //     (686 + 34 * 1 * game.ASSET_BRICK_HEIGHT) * game.SCREEN_SCALE.HEIGHT,
  //     'brick'
  //   );
  // }
}

export function createTable(game: Game): void {
  game.TABLE = game.physics.add.sprite(
    (SCREEN_DIMENSIONS.WIDTH / 2) * game.SCREEN_SCALE.WIDTH,
    (SCREEN_DIMENSIONS.HEIGHT / 2 - 300) * game.SCREEN_SCALE.HEIGHT,
    'table'
  );
  // game.TABLE = game.physics.add.sprite(
  //   (1920 / 2) * game.SCREEN_SCALE.WIDTH,
  //   (1080 / 2 - 43) * game.SCREEN_SCALE.HEIGHT,
  //   'table'
  // );
  game.TABLE.setScale(1);
  game.TABLE.setMass(2);
  // game.TABLE.setCollideWorldBounds(true);
  game.TABLE.setBounce(0.5);
  // game.TABLE.setImmovable(true);

  // game.physics.add.collider(game.TABLE, game.PLATFORMS);

  // game.TABLE.setImmovable(true);
  // game.TABLE.body.allowGravity = false;
}

export function createColliderTablePlatforms(game: Game): void {
  game.physics.add.collider(game.TABLE, game.PLATFORMS);
}

export function createFlag(game: Game): void {
  game.FLAG = game.physics.add.sprite(
    (1920 - 87 - game.ASSET_BRICK_WIDTH * 2) * game.SCREEN_SCALE.WIDTH,
    (1080 - 557) * game.SCREEN_SCALE.HEIGHT,
    'flag'
  );
  game.FLAG.setScale(1);
  game.FLAG.setImmovable(true);
  game.FLAG.body.allowGravity = false;
}

export function createBackgroundTitles(game: Game): void {
  game.TEXT_TITLE = game.add
    .text(
      SCREEN_DIMENSIONS.WIDTH / 2,
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
  game.TEXT_SUBTITLE = game.add
    .text(
      SCREEN_DIMENSIONS.WIDTH / 13,
      SCREEN_DIMENSIONS.HEIGHT / 2 + 10,
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
  game.TEXT_SUPERTITLE = game.add
    .text(SCREEN_DIMENSIONS.WIDTH / 2, 50, 'WEB', {
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

export function createSplashRuleFinished(game: Game): void {
  game.splashRules.forEach((splash, splashIndex) => {
    // if (splashIndex === game.splashRules.length - 1) {
    if (splash.name === 'splash-finished') {
      splash.text = game.add
        .text(
          SCREEN_DIMENSIONS.WIDTH / 2,
          SCREEN_DIMENSIONS.HEIGHT / 2,
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
              color: splash.shadowColor,
              blur: 10,
              stroke: true,
              fill: true,
            },
          }
        )
        .setOrigin(0.5, 0.5)
        .setAlpha(1);
    }
  });
}
export function createSplashBlack(game: Game): void {
  let splash = game.splashRules[0];
  splash.text = game.add
    .text(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
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
}

export function createSplashes(game: Game): void {
  game.splashRules.forEach((splash, splashIndex) => {
    if (splashIndex !== 0 && splashIndex !== game.splashRules.length - 1) {
      splash.text = game.add
        .text(
          SCREEN_DIMENSIONS.WIDTH / 2,
          SCREEN_DIMENSIONS.HEIGHT / 2,
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
    }
  });
}

export function createScoreboardShotGlass(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.shotGlass = game.add
      .sprite(
        SCREEN_DIMENSIONS.WIDTH / 2 + game.playerSpawnLocationsX[playerIndex],
        SCREEN_DIMENSIONS.HEIGHT / 2 + 200,
        'glass_full'
      )
      .setScale(
        2 / game.cameras.main.zoom / 10,
        2 / game.cameras.main.zoom / 10
      )
      .setOrigin(0.5, 0.5);
  });
}

export function createScoreboardReady(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardReady = game.add
      .text(
        SCREEN_DIMENSIONS.WIDTH / 2,
        SCREEN_DIMENSIONS.HEIGHT / 2,
        player.char.name + ' Ready', //🎮
        {
          // font: "Arial 100px",
          fontSize: '40px',
          fontFamily: 'Impact',
          // fontFamily: game.FONT_DEFAULT,
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: game.colorCircles[playerIndex].colorString,
          // stroke: player.char.color.primary,
          stroke: 'black',
          strokeThickness: 1,
          shadow: {
            offsetX: 0,
            offsetY: 3,
            color: '#000',
            blur: 3,
            stroke: true,
            fill: true,
          },
        }
      )
      .setOrigin(0.5, 0.5);
  });
}

export function createScoreboard(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    player.scoreBoardController = game.add
      .text(SCREEN_DIMENSIONS.WIDTH / 2, SCREEN_DIMENSIONS.HEIGHT / 2, '🎮', {
        // font: "Arial 100px",
        fontSize: '300px',
        fontFamily: 'Impact',
        // fontFamily: game.FONT_DEFAULT,
        // fontFamily: "'Courier New'",
        // fontFamily: "'Press Start 2P'",
        // color: "white",
        color: game.colorCircles[playerIndex].colorString,
        // stroke: player.char.color.primary,
        stroke: 'black',
        strokeThickness: 1,
        shadow: {
          offsetX: 0,
          offsetY: 3,
          color: '#000',
          blur: 3,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);
  });

  game.scoreBoardTimeGame = game.add.text(
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2,
    '',
    {
      // font: "Arial 100px",
      fontSize: game.debug.ModeInfinity ? '45px' : '85px',
      // fontFamily: "'Courier New'",
      // fontFamily: game.FONT_DEFAULT_MONOSPACE,
      fontFamily: game.debug.ModeInfinity
        ? game.FONT_DEFAULT_NICE
        : game.FONT_DEFAULT_VIDEOGAME,
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
    SCREEN_DIMENSIONS.WIDTH / 2,
    SCREEN_DIMENSIONS.HEIGHT / 2 + 100,
    '',
    {
      // font: "Arial 100px",
      fontSize: '20px',
      // fontFamily: "'Courier New'",
      fontFamily: game.FONT_DEFAULT_VIDEOGAME,
      // fontFamily: "'Press Start 2P'",
      color: 'white',
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

  game.scoreBoardTimeGame.setAlpha(1);
  game.scoreBoardTimeTime.setAlpha(1);

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardUpper = game.add
      .text(
        SCREEN_DIMENSIONS.WIDTH / 2 + game.playerSpawnLocationsX[playerIndex],
        SCREEN_DIMENSIONS.HEIGHT / 2,
        'XXX',
        {
          // font: "Arial 100px",
          fontSize: '45px',
          fontFamily: game.FONT_DEFAULT_NICE,
          // fontFamily: game.FONT_DEFAULT_MONOSPACE,
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: game.colorCircles[playerIndex].colorString,
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
      .setOrigin(0.5, 0)
      .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);
  });

  game.players.forEach((player, playerIndex) => {
    player.scoreBoardLower = game.add
      .text(
        SCREEN_DIMENSIONS.WIDTH / 2 + game.playerSpawnLocationsX[playerIndex],
        SCREEN_DIMENSIONS.HEIGHT / 2 + 100,
        'XXX',
        {
          // font: "Arial 100px",
          fontSize: '35px',
          fontFamily: game.FONT_DEFAULT_NICE,
          // fontFamily: "'Courier New'",
          // fontFamily: "'Press Start 2P'",
          // color: "white",
          color: game.colorCircles[playerIndex].colorString,
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
      .setOrigin(0.5, 1)
      .setScale(1 / game.cameras.main.zoom, 1 / game.cameras.main.zoom);
  });
}

export function createCameras(game: Game): void {
  var debugAlpha = 1;
  if (!game.debug.CamerasVisible) {
    debugAlpha = 0;
  }
  game.cameraBox.char.sprite = game.physics.add
    .sprite(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
      'centerWhite'
    )
    .setScale(0.05)
    .setAlpha(0);
  game.cameraBox.char.sprite.setImmovable(true);
  game.cameraBox.char.sprite.body.allowGravity = false;
  // game.cameras.main.startFollow(game.cameraBox.char.sprite);

  game.cameraPlayers.char.sprite = game.physics.add
    .sprite(
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
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
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
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
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
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
      SCREEN_DIMENSIONS.WIDTH / 2,
      SCREEN_DIMENSIONS.HEIGHT / 2,
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
  //   SCREEN_DIMENSIONS.WIDTH,
  //   SCREEN_DIMENSIONS.HEIGHT
  // );
}
