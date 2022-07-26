import "phaser";
import { create } from "./create";
import { update } from "./update";
import {
  Camera,
  ColorCircle,
  Clock,
  Debug,
  Player,
  Splash as SplashRules,
  SplashMulti as SplashEndData,
  GameStateWithTime,
} from "./interfaces";
import Play from "../views/Play";

export default class Game extends Phaser.Scene {
  connectionFunction(): void {
    console.log("PHASER CONNECTED");
  }

  parentContext: any = Play;
  // setGameState(game: Game, state: GameState): void {
  //   game.gameState.name = state;
  //   game.gameState.gameStamp = game.gameNanoseconds;
  //   game.gameState.timeStamp = game.timeNanoseconds;
  //   console.log("GAME STATE", game.gameState.name);
  // }

  PLAYER_CHOICES: number[] = [0, 1, 2, 3];
  // PLAYER_CHOICES: number[] = [3, 0];
  // PLAYER_CHOICES: number[] = [3];

  // PLAYER_CHOICES: number[] = [4, 4, 4, 5];

  // PLAYER_CHOICES: number[] = [0, 0, 0, 0];
  // PLAYER_CHOICES: number[] = [1, 1, 1, 1];
  // PLAYER_CHOICES: number[] = [2, 2, 2, 2];
  // PLAYER_CHOICES: number[] = [3, 3, 3, 3];
  // PLAYER_CHOICES: number[] = [4, 4, 4, 4];
  // PLAYER_CHOICES: number[] = [5, 5, 5, 5];

  debug: Debug = {
    level: 4,
    useCameras: true,
    seeCameras: false,
    setCollidePlayerPlayers: false,
    setCollidePlayerEnergyAttacks: false,
    energyAttackWrapScreen: false,
    seePlayerCircles: true,
    playShotsWiiBGM: true,
    wallJumps: true,
    useBGM: true,
    BGMNumber: 2,
    useDefaultAttackDamage: false,
    useDefaultAttackHitback: false,
    useColorFilters: false,
    useReadySound: false,
    invertHealth: false,
    seeSplashDataAlways: false,
    numUpdateLoopsToSkip: 0,
  };

  DEFAULT_PLAYER_HITBACK: any = { x: 0.03, y: -0.03 };
  DEFAULT_ATTACK_HITBACK: any = { x: 0.1, y: -0.1 };
  DEFAULT_ATTACK_DAMAGE: number = 50;

  GAMEBAR_CHARS = { kills: " ⇧💀⇩ ", deaths: "", damage: "♡", shots: "☆" };
  //▲▼⬆⬇↑↓↑↿⇂⋆ // //🍻 //★//✰//☆//⚡//❤//v//♡//♥💔
  // 💔⭐💀
  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥💀
  //🏴‍☠️🏳️🏁🏴
  // 🔴🔵🟡🟢🟣🟠⚫⚪🟤

  // DURATION_GAME_LAST_MINUTES: number = 0.02;
  // DURATION_GAME_LAST_MINUTES: number = 0.3;
  DURATION_GAME_LAST_MINUTES: number = 3;
  // DURATION_GAME_LAST_MINUTES: number = 7;
  DURATION_GAME_START: number = 1200;
  DURATION_GAME_PAUSE_MUSIC_SHORT: number = 2000;
  DURATION_GAME_PAUSE_MUSIC_LONG: number = 10000;
  DURATION_GAME_SHOT: number = 4000;
  DURATION_PLAYER_HURT: number = 1000;
  DURATION_PLAYER_DEAD: number = 5000;
  DURATION_PLAYER_FILTER: number = 100;

  playerSpawnOrder: number[] = [0, 1, 2, 3];
  // playerSpawnOrder: number[] = [1, 2, 3, 0];
  // playerSpawnOrder: number[] = [2, 3, 0, 1];
  // playerSpawnOrder: number[] = [3, 0, 1, 2];

  readyLocationLROffset: number = 0;
  glassLocationLROffset: number = 0;
  upperTextLocationLROffset: number = 0;
  lowerTextLocationLROffset: number = 0;
  textLocations: number[] = [-700, -350, 350, 700];
  playerSpawnLocations: number[] = [-165, -100, 100, 165];

  FILE_SOUNDS: any = {
    INTRO: "deep.mp3",
    GUN: "throw.wav",
    HIT: "punch.wav",
    JUMP: "mxl993_yarstick_swoosh_6-88322.mp3",
    JUMP_POWER: "quick-swhooshing-noise-80898.mp3",
    FIRST_BLOOD: "first_blood_echo-92250.mp3",
    SQUISH: "goresplat-7088.mp3",
    DIE: "sword-hits-the-body-48273.mp3",
    START_LIQUID: "game-start-liquid.wav",
    START: "start.wav",
    READY: "ready.wav",
    READY_REPEAT: "ready_repeat.wav",
    READY_REPEAT0: "ready_0.wav",
    READY_REPEAT1: "ready_1.wav",
    READY_REPEAT2: "ready_2.wav",
    READY_REPEAT3: "ready_3.wav",
    ENERJA_AH: "/enerja/ah.mp3",
    ENERJA_DO_AGAIN: "/enerja/do_it_again_yeah.mp3",
    ENERJA_FINISH: "/enerja/finishit.mp3",
    ENERJA_GYA: "/enerja/gya.mp3",
    ENERJA_THAT_SHIT: "/enerja/more_than_that_shit_happen.mp3",
    ENERJA_SMASHED: "/enerja/smashed_yes_you_are_ahhhhh.mp3",
    ENERJA_TURTLE: "/enerja/turtle.mp3",
    ENERJA_TWO_SHOTS: "/enerja/two_shots.mp3",
    ENERJA_UGH: "/enerja/ugh.mp3",
    BGM_MII: "wii_short.wav",
    BGM_DREAM: "kirbyloop.wav",
    BGM_MONKEY: "/na/monkeys2022.wav",
    BGM_ROYKSOP: "/na/royksop_macumba_05loop.wav",
  };

  SOUND_INTRO: any;
  SOUND_GUN: any;
  SOUND_HIT: any;
  SOUND_JUMP: any;
  SOUND_JUMP_POWER: any;
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

  brickWidth: number = 33;
  brickHeight: number = 34;

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
  gameSecondsClock: number = this.DURATION_GAME_LAST_MINUTES * 60;
  gameClock: Clock = { minutes: 0, seconds: 0 };
  timer: any;
  TITLE: any;
  SUBTITLE: any;
  SUPERTITLE: any;

  numDead: number = 0;
  numDeadPrev: number = 0;
  allPlayersWallTouchIterator: number = 0;
  RATIO_ACCELERATION_VELOCITY = 0.7;
  DEFAULT_SPEED_X: number = 700;
  DEFAULT_SPEED_Y: number = 30;
  DEFAULT_JUMP: number = -1000;
  DEFAULT_UPB: number = -1000;
  DEFAULT_WALL_JUMP: number = -1 * this.DEFAULT_JUMP * 2;
  INITIAL = { POSITION: { PLAYER_Y: 250 } };
  DEBOUNCE_NUMBER: number = 9;
  SCREEN_DIMENSIONS = { WIDTH: 1920, HEIGHT: 1080 };
  SCREEN_SCALE = {
    WIDTH: this.SCREEN_DIMENSIONS.WIDTH / 1920,
    HEIGHT: this.SCREEN_DIMENSIONS.HEIGHT / 1080,
  };
  GRAVITY: number = 0.1;
  PLATFORMS: any | Phaser.GameObjects.Sprite;
  BACKGROUND: any | Phaser.GameObjects.Sprite;
  TABLE: any | Phaser.GameObjects.Sprite;
  FLAG: any | Phaser.GameObjects.Sprite;
  cameraMoverZoomStatusKeeper: number = 1;

  HITBACK_X: number = 120;
  HITBACK_Y: number = 90;

  ATTACK_ENERGY_SPEED_X: number = 600;
  ATTACK_ENERGY_SPEED_Y: number = 600;

  ZOOM_MULTIPLIER_X = 0.95;
  ZOOM_MULTIPLIER_Y = 0.7;
  ZOOM_RATIO_SLOW = 0.995;
  ZOOM_RATIO_FAST = 0.9;
  BORDER_PADDING_X: number = 200;
  BORDER_PADDING_Y: number = 100;
  CAMERA_OFFSET_Y: number = -50;

  circleOffset: number = -50;
  // circles: Circle[] = [
  //   { graphic: null, colorNumber: 0xdd5555, colorString: "#dd5555" },
  //   { graphic: null, colorNumber: 0x5599ff, colorString: "#5599ff" },
  //   { graphic: null, colorNumber: 0xddcc22, colorString: "#ddcc22" },
  //   { graphic: null, colorNumber: 0x33ee33, colorString: "#33ee33" },
  // ];
  colorCircles: ColorCircle[] = [
    {
      text: "🔴",
      graphic: null,
      colorNumber: 0xe81224,
      colorString: "#e81224",
    },
    {
      text: "🔵",
      graphic: null,
      colorNumber: 0x0078d7,
      colorString: "#0078d7",
    },
    {
      text: "🟡",
      graphic: null,
      colorNumber: 0xfff100,
      colorString: "#fff100",
    },
    {
      text: "🟢",
      graphic: null,
      colorNumber: 0x16c60c,
      colorString: "#16c60c",
    },
    {
      text: "🟣",
      graphic: null,
      colorNumber: 0x886ce4,
      colorString: "#886ce4",
    },
    {
      text: "🟠",
      graphic: null,
      colorNumber: 0xf7630c,
      colorString: "#f7630c",
    },
    {
      text: "⚫",
      graphic: null,
      colorNumber: 0x383838,
      colorString: "#383838",
    },
    {
      text: "⚪",
      graphic: null,
      colorNumber: 0xf2f2f2,
      colorString: "#f2f2f2",
    },
    {
      text: "🟤",
      graphic: null,
      colorNumber: 0x8e562e,
      colorString: "#8e562e",
    },
  ];
  FONT_DEFAULT_NICE: string = "Impact";
  // FONT_DEFAULT_MONOSPACE: string = "Press Start 2P";f
  FONT_DEFAULT_MONOSPACE: string = "Consolas";
  // FONT_DEFAULT: string = 'Courier';

  splashRulesOffset: number = 50;
  splashRules: SplashRules[] = [
    {
      text: null,
      name: "splash-black",
      word: "BLACK",
      color: "#000000",
      backgroundColor: "#000000ff",
      size: "300px",
      src: "glass.png",
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
    {
      text: null,
      name: "splash-start",
      word: "START",
      color: "#AAAAAA",
      backgroundColor: "#00000000",
      size: "370px",
      src: "glass.png",
      strokeThickness: 10,
    },
    {
      text: null,
      name: "splash-paused",
      word: "PAUSED",
      color: "#005500",
      backgroundColor: "#00AA00",
      size: "570px",
      src: "glass.png",
      strokeThickness: 10,
    },
    {
      text: null,
      name: "splash-first-blood",
      word: "FIRST BLOOD",
      color: "#440000",
      backgroundColor: "#FF0000",
      size: "370px",
      src: "glass.png",
      strokeThickness: 10,
    },
    {
      text: null,
      name: "splash-screen-clear",
      word: "SCREEN CLEAR",
      color: "#330033",
      backgroundColor: "#bb44bb",
      size: "330px",
      src: "glass.png",
      strokeThickness: 10,
    },
    {
      text: null,
      name: "splash-cool-down",
      word: "COOLDOWN PERIOD",
      color: "#ffffff",
      backgroundColor: "#00000000",
      size: "200px",
      src: "glass.png",
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
    {
      text: null,
      name: "splash-finished",
      word: "FINISHED",
      color: "#ffffff",
      backgroundColor: "#000000ff",
      size: "500px",
      src: "glass.png",
      strokeThickness: this.SCREEN_DIMENSIONS.WIDTH,
    },
  ];

  splashEndDataOffset: number = -1100;
  SplashEndDataInit: SplashEndData = {
    textTitle: "",
    textCircles: "",
    textData: "",
    name: "",
    emoji: "",
    words: [],
    vertical: 0,
    size: "30px",
    src: "glass.png",
    color: "#ffffff",
    backgroundColor: "#000000",
    strokeThickness: 5,
    offsetY: 0,
    blur: 5,
  };
  splashesEndData: SplashEndData[] = [
    {
      textTitle: null,
      textCircles: null,
      textData: null,
      name: "Hits",
      emoji: "💔",
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
      name: "Deaths",
      emoji: "💀",
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
      name: "Shots",
      emoji: "⭐",
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
      name: "Characters",
      emoji: "",
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
      name: "center_10",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
    },
  };
  cameraMover: Camera = {
    char: {
      name: "center_10",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
    },
  };
  cameraPlayersHalfway: Camera = {
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
    },
  };
  cameraCenter: Camera = {
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
    },
  };
  cameraBox: Camera = {
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
    },
  };

  // i : player
  // j : attacks from other players
  currentlyOverlappingSpritesMatrix: boolean[][] = [];
  wasLastHitByMatrix: boolean[][] = [];
  numberHitByMatrix: number[][] = [];
  numberKilledByMatrix: number[][] = [];
  numberShotsTakenByMeMatrix: number[][] = [];

  gameState: GameStateWithTime = {
    name: "game-state-start",
    gameStamp: 0,
    timeStamp: 0,
  };
  // playerState: PlayerStateWithTime = {
  //   name: "player-state-start",
  //   gameStamp: 0,
  //   timeStamp: 0,
  // };

  players: Player[] = [];
  playerOptions: Player[] = [
    {
      playerNumber: 0,
      emitterLight: null,
      emitterDark: null,
      emitterPlayer: null,
      emitterHurt: null,
      particles: null,
      shotGlass: null,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      circleOffset: 0,
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        fast: Phaser.Input.Keyboard.KeyCodes.Z,
        jump: Phaser.Input.Keyboard.KeyCodes.X,
      },
      char: {
        name: "Mario",
        initializeCharPosition: {
          lookingRight: true,
          x: -200,
          y: 100,
        },
        color: {
          primary: "#e24800",
          secondary: "#e24800",
          dark: "#1c0900",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_0_cropped.png",
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
        friction_ground: 0.8,
        // friction_ground: 0.94,
        friction_air: 0.98,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: 20, y: -30 },
          friction: {
            ground: 1,
            wallInvertRotation: true,
            wallInvertSprite: true,
            air: 1,
          },
          vel: { x: 1, y: 1 },
          srcImage: "fireball",
          bounceY: 1,
          bounceX: 1,
          gravity: true,
          walls: true,
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
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
    {
      playerNumber: 1,
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
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.T,
        down: Phaser.Input.Keyboard.KeyCodes.G,
        left: Phaser.Input.Keyboard.KeyCodes.F,
        right: Phaser.Input.Keyboard.KeyCodes.H,
        fast: Phaser.Input.Keyboard.KeyCodes.V,
        jump: Phaser.Input.Keyboard.KeyCodes.B,
      },
      char: {
        name: "Link",
        initializeCharPosition: {
          lookingRight: false,
          x: -110,
          y: 100,
        },
        color: {
          primary: "#43a528",
          secondary: "#e24800",
          dark: "#1c0900",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_1_cropped.png",
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
        friction_ground: 0.8,
        friction_air: 0.97,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: 50, y: 3 },
          friction: {
            ground: 1,
            wallInvertRotation: false,
            wallInvertSprite: false,
            air: 1,
          },
          vel: { x: 1, y: -0.5 },
          srcImage: "sword",
          bounceY: 0,
          bounceX: 0,
          gravity: false,
          walls: false,
          damage: 20,
          hitback: { x: 0.2, y: 0 },
          scale: 1,
          mass: 0.5,
          allowVelocityY: false,
          rotation: {
            initial: 0,
            speed: 0,
          },
        },
        shield: null,
      },
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
    {
      playerNumber: 2,
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
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.I,
        down: Phaser.Input.Keyboard.KeyCodes.K,
        left: Phaser.Input.Keyboard.KeyCodes.J,
        right: Phaser.Input.Keyboard.KeyCodes.L,
        fast: Phaser.Input.Keyboard.KeyCodes.O,
        jump: Phaser.Input.Keyboard.KeyCodes.P,
      },
      char: {
        name: "Pikachu",
        initializeCharPosition: {
          lookingRight: true,
          x: 110,
          y: 100,
        },
        color: {
          primary: "#ffc90e",
          secondary: "#e24800",
          dark: "#1c0900",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_2_cropped.png",
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
        friction_ground: 0.8,
        friction_air: 0.98,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: -20, y: -25 },
          friction: {
            ground: 0.9,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.9,
          },
          vel: { x: 1, y: -4 },
          srcImage: "bottle",
          bounceY: 0.7,
          bounceX: 0.7,
          gravity: true,
          walls: true,
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
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
    {
      playerNumber: 3,
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
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        fast: Phaser.Input.Keyboard.KeyCodes.END,
        jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
      },
      char: {
        name: "Kirby",
        initializeCharPosition: {
          lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: "#ff88ae",
          secondary: "#e24800",
          dark: "#1c0900",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_3_cropped.png",
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
        friction_ground: 0.8,
        friction_air: 0.96,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: 15, y: -30 },
          friction: {
            ground: 1,
            wallInvertRotation: false,
            wallInvertSprite: false,
            air: 1,
          },
          vel: { x: 1, y: -1 },
          srcImage: "greenshell",
          bounceY: 0.1,
          bounceX: 1,
          gravity: true,
          walls: true,
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
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
    {
      playerNumber: 4,
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
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        fast: Phaser.Input.Keyboard.KeyCodes.END,
        jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
      },
      char: {
        name: "Chez",
        initializeCharPosition: {
          lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: "#5588ff",
          secondary: "#5548bb",
          dark: "#1c0900",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_4_cropped.png",
        scale: 0.1,
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
        friction_ground: 0.8,
        friction_air: 0.96,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: 35, y: -50 },
          friction: {
            ground: 0.7,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.8,
          },
          vel: { x: 1, y: -3 },
          srcImage: "hammer",
          bounceY: 0.3,
          bounceX: 0.5,
          gravity: true,
          walls: true,
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
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
    {
      playerNumber: 5,
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
      scoreBoardUpper: "",
      scoreBoardLower: "",
      scoreBoardReady: "READY",
      scoreBoardController: "X",
      state: { name: "player-state-start", gameStamp: 0, timeStamp: 0 },
      keyboard_static: {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        fast: Phaser.Input.Keyboard.KeyCodes.END,
        jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
      },
      char: {
        name: "BlackChez",
        initializeCharPosition: {
          lookingRight: false,
          x: 200,
          y: 100,
        },
        color: {
          primary: "#333333",
          secondary: "#777777",
          dark: "#333333",
          light: "#ffffff",
        },
        colorFilter: false,
        src: "images/character_5_cropped.png",
        scale: 0.2,
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
        friction_ground: 0.8,
        friction_air: 0.96,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
          state: "released",
          timestampThrow: 0,
          durationBetweenThrows: 1000,
          posFromCenter: { x: 70, y: -70 },
          friction: {
            ground: 0.7,
            wallInvertRotation: true,
            wallInvertSprite: false,
            air: 0.8,
          },
          vel: { x: 1, y: -3 },
          srcImage: "blackHammer",
          bounceY: 0.3,
          bounceX: 0.5,
          gravity: false,
          walls: true,
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
      keyboard: null,
      gamepad: null,
      padPrev: {
        up: false,
        down: false,
        left: false,
        right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
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
      },
      playerReadySound: null,
    },
  ];

  constructor() {
    super("game");
    // this.laserGroup;
  }

  preload() {
    let pathSounds = "sounds/";
    this.load.audio("intro", pathSounds + this.FILE_SOUNDS.INTRO);
    this.load.audio("gun", pathSounds + this.FILE_SOUNDS.GUN);
    this.load.audio("hit", pathSounds + this.FILE_SOUNDS.HIT);
    this.load.audio("jump", pathSounds + this.FILE_SOUNDS.JUMP);
    this.load.audio("jumpPower", pathSounds + this.FILE_SOUNDS.JUMP_POWER);
    this.load.audio("firstBlood", pathSounds + this.FILE_SOUNDS.FIRST_BLOOD);
    this.load.audio("squish", pathSounds + this.FILE_SOUNDS.SQUISH);
    this.load.audio("die", pathSounds + this.FILE_SOUNDS.DIE);
    this.load.audio("startLiquid", pathSounds + this.FILE_SOUNDS.START_LIQUID);
    this.load.audio("start", pathSounds + this.FILE_SOUNDS.START);
    this.load.audio("ready", pathSounds + this.FILE_SOUNDS.READY);
    this.load.audio("readyRepeat", pathSounds + this.FILE_SOUNDS.READY_REPEAT);
    this.load.audio(
      "readyRepeat0",
      pathSounds + this.FILE_SOUNDS.READY_REPEAT0
    );
    this.load.audio(
      "readyRepeat1",
      pathSounds + this.FILE_SOUNDS.READY_REPEAT1
    );
    this.load.audio(
      "readyRepeat2",
      pathSounds + this.FILE_SOUNDS.READY_REPEAT2
    );
    this.load.audio(
      "readyRepeat3",
      pathSounds + this.FILE_SOUNDS.READY_REPEAT3
    );

    this.load.audio("enerja_ah", pathSounds + this.FILE_SOUNDS.ENERJA_AH);
    this.load.audio(
      "enerja_again",
      pathSounds + this.FILE_SOUNDS.ENERJA_DO_AGAIN
    );
    this.load.audio(
      "enerja_finish",
      pathSounds + this.FILE_SOUNDS.ENERJA_FINISH
    );
    this.load.audio("enerja_gya", pathSounds + this.FILE_SOUNDS.ENERJA_GYA);
    this.load.audio(
      "enerja_shit",
      pathSounds + this.FILE_SOUNDS.ENERJA_THAT_SHIT
    );
    this.load.audio(
      "enerja_smashed",
      pathSounds + this.FILE_SOUNDS.ENERJA_SMASHED
    );
    this.load.audio(
      "enerja_turtle",
      pathSounds + this.FILE_SOUNDS.ENERJA_TURTLE
    );
    this.load.audio(
      "enerja_shots",
      pathSounds + this.FILE_SOUNDS.ENERJA_TWO_SHOTS
    );
    this.load.audio("enerja_ugh", pathSounds + this.FILE_SOUNDS.ENERJA_UGH);

    this.load.audio("mii", pathSounds + this.FILE_SOUNDS.BGM_MII);

    if (this.debug.BGMNumber === 0) {
      this.load.audio("bgm", pathSounds + this.FILE_SOUNDS.BGM_DREAM);
    }
    if (this.debug.BGMNumber === 1) {
      this.load.audio("bgm", pathSounds + this.FILE_SOUNDS.BGM_MONKEY);
    }
    if (this.debug.BGMNumber === 2) {
      this.load.audio("bgm", pathSounds + this.FILE_SOUNDS.BGM_ROYKSOP);
    }

    this.load.image("laser", "images/laser.png");
    this.load.image("blockcracked", "images/blockcracked.png");
    this.load.image("fireball", "images/fireball.png");
    this.load.image("flagpole", "images/flagpole.png");
    this.load.image("greenshell", "images/greenshell.png");
    this.load.image("bottle", "images/bottle.png");
    this.load.image("hammer", "images/ham.png");
    this.load.image("blackHammer", "images/blackHammer.png");
    this.load.image("sword", "images/sword_right.png");

    this.load.image("table", "images/table.png");
    this.load.image("flag", "images/flagpole_JK2.png");

    this.load.image("background", "images/darkxp.jpg");
    this.load.image("centerWhite", "images/wx.png");
    this.load.image("centerBlack", "images/bx.png");
    this.load.image("centerMagenta", "images/mx.png");
    this.load.image("centerRed", "images/rx.png");
    this.load.image("platformHorizontal", "images/brickhoriz.bmp");
    this.load.image("platformShort", "images/brickhorizshorter.bmp");
    this.load.image("platformVertical", "images/brickvert.bmp");
    this.load.image("brick", "images/blockcracked.png");
    this.load.image("suburb", "images/suburb.png");

    this.load.image("flag_joey", "images/flagpole_JK2.png");
    this.load.image("glass_full", "images/niemo_shot_full.png");
    this.load.image("glass_empty", "images/niemo_shot_empty.png");

    this.playerOptions.forEach((pOption, pOptionIndex) => {
      this.load.image(pOption.char.name, pOption.char.src);
    });
    for (let i = 0; i < this.PLAYER_CHOICES.length; i++) {
      this.load.image("tail_" + i, "images/white_trans.png");
    }
  }
  create() {
    console.log("Phaser.Core.Config", Phaser.Core.Config);
    console.log("this.game.config", this.game.config);
    // console.log(
    //   "this.game.config.niemoConfigElement",
    //   this.game.config.niemoConfigElement
    // );

    this.parentContext = this.game.registry.get("parentContext");
    // this.parentContext.contextFunctionTexter();

    // for (let i = 0; i < 4; i++) {
    //   this.parentContext.setAdder(this.parentContext.adder++);
    //   console.log(this.parentContext.adder);
    // }

    for (let i = 0; i < this.PLAYER_CHOICES.length; i++) {
      this.players.push(
        JSON.parse(JSON.stringify(this.playerOptions[this.PLAYER_CHOICES[i]]))
      );

      // console.log("this.input.gamepad.total", this.input.gamepad.total);
      if (i < this.input.gamepad.total) {
      }
    }

    console.log("PLAYERS CURRENT", this.players);

    this.players.forEach((player, playerIndex) => {
      player.gamepad = Phaser.Input.Gamepad.Gamepad;
    });
    create(this);
  }

  update(time: number, delta: number) {
    // console.log("this.input.gamepad.total", this.input.gamepad.total);

    update(this, time, delta);
  }
}
