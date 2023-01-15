import Game from './Game';

export function ensureTypeInput<Input>(
  argument: Input | undefined | null,
  message: string = 'This value was promised to be there.'
): Input {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

export function preload(game: Game): void {
  //////////////////////////////
  // Pull Configs
  //////////////////////////////

  game.smashConfig = game.game.registry.get('smashConfig');
  game.debug = game.game.registry.get('debug');
  console.log('this.smashConfig', game.smashConfig);
  if (game.smashConfig) {
    game.playerChoicesCharacterType = [];
    game.playerChoicesInputType = [];
    game.smashConfig.players.forEach((player, playerIndex) => {
      if (game.debug.CharOverride) {
        game.playerChoicesCharacterType.push(game.debug.CharOverrideId);
      } else {
        game.playerChoicesCharacterType.push(player.characterId);
      }
      game.playerChoicesInputType.push(ensureTypeInput(player.input));
    });
  }
  game.gameSecondsClock = game.debug.TimeMinutes * 60;
  if (!game.debug.FrictionAirActive) {
    game.players.forEach((iPlayer, i) => {
      iPlayer.char.friction_air = 0;
    });
  }
  let hatAdder = 0.142857;
  let hatPos = -1 + hatAdder;
  for (let i = 0; i < 8; i++) {
    game.GAMEPAD_HAT_VALUES.push(hatPos);
    hatPos += hatAdder * 2;
  }

  game.shotsLeftCurr = game.debug.InfinityShots;

  //////////////////////////////
  // Load Audio
  //////////////////////////////

  let pathSounds = 'sounds/';
  game.load.audio('intro', pathSounds + game.FILE_SOUNDS.INTRO);
  game.load.audio('gun', pathSounds + game.FILE_SOUNDS.GUN);
  game.load.audio('shot', pathSounds + game.FILE_SOUNDS.SHOT);
  game.load.audio('hit', pathSounds + game.FILE_SOUNDS.HIT);
  game.load.audio('jump', pathSounds + game.FILE_SOUNDS.JUMP);
  game.load.audio('jumpPower', pathSounds + game.FILE_SOUNDS.JUMP_POWER);
  game.load.audio('firstBlood', pathSounds + game.FILE_SOUNDS.FIRST_BLOOD);
  game.load.audio('squish', pathSounds + game.FILE_SOUNDS.SQUISH);
  game.load.audio('die', pathSounds + game.FILE_SOUNDS.DIE);
  game.load.audio('startLiquid', pathSounds + game.FILE_SOUNDS.START_LIQUID);
  game.load.audio('start', pathSounds + game.FILE_SOUNDS.START);
  game.load.audio('ready', pathSounds + game.FILE_SOUNDS.READY);
  game.load.audio('readyRepeat', pathSounds + game.FILE_SOUNDS.READY_REPEAT);
  game.load.audio('readyRepeat0', pathSounds + game.FILE_SOUNDS.W0);
  game.load.audio('readyRepeat1', pathSounds + game.FILE_SOUNDS.W1);
  game.load.audio('readyRepeat2', pathSounds + game.FILE_SOUNDS.W2);
  game.load.audio('readyRepeat3', pathSounds + game.FILE_SOUNDS.W3);
  game.load.audio(
    'chainChompAttack',
    pathSounds + game.FILE_SOUNDS.CHAIN_CHOMP_ATTACK
  );
  game.load.audio('ping', pathSounds + game.FILE_SOUNDS.PING);
  game.load.audio('ping2', pathSounds + game.FILE_SOUNDS.PING2);
  game.load.audio('pop', pathSounds + game.FILE_SOUNDS.POP);
  game.load.audio('pop2', pathSounds + game.FILE_SOUNDS.POP2);
  // this.load.audio(
  //   "readyRepeat0",
  //   pathSounds + this.FILE_SOUNDS.READY_REPEAT0
  // );
  // this.load.audio(
  //   "readyRepeat1",
  //   pathSounds + this.FILE_SOUNDS.READY_REPEAT1
  // );
  // this.load.audio(
  //   "readyRepeat2",
  //   pathSounds + this.FILE_SOUNDS.READY_REPEAT2
  // );
  // this.load.audio(
  //   "readyRepeat3",
  //   pathSounds + this.FILE_SOUNDS.READY_REPEAT3
  // );

  game.load.audio('enerja_ah', pathSounds + game.FILE_SOUNDS.ENERJA_AH);
  game.load.audio(
    'enerja_again',
    pathSounds + game.FILE_SOUNDS.ENERJA_DO_AGAIN
  );
  game.load.audio('enerja_finish', pathSounds + game.FILE_SOUNDS.ENERJA_FINISH);
  game.load.audio('enerja_gya', pathSounds + game.FILE_SOUNDS.ENERJA_GYA);
  game.load.audio(
    'enerja_shit',
    pathSounds + game.FILE_SOUNDS.ENERJA_THAT_SHIT
  );
  game.load.audio(
    'enerja_smashed',
    pathSounds + game.FILE_SOUNDS.ENERJA_SMASHED
  );
  game.load.audio('enerja_turtle', pathSounds + game.FILE_SOUNDS.ENERJA_TURTLE);
  game.load.audio(
    'enerja_shots',
    pathSounds + game.FILE_SOUNDS.ENERJA_TWO_SHOTS
  );
  game.load.audio('enerja_ugh', pathSounds + game.FILE_SOUNDS.ENERJA_UGH);

  game.load.audio('mii', pathSounds + game.FILE_SOUNDS.BGM_MII);

  if (game.debug.MusicTrack === 0) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_DREAM);
  }
  if (game.debug.MusicTrack === 1) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_MONKEY);
  }
  if (game.debug.MusicTrack === 2) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_ROYKSOP);
  }

  game.load.audio('boom_short_01', pathSounds + game.FILE_SOUNDS.BOOM_SHORT_01);
  game.load.audio('boom_short_02', pathSounds + game.FILE_SOUNDS.BOOM_SHORT_02);

  game.load.audio('bb_bam', pathSounds + game.FILE_SOUNDS.BLACK_BETTY_BAMBALAM);
  game.load.audio('bb_woah', pathSounds + game.FILE_SOUNDS.BLACK_BETTY_WOAH);

  //////////////////////////////
  // Load Images
  //////////////////////////////

  game.load.image('fist-gray', 'images/fist-gray.png');
  game.load.image('fist-black', 'images/fist-black.png');
  game.load.image('fist-white', 'images/fist.png');
  game.load.image('flame', 'images/flame_small.png');
  game.load.image('laser', 'images/laser.png');
  game.load.image('mirror', 'images/mirror.png');

  game.load.image('blockcracked', 'images/blockcracked.png');
  game.load.image('fireball', 'images/fireball.png');
  game.load.image('flagpole', 'images/flagpole.png');
  game.load.image('greenshell', 'images/greenshell.png');
  game.load.image('redshell', 'images/redshell.png');
  game.load.image('blueshell', 'images/blueshell_wing.png');
  game.load.image('bottle', 'images/bottle.png');
  game.load.image('hammer', 'images/ham.png');
  game.load.image('blackHammer', 'images/blackHammer.png');
  game.load.image('sword', 'images/sword_right.png');

  game.load.image('table', 'images/table.png');
  game.load.image('flag', 'images/flagpole_JK2.png');

  game.load.image('background', 'images/darkxp.jpg');
  game.load.image('background_outline', 'images/outline_blocks_04.png');
  game.load.image('centerWhite', 'images/wx.png');
  game.load.image('centerBlack', 'images/bx.png');
  game.load.image('centerMagenta', 'images/mx.png');
  game.load.image('centerRed', 'images/rx.png');
  game.load.image('platformHorizontal', 'images/brickhoriz.bmp');
  game.load.image('platformShort', 'images/brickhorizshorter.bmp');
  game.load.image('platformVertical', 'images/brickvert.bmp');
  game.load.image('brick', 'images/blockcracked.png');
  game.load.image('suburb', 'images/suburb.png');

  game.load.image('flag_joey', 'images/flagpole_JK2.png');
  game.load.image('glass_full', 'images/niemo_shot_full.png');
  game.load.image('glass_empty', 'images/niemo_shot_empty.png');

  game.load.image('chomp_block', 'images/chomp_block.png');
  game.load.image('chomp_link', 'images/chomp_chain_trans.png');

  //////////////////////////////
  //  LOAD SPRITESHEETS
  //////////////////////////////

  game.load.spritesheet({
    key: 'lava',
    url: 'images/lava_oddVert_noPadding_256x39.png',
    frameConfig: {
      frameWidth: game.lavas[0].width,
      frameHeight: game.lavas[0].height,
      startFrame: 0,
      endFrame: game.lavas[0].numFrames - 1,
      margin: 0,
      spacing: 0,
    },
  });

  game.load.spritesheet({
    key: 'chomp',
    url: 'images/chompsheet4.png',
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      endFrame: 3,
      margin: 0,
      spacing: 0,
    },
  });

  game.load.spritesheet({
    key: 'explosion256',
    url: 'images/explosion_256.png',
    frameConfig: {
      frameWidth: 256,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 47,
      margin: 0,
      spacing: 0,
    },
  });

  game.playerOptions.forEach((pOption, pOptionIndex) => {
    game.load.image(pOption.char.name, pOption.char.src);
  });

  game.load.image('gun', 'images/white_trans.png');

  for (let i = 0; i < game.playerChoicesCharacterType.length; i++) {
    game.load.image('tail_' + i, 'images/white_trans.png');
  }

  game.playerOptions.forEach((pOption, pOptionIndex) => {
    if (pOption.char.srcSpriteSheet !== '') {
      game.load.spritesheet({
        key: pOption.char.name + '_spritesheet',
        url: pOption.char.srcSpriteSheet,
        frameConfig: {
          frameWidth: pOption.char.spriteSize.width * 4 + 2,
          frameHeight: pOption.char.spriteSize.height * 4 + 2,
          startFrame: 0,
          endFrame: 7,
          margin: 0,
          spacing: 0,
        },
      });
    }
  });
}
