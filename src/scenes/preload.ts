import { HEADLESS } from 'phaser';
import Game from './Game';

export function preload(game: Game): void {
  game.smashConfig = game.game.registry.get('smashConfig');
  game.debug = game.game.registry.get('debug');
  console.log('this.smashConfig', game.smashConfig);
  if (game.smashConfig) {
    game.playerChoices = [];
    game.smashConfig.players.forEach((player, playerIndex) => {
      game.playerChoices.push(player.characterId);
    });
  }
  game.gameSecondsClock = game.debug.setDurationMinutes * 60;
  if (!game.debug.setFrictionAirActive) {
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

  let pathHeads = 'images/heads/';
  game.load.image('headMario', pathHeads + game.FILE_HEADS.mario + '.webp');
  game.load.image('headLink', pathHeads + game.FILE_HEADS.link + '.webp');
  game.load.image('headPikachu', pathHeads + game.FILE_HEADS.pikachu + '.webp');
  game.load.image('headKirby', pathHeads + game.FILE_HEADS.kirby + '.webp');
  game.load.image('headChez', pathHeads + game.FILE_HEADS.chez + '.webp');
  game.load.image('headBlackChez', pathHeads + game.FILE_HEADS.blackchez + '.webp');
  
  let pathSounds = 'sounds/';
  game.load.audio('intro', pathSounds + game.FILE_SOUNDS.INTRO);
  game.load.audio('gun', pathSounds + game.FILE_SOUNDS.GUN);
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

  if (game.debug.setMusicNumber === 0) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_DREAM);
  }
  if (game.debug.setMusicNumber === 1) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_MONKEY);
  }
  if (game.debug.setMusicNumber === 2) {
    game.load.audio('bgm', pathSounds + game.FILE_SOUNDS.BGM_ROYKSOP);
  }
  game.load.image('fist-gray', 'images/fist-gray.png');
  game.load.image('fist-black', 'images/fist-black.png');
  game.load.image('fist-white', 'images/fist.png');
  game.load.image('flame', 'images/flame_small.png');
  game.load.image('laser', 'images/laser.png');

  game.load.image('blockcracked', 'images/blockcracked.png');
  game.load.image('fireball', 'images/fireball.png');
  game.load.image('flagpole', 'images/flagpole.png');
  game.load.image('greenshell', 'images/greenshell.png');
  game.load.image('bottle', 'images/bottle.png');
  game.load.image('hammer', 'images/ham.png');
  game.load.image('blackHammer', 'images/blackHammer.png');
  game.load.image('sword', 'images/sword_right.png');

  game.load.image('table', 'images/table.png');
  game.load.image('flag', 'images/flagpole_JK2.png');

  game.load.image('background', 'images/darkxp.jpg');
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

  game.playerOptions.forEach((pOption, pOptionIndex) => {
    game.load.image(pOption.char.name, pOption.char.src);
  });
  for (let i = 0; i < game.playerChoices.length; i++) {
    game.load.image('tail_' + i, 'images/white_trans.png');
  }
}
