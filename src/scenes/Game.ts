import 'phaser';
import { create } from './create';
import { update } from './update';
import {
  Camera,
  ColorCircle,
  Clock,
  Player,
  SplashRules,
  SplashEndData,
  GameStateWithTime,
  Vector,
  keyboard,
} from './interfaces';
import { preload } from './preload';
import { Debug, SmashConfig } from '../views/ViewInterfaces';

export default class Game extends Phaser.Scene {
  ////////////////////////////////
  ////////// GAME DEBUG
  ////////////////////////////////
  debug: Debug | any;

  ////////////////////////////////
  ////////// GAME CONSTANTS
  ////////////////////////////////
  DURATION_GAME_START: number = 1200;
  DURATION_GAME_PAUSE_MUSIC_SHORT: number = 2000;
  DURATION_GAME_PAUSE_MUSIC_LONG: number = 10000;
  DURATION_GAME_SHOT: number = 4000;
  TEXT_TITLE: any;
  TEXT_SUBTITLE: any;
  TEXT_SUPERTITLE: any;
  TEXT_GAMEBAR_CHARS = { kills: ' ⇧💀⇩ ', deaths: '', damage: '♡', shots: '☆' };
  ASSET_BRICK_WIDTH: number = 33;
  ASSET_BRICK_HEIGHT: number = 34;
  SCREEN_DIMENSIONS = { WIDTH: 1920, HEIGHT: 1080 };
  SCREEN_SCALE = {
    WIDTH: this.SCREEN_DIMENSIONS.WIDTH / 1920,
    HEIGHT: this.SCREEN_DIMENSIONS.HEIGHT / 1080,
  };
  PLATFORMS: any | Phaser.GameObjects.Sprite;
  BACKGROUND: any | Phaser.GameObjects.Sprite;
  TABLE: any | Phaser.GameObjects.Sprite;
  FLAG: any | Phaser.GameObjects.Sprite;
  ZOOM_MULTIPLIER_X = 0.95;
  ZOOM_MULTIPLIER_Y = 0.7;
  ZOOM_RATIO_SLOW = 0.9995;
  ZOOM_RATIO_FAST = 0.9;
  BORDER_PADDING_X: number = 200;
  BORDER_PADDING_Y: number = 100;
  CAMERA_OFFSET_Y: number = -50;

  FILE_SOUNDS: any = {
    INTRO: 'deep.mp3',
    GUN: 'throw.wav',
    HIT: 'punch.wav',
    JUMP: 'woosh_quiet.mp3',
    JUMP_POWER: 'quick-swhooshing-noise-80898.mp3',
    FIRST_BLOOD: 'first_blood_echo-92250.mp3',
    SQUISH: 'goresplat-7088.mp3',
    DIE: 'sword-hits-the-body-48273.mp3',
    START_LIQUID: 'game-start-liquid.wav',
    START: 'start.wav',
    READY: 'ready.wav',
    READY_REPEAT: 'ready_repeat.wav',
    READY_REPEAT0: 'ready_0.wav',
    READY_REPEAT1: 'ready_1.wav',
    READY_REPEAT2: 'ready_2.wav',
    READY_REPEAT3: 'ready_3.wav',
    W0: 'w0.wav',
    W1: 'w1.wav',
    W2: 'w2.wav',
    W3: 'w3.wav',
    ENERJA_AH: '/enerja/ah.mp3',
    ENERJA_DO_AGAIN: '/enerja/do_it_again_yeah.mp3',
    ENERJA_FINISH: '/enerja/finishit.mp3',
    ENERJA_GYA: '/enerja/gya.mp3',
    ENERJA_THAT_SHIT: '/enerja/more_than_that_shit_happen.mp3',
    ENERJA_SMASHED: '/enerja/smashed_yes_you_are_ahhhhh.mp3',
    ENERJA_TURTLE: '/enerja/turtle.mp3',
    ENERJA_TWO_SHOTS: '/enerja/two_shots.mp3',
    ENERJA_UGH: '/enerja/ugh.mp3',
    BGM_MII: 'wii_short.wav',
    BGM_DREAM: 'kirbyloop.wav',
    BGM_MONKEY: '/na/monkeys2.wav',
    BGM_ROYKSOP: '/na/royksop_macumba_05loop.wav',
  };

  SOUND_INTRO: any;
  SOUND_GUN: any;
  SOUND_HIT: any;
  SOUND_JUMP_PHYSICAL: any;
  SOUND_JUMP_ENERGY: any;
  SOUND_FIRST_BLOOD: any;
  SOUND_SQUISH: any;
  SOUND_DIE: any;
  SOUND_START_LIQUID: any;
  SOUND_START: any;
  SOUND_READY: any;
  SOUND_READY_REPEAT: any;
  SOUND_READY_REPEAT0: any;
  SOUND_READY_REPEAT1: any;
  SOUND_READY_REPEAT2: any;
  SOUND_READY_REPEAT3: any;
  W0: any;
  W1: any;
  W2: any;
  W3: any;
  ENERJA_AH: any;
  ENERJA_DO_AGAIN: any;
  ENERJA_FINISH: any;
  ENERJA_GYA: any;
  ENERJA_HAPPEN: any;
  ENERJA_SMASHED: any;
  ENERJA_TURTLE: any;
  ENERJA_TWO_SHOTS: any;
  ENERJA_UGH: any;
  SOUND_PAUSED: any;
  SOUND_BGM: any;

  ////////////////////////////////
  ////////// GAME VARIABLES
  ////////////////////////////////
  smashConfig: SmashConfig | null = null;
  loaded: boolean = false;
  readyLocationLROffset: number = 0;
  glassLocationLROffset: number = 0;
  upperTextLocationLROffset: number = 0;
  lowerTextLocationLROffset: number = 0;
  textLocations: number[] = [-700, -350, 350, 700];
  numDead: number = 0;
  numDeadPrev: number = 0;

  cameraMoverZoomStatusKeeper: number = 1;

  // TIME
  scoreBoardTimeGame: any;
  scoreBoardTimeTime: any;
  timeNanoseconds: number = 0;
  timeSeconds: number = 0;
  timeSecondsPrev: number = 0;
  timeSecondsClock: number = 0;
  timeClock: Clock = { minutes: 0, seconds: 0 };
  gameNanoseconds: number = 0;
  gameSeconds: number = 0;
  gameSecondsPrev: number = 0;
  gameSecondsClock: number = 10;
  gameClock: Clock = { minutes: 0, seconds: 0 };
  timer: any;

  ////////////////////////////////
  ////////// GAMEPAD CONSTANTS
  ////////////////////////////////

  GAMEPAD_HAT_VALUES: number[] = [];
  GAMEPAD_DEBOUNCE_NUMBER_CYCLES: number = 9;

  ////////////////////////////////
  ////////// GAMEPAD VARIABLES
  ////////////////////////////////

  ////////////////////////////////
  ////////// PLAYER CONSTANTS
  ////////////////////////////////
  DURATION_PLAYER_HURT: number = 1000;
  DURATION_PLAYER_DEAD: number = 5000;
  DURATION_PLAYER_FILTER_FLICKER: number = this.DURATION_PLAYER_HURT / 10;
  RATIO_ACCELERATION_VELOCITY = 0.85;
  DEFAULT_PLAYER_HITBACK: any = { x: 0.03, y: -0.03 };
  DEFAULT_ATTACK_HITBACK: any = { x: 0.1, y: -0.1 };
  DEFAULT_ATTACK_DAMAGE: number = 50;
  BASE_PLAYER_SPEED: Vector = { x: 900, y: 30 };
  // BASE_PLAYER_SPEED: Vector = { x: 600, y: 30 };
  BASE_PLAYER_JUMP_PHYSICAL: number = -1000;
  BASE_PLAYER_JUMP_ENERGY: number = -1000;
  BASE_PLAYER_JUMP_WALL: number = -1 * this.BASE_PLAYER_JUMP_PHYSICAL;
  BASE_PLAYER_INITIAL_POSITION = { POSITION: { PLAYER_Y: 250 } };
  BASE_PLAYER_GRAVITY: number = 0.1;
  BASE_PLAYER_HITBACK: Vector = { x: 120, y: 90 };
  BASE_PLAYER_ATTACKENERGY: Vector = { x: 600, y: 600 };

  ////////////////////////////////
  ////////// PLAYER VARIRABLES
  ////////////////////////////////
  playerChoices: number[] = [0, 1, 2, 3];
  playerSpawnOrder: number[] = [0, 1, 2, 3];
  playerSpawnLocations: number[] = [-165, -100, 100, 165];
  allPlayersWallTouchIterator: number = 0; // need to update

  ////////////////////////////////
  ////////// OTHER
  ////////////////////////////////
  //▲▼⬆⬇↑↓↑↿⇂⋆★✰☆⚡❤v♡♥
  // 💔👊🏼⭐💀
  // ✔️🚧❌🚫🛑🍻🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️
  // 👾💣🔥💀👊🤜🎰🎱🎲🔮💡🧱✨🧙 🤜🏼👊🏼🤛🏼
  //🏴‍☠️🏳️🏁🏴
  // 🔴🔵🟡🟢🟣🟠⚫⚪🟤

  circleOffset: number = -50;
  colorCircles: ColorCircle[] = [
    {
      text: '🔴',
      graphic: null,
      colorNumber: 0xe81224,
      colorString: '#e81224',
    },
    {
      text: '🔵',
      graphic: null,
      colorNumber: 0x0078d7,
      colorString: '#0078d7',
    },
    {
      text: '🟡',
      graphic: null,
      colorNumber: 0xfff100,
      colorString: '#fff100',
    },
    {
      text: '🟢',
      graphic: null,
      colorNumber: 0x16c60c,
      colorString: '#16c60c',
    },
    {
      text: '🟣',
      graphic: null,
      colorNumber: 0x886ce4,
      colorString: '#886ce4',
    },
    {
      text: '🟠',
      graphic: null,
      colorNumber: 0xf7630c,
      colorString: '#f7630c',
    },
    {
      text: '⚫',
      graphic: null,
      colorNumber: 0x383838,
      colorString: '#383838',
    },
    {
      text: '⚪',
      graphic: null,
      colorNumber: 0xf2f2f2,
      colorString: '#f2f2f2',
    },
    {
      text: '🟤',
      graphic: null,
      colorNumber: 0x8e562e,
      colorString: '#8e562e',
    },
  ];
  FONT_DEFAULT_NICE: string = 'Impact';
  FONT_DEFAULT_VIDEOGAME: string = '"Press Start 2P"';
  FONT_DEFAULT_MONOSPACE: string = 'Consolas';
  // FONT_DEFAULT: string = 'Courier';

  splashRulesOffset: number = 50;
  splashRules: SplashRules[] = [
    {
      text: null,
      name: 'splash-black',
      word: 'BLACK',
      color: '#000000',
      backgroundColor: '#000000ff',
      size: '300px',
      src: 'glass.png',
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
    {
      text: null,
      name: 'splash-start',
      word: 'START',
      color: '#AAAAAA',
      backgroundColor: '#00000000',
      size: '370px',
      src: 'glass.png',
      strokeThickness: 10,
    },
    {
      text: null,
      name: 'splash-paused',
      word: 'PAUSED',
      color: '#003300',
      backgroundColor: '#00AA00',
      size: '570px',
      src: 'glass.png',
      strokeThickness: 10,
    },
    {
      text: null,
      name: 'splash-first-blood',
      word: 'FIRST BLOOD',
      color: '#330000',
      backgroundColor: '#FF0000',
      size: '370px',
      src: 'glass.png',
      strokeThickness: 10,
    },
    {
      text: null,
      name: 'splash-screen-clear',
      word: 'SCREEN CLEAR',
      color: '#330033',
      backgroundColor: '#bb44bb',
      size: '330px',
      src: 'glass.png',
      strokeThickness: 10,
    },
    {
      text: null,
      name: 'splash-cool-down',
      word: 'COOLDOWN PERIOD',
      color: '#ffffff',
      backgroundColor: '#00000000',
      size: '200px',
      src: 'glass.png',
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
    {
      text: null,
      name: 'splash-finished',
      word: 'FINISHED',
      color: '#ffffff',
      backgroundColor: '#000000ff',
      size: '500px',
      src: 'glass.png',
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
  ];

  splashSizeTitleDefault = '40px';
  splashEndDataOffset: number = -1100;
  SplashEndDataInit: SplashEndData = {
    textTitle: '',
    textCircles: '',
    textData: '',
    name: '',
    emoji: '',
    words: [],
    vertical: 0,
    size: '32px',
    src: 'glass.png',
    color: '#ffffff',
    backgroundColor: '#000000',
    strokeThickness: 5,
    offsetY: 0,
    blur: 5,
  };
  splashesEndData: SplashEndData[] = [
    {
      textTitle: null,
      textCircles: null,
      textData: null,
      name: 'Hits',
      emoji: '👊🏼',
      vertical: 0,
      words: [],
      color: this.SplashEndDataInit.color,
      backgroundColor: this.SplashEndDataInit.backgroundColor,
      size: this.SplashEndDataInit.size,
      src: this.SplashEndDataInit.src,
      strokeThickness: this.SplashEndDataInit.strokeThickness,
      offsetY: this.SplashEndDataInit.offsetY,
      blur: this.SplashEndDataInit.blur,
    },
    {
      textTitle: null,
      textCircles: null,
      textData: null,
      name: 'Deaths',
      emoji: '💀',
      vertical: 0,
      words: [],
      color: this.SplashEndDataInit.color,
      backgroundColor: this.SplashEndDataInit.backgroundColor,
      size: this.SplashEndDataInit.size,
      src: this.SplashEndDataInit.src,
      strokeThickness: this.SplashEndDataInit.strokeThickness,
      offsetY: this.SplashEndDataInit.offsetY,
      blur: this.SplashEndDataInit.blur,
    },
    {
      textTitle: null,
      textCircles: null,
      textData: null,
      name: 'Shots',
      emoji: '⭐',
      vertical: 0,
      words: [],
      color: this.SplashEndDataInit.color,
      backgroundColor: this.SplashEndDataInit.backgroundColor,
      size: this.SplashEndDataInit.size,
      src: this.SplashEndDataInit.src,
      strokeThickness: this.SplashEndDataInit.strokeThickness,
      offsetY: this.SplashEndDataInit.offsetY,
      blur: this.SplashEndDataInit.blur,
    },
    {
      textTitle: null,
      textCircles: null,
      textData: null,
      name: 'Characters',
      emoji: '',
      words: [],
      vertical: 0,
      color: this.SplashEndDataInit.color,
      backgroundColor: this.SplashEndDataInit.backgroundColor,
      size: this.SplashEndDataInit.size,
      src: this.SplashEndDataInit.src,
      strokeThickness: this.SplashEndDataInit.strokeThickness,
      offsetY: this.SplashEndDataInit.offsetY,
      blur: this.SplashEndDataInit.blur,
    },
  ];

  cameraPlayers: Camera = {
    char: {
      name: 'center_10',
      src: 'images/x.png',
      sprite: null,
      zoom: 0,
    },
  };
  cameraMover: Camera = {
    char: {
      name: 'center_10',
      src: 'images/x.png',
      sprite: null,
      zoom: 0,
    },
  };
  cameraPlayersHalfway: Camera = {
    char: {
      name: 'center_80',
      src: 'images/x.png',
      sprite: null,
      zoom: 0,
    },
  };
  cameraCenter: Camera = {
    char: {
      name: 'center_80',
      src: 'images/x.png',
      sprite: null,
      zoom: 0,
    },
  };
  cameraBox: Camera = {
    char: {
      name: 'center_80',
      src: 'images/x.png',
      sprite: null,
      zoom: 0,
    },
  };

  // i : player acted upon
  // j : attacks from other players
  overlappingPlayerIAttackPhysicalJ: boolean[][] = [];
  overlappingPlayerIAttackEnergyJ: boolean[][] = [];
  wasLastHitByMatrix: boolean[][] = [];
  numberHitByMatrix: number[][] = [];
  numberKilledByMatrix: number[][] = [];
  numberShotsTakenByMeMatrix: number[][] = [];

  colliderPvP: any[][] = [];
  colliderPvAP: any[][] = [];
  colliderPvAE: any[][] = [];
  colliderAEvAE: any[][] = [];
  colliderAEvAP: any[][] = [];

  gameState: GameStateWithTime = {
    name: 'game-state-start',
    gameStamp: 0,
    timeStamp: 0,
  };
  keyboardHandPositions: keyboard[] = [
    {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      A: Phaser.Input.Keyboard.KeyCodes.F,
      B: Phaser.Input.Keyboard.KeyCodes.G,
      X: Phaser.Input.Keyboard.KeyCodes.H,
      Y: Phaser.Input.Keyboard.KeyCodes.SPACE,
      L: Phaser.Input.Keyboard.KeyCodes.T,
      R: Phaser.Input.Keyboard.KeyCodes.Y,
    },
    {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      A: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
      B: Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO,
      X: Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE,
      Y: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
      L: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
      R: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
    },
    // {
    //   up: Phaser.Input.Keyboard.KeyCodes.T,
    //   down: Phaser.Input.Keyboard.KeyCodes.G,
    //   left: Phaser.Input.Keyboard.KeyCodes.F,
    //   right: Phaser.Input.Keyboard.KeyCodes.H,
    //   A: Phaser.Input.Keyboard.KeyCodes.V,
    //   B: Phaser.Input.Keyboard.KeyCodes.B,
    //   X: Phaser.Input.Keyboard.KeyCodes.B,
    //   Y: Phaser.Input.Keyboard.KeyCodes.B,
    // },
    // {
    //   up: Phaser.Input.Keyboard.KeyCodes.I,
    //   down: Phaser.Input.Keyboard.KeyCodes.K,
    //   left: Phaser.Input.Keyboard.KeyCodes.J,
    //   right: Phaser.Input.Keyboard.KeyCodes.L,
    //   A: Phaser.Input.Keyboard.KeyCodes.O,
    //   B: Phaser.Input.Keyboard.KeyCodes.P,
    //   X: Phaser.Input.Keyboard.KeyCodes.P,
    //   Y: Phaser.Input.Keyboard.KeyCodes.P,
    // },
    // {
    //   up: Phaser.Input.Keyboard.KeyCodes.UP,
    //   down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    //   left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    //   right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    //   A: Phaser.Input.Keyboard.KeyCodes.END,
    //   B: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
    //   X: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
    //   Y: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
    // },
  ];

  players: Player[] = [];
  playerOptions: Player[] = [
    {
      playerId: 0,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      shotGlass: null,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      circleOffset: 0,
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Mario',
        initializeCharPosition: {
          // lookingRight: true,
          x: -200,
          y: 100,
        },
        color: {
          primary: '#e24800',
          secondary: '#e24800',
          dark: '#1c0900',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_0_cropped.png',
        scale: 1,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        // acc: { x: 0, y: 0 },
        jumps: [1, 0.8, 0],
        jumpPower: 1,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 0.8,
        fast: 1,
        friction_ground: 0.5,
        // friction_ground: 0.94,
        friction_air: 0.02, // .02
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 20, y: 0 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'fist-gray',
          mass: 10,
          scale: 0.1,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: 20, y: -30 },
          friction: {
            ground: 1,
            wallInvertRotation: true,
            wallInvertSprite: true,
            air: 1,
          },
          vel: { x: 1, y: 1 },
          srcImage: 'fireball',
          bounceY: 1,
          bounceX: 1,
          gravity: true,
          bouncePlatforms: true,
          damage: 5,
          hitback: { x: 0.01, y: 0 },
          scale: 2,
          mass: 0.5,
          allowVelocityY: true,
          rotation: {
            initial: 0.25,
            speed: 400,
          },
        },
        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
    {
      playerId: 1,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      shotGlass: null,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      circleOffset: 0,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Link',
        initializeCharPosition: {
          // lookingRight: false,
          x: -110,
          y: 100,
        },
        color: {
          primary: '#43a528',
          secondary: '#e24800',
          dark: '#1c0900',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_1_cropped.png',
        scale: 1,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        // acc: { x: 0, y: 0 },
        jumps: [1, 0.8, 0],
        jumpPower: 0.9,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 0.7,
        fast: 1,
        friction_ground: 0.5,
        friction_air: 0.03,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 40, y: 3 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'sword',
          mass: 10,
          scale: 0.9,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: 40, y: 3 },
          friction: {
            ground: 1,
            wallInvertRotation: false,
            wallInvertSprite: false,
            air: 1,
          },
          vel: { x: 1, y: -0.5 },
          srcImage: 'sword',
          bounceY: 0,
          bounceX: 0,
          gravity: false,
          bouncePlatforms: false,
          damage: 20,
          hitback: { x: 0.2, y: 0 },
          scale: 0.9,
          mass: 0.5,
          allowVelocityY: false,
          rotation: {
            initial: 0,
            speed: 0,
          },
        },
        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
    {
      playerId: 2,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      shotGlass: null,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      circleOffset: 0,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Pikachu',
        initializeCharPosition: {
          // lookingRight: true,
          x: 110,
          y: 100,
        },
        color: {
          primary: '#ffc90e',
          secondary: '#e24800',
          dark: '#1c0900',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_2_cropped.png',
        scale: 1,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 1, 0],
        jumpPower: 1,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 1,
        fast: 1,
        friction_ground: 0.5,
        friction_air: 0.04,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 20, y: 0 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'fist-gray',
          mass: 10,
          scale: 0.1,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: -20, y: -25 },
          friction: {
            ground: 0.9,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.9,
          },
          vel: { x: 1, y: -4 },
          srcImage: 'bottle',
          bounceY: 0.7,
          bounceX: 0.7,
          gravity: true,
          bouncePlatforms: true,
          damage: 25,
          hitback: { x: 0.1, y: -0.3 },
          scale: 1,
          mass: 2,
          allowVelocityY: true,
          rotation: {
            initial: (Math.PI * 3) / 4,
            speed: 500,
          },
        },

        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
    {
      playerId: 3,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      killCount: 0,
      shotGlass: null,
      deathCount: 0,
      shotCount: 0,
      circleOffset: 0,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Kirby',
        initializeCharPosition: {
          // lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: '#ff88ae',
          secondary: '#e24800',
          dark: '#1c0900',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_3_cropped.png',
        scale: 1,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0],
        jumpPower: 1,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 0.9,
        fast: 1,
        friction_ground: 0.5,
        friction_air: 0.04,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 15, y: 0 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'fist-gray',
          mass: 10,
          scale: 0.1,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: 15, y: -30 },
          friction: {
            ground: 1,
            wallInvertRotation: false,
            wallInvertSprite: false,
            air: 1,
          },
          vel: { x: 1, y: -1 },
          srcImage: 'greenshell',
          bounceY: 0.1,
          bounceX: 1,
          gravity: true,
          bouncePlatforms: true,
          damage: 10,
          hitback: { x: 0.1, y: 0.2 },
          scale: 1.3,
          mass: 50,
          allowVelocityY: true,
          rotation: {
            initial: 0,
            speed: 0,
          },
        },
        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
    {
      playerId: 4,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      killCount: 0,
      shotGlass: null,
      deathCount: 0,
      shotCount: 0,
      circleOffset: -20,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Chez',
        initializeCharPosition: {
          // lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: '#5588ff',
          secondary: '#5548bb',
          dark: '#1c0900',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_4_cropped.png',
        scale: 0.1,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 1, 1, 0],
        jumpPower: 1,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 0.9,
        fast: 1,
        friction_ground: 0.5,
        friction_air: 0.04,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 25, y: 0 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'fist-gray',
          mass: 10,
          scale: 0.2,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: 35, y: -50 },
          friction: {
            ground: 0.7,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.8,
          },
          vel: { x: 1, y: -3 },
          srcImage: 'hammer',
          bounceY: 0.3,
          bounceX: 0.5,
          gravity: true,
          bouncePlatforms: true,
          damage: 25,
          hitback: { x: 0.1, y: -0.3 },
          scale: 1,
          mass: 2,
          allowVelocityY: true,
          rotation: {
            initial: 0,
            speed: 500,
          },
        },
        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
    {
      playerId: 5,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      killCount: 0,
      shotGlass: null,
      deathCount: 0,
      shotCount: 0,
      circleOffset: -70,
      scoreBoardUpper: '',
      scoreBoardLower: '',
      scoreBoardReady: 'READY',
      scoreBoardController: 'X',
      state: { name: 'player-state-start', gameStamp: 0, timeStamp: 0 },
      char: {
        name: 'Black-Chez',
        initializeCharPosition: {
          // lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: '#333333',
          secondary: '#777777',
          dark: '#333333',
          light: '#ffffff',
        },
        colorFilter: false,
        src: 'images/character_5_cropped.png',
        scale: 0.2,
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        jumpPower: 1,
        jumpIndex: 0,
        upB: { canUse: false, x: 0.5, y: -1 },
        damage: 0,
        speed: 0.9,
        fast: 1,
        friction_ground: 0.5,
        friction_air: 0.04,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackPhysical: {
          sprite: null,
          state: {
            name: 'attackphysical-state-off',
            gameStamp: 0,
            timeStamp: 0,
          },
          durationAttack: 200,
          durationCooldown: 300,
          posFromCenter: { x: 55, y: 0 },
          damage: 50,
          hitback: { x: 0.2, y: 0 },
          srcImage: 'fist-black',
          mass: 10,
          scale: 0.33,
          audio: null,
        },
        attackEnergy: {
          sprite: null,
          state: 'released',
          timestampThrow: 0,
          durationCooldown: 1000,
          posFromCenter: { x: 70, y: -70 },
          friction: {
            ground: 0.7,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.8,
          },
          vel: { x: 1, y: -3 },
          srcImage: 'blackHammer',
          bounceY: 0.3,
          bounceX: 0.5,
          gravity: false,
          bouncePlatforms: true,
          damage: 25,
          hitback: { x: 0.1, y: -0.3 },
          scale: 2,
          mass: 1000,
          allowVelocityY: false,
          rotation: {
            initial: 0,
            speed: 100,
          },
        },
        shield: null,
      },
      inputType: null,
      keyboard: null,
      gamepad: null,
      padCurr: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        R: false,
        L: false,
      },
      padDebounced: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        A: 0,
        B: 0,
        X: 0,
        Y: 0,
        L: 0,
        R: 0,
      },
      playerReadySound: null,
    },
  ];

  constructor() {
    super('game');
  }

  preload() {
    preload(this);
  }
  create() {
    create(this);
  }

  update(time: number, delta: number) {
    update(this, time, delta);
  }
}
