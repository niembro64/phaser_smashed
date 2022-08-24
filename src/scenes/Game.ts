import "phaser";
import { create } from "./create";
import { update } from "./update";
import { Camera, Circle, Clock, Debug, Player, State } from "./interfaces";

export default class Game extends Phaser.Scene {
  // PLAYER_CHOICES: number[] = [0, 1, 2, 3];
  PLAYER_CHOICES: number[] = [0, 1, 2, 3];
  debug: Debug = {
    level: 3,
    useCameras: true,
    seeCameras: false,
    setCollidePlayerPlayers: false,
    setCollidePlayerEnergyAttacks: false,
    energyAttackWrapScreen: false,
    seeCircles: true,
    playStartupSound: false,
  };

  HURT_FLICKER_SPEED: number = 100;
  START_DELAY_DURATION: number = 2000;
  HURT_DURATION: number = 1000;
  DEAD_DURATION: number = 2000;
  playerSpawnOrder: number[] = [0, 1, 2, 3];
  // playerSpawnOrder: number[] = [1, 2, 3, 0];
  // playerSpawnOrder: number[] = [2, 3, 0, 1];
  // playerSpawnOrder: number[] = [3, 0, 1, 2];

  textLocationLROffset: number = 120;
  textLocations: number[] = [-760, -440, 440, 760];
  // playerSpawnLocations: number[] = [-800, -400, 400, 800];
  playerSpawnLocations: number[] = [-200, -110, 110, 200];

  FILE_SOUNDS: any = {
    INTRO: "deep.mp3",
    GUN: "gun.mp3",
    HIT: "kick-rubber-tube-82839.mp3",
    JUMP: "mxl993_yarstick_swoosh_6-88322.mp3",
    JUMP_POWER: "quick-swhooshing-noise-80898.mp3",
    FIRST_BLOOD: "first_blood_echo-92250.mp3",
    SQUISH: "goresplat-7088.mp3",
    DIE: "sword-hits-the-body-48273.mp3",
    START: "start.mp3",
    MII: "mii.mp3",
  };

  SOUND_INTRO: any;
  SOUND_GUN: any;
  SOUND_HIT: any;
  SOUND_JUMP: any;
  SOUND_JUMP_POWER: any;
  SOUND_FIRST_BLOOD: any;
  SOUND_SQUISH: any;
  SOUND_DIE: any;
  SOUND_START: any;
  SOUND_MII: any;

  scoreBoardTime: any;
  time: any;
  NanosecondsTime: number = 0;
  millisecondsTime: number = 0;
  secondsTime: number = 0;
  secondsTimePrev: number = 0;
  secondsTimeClock: number = 0;
  clockTime: Clock = { minutes: 0, seconds: 0 };
  timer: any;
  TITLE: any;
  SUBTITLE: any;
  SUPERTITLE: any;
  allPlayersWallTouchIterator: number = 0;
  // RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
  RATIO_ACCELERATION_VELOCITY = 0.7;
  DEFAULT_SPEED_X: number = 700;
  DEFAULT_SPEED_Y: number = 30;
  DEFAULT_JUMP: number = -1000;
  DEFAULT_UPB: number = -1000;
  DEFAULT_WALL_JUMP: number = -1 * this.DEFAULT_JUMP * 2;
  INITIAL = { POSITION: { PLAYER_Y: 250 } };
  DEBOUNCE_NUMBER: number = 9;
  SCREEN_DIMENSIONS = { WIDTH: 1920, HEIGHT: 1080 };
  // SCREEN_DIMENSIONS = { WIDTH: 3840, HEIGHT: 2160 };
  SCREEN_SCALE = {
    WIDTH: this.SCREEN_DIMENSIONS.WIDTH / 1920,
    HEIGHT: this.SCREEN_DIMENSIONS.HEIGHT / 1080,
  };
  // SCREEN_DIMENSIONS = { HEIGHT: 1080, WIDTH: 1920 };
  GRAVITY: number = 0.1;
  PLATFORMS: any | Phaser.GameObjects.Sprite;
  BACKGROUND: any | Phaser.GameObjects.Sprite;
  TABLE: any | Phaser.GameObjects.Sprite;
  cameraMoverZoomStatusKeeper: number = 1;

  HITBACK_X: number = 120;
  HITBACK_Y: number = 90;

  ATTACK_ENERGY_SPEED_X: number = 600;
  ATTACK_ENERGY_SPEED_Y: number = 600;

  ZOOM_MULTIPLIER_X = 0.95;
  ZOOM_MULTIPLIER_Y = 0.7;
  ZOOM_RATIO_SLOW = 0.995;
  ZOOM_RATIO_FAST = 0.9;
  // BORDER_PADDING_X: number = 0;
  // BORDER_PADDING_Y: number = 0;
  BORDER_PADDING_X: number = 200;
  BORDER_PADDING_Y: number = 100;
  CAMERA_OFFSET_Y: number = -50;
  // CAMERA_OFFSET_Y: number = 0;

  circleOffset: number = 50;
  circles: Circle[] = [
    { graphic: null, colorNumber: 0xe24800, colorString: "#e24800" },
    { graphic: null, colorNumber: 0x43a528, colorString: "#43a528" },
    { graphic: null, colorNumber: 0xffc90e, colorString: "#ffc90e" },
    { graphic: null, colorNumber: 0x8e98ff, colorString: "#8e98ff" },
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
  currentlyOverlappingSpritesMatrix: boolean[][] = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];
  numberHitByMatrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  numberKilledByMatrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  wasLastHitByMatrix: boolean[][] = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];
  numberShotsTakenByMatrix: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  gameState: State = {
    name: "start",
    timestamp: 0,
  };

  players: Player[] = [];
  playerOptions: Player[] = [
    {
      playerNumber: 0,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKillsShots: "",
      state: { name: "start", timestamp: 0 },
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
      },
      keyboard: null,
      pad: null,
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
    },
    {
      playerNumber: 1,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKillsShots: "",
      state: { name: "start", timestamp: 0 },
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
      },
      keyboard: null,
      pad: null,
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
    },
    {
      playerNumber: 2,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKillsShots: "",
      state: { name: "start", timestamp: 0 },
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
          posFromCenter: { x: 0, y: -20 },
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
      },
      keyboard: null,
      pad: null,
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
    },
    {
      playerNumber: 3,
      killCount: 0,
      deathCount: 0,
      shotCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKillsShots: "",
      state: { name: "start", timestamp: 0 },
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
          posFromCenter: { x: 10, y: -25 },
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
      },
      keyboard: null,
      pad: null,
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
    },
  ];

  constructor() {
    super("game");
    // this.laserGroup;
  }

  preload() {
    let path = "sounds/";
    this.load.audio("intro", path + this.FILE_SOUNDS.INTRO);
    this.load.audio("gun", path + this.FILE_SOUNDS.GUN);
    this.load.audio("hit", path + this.FILE_SOUNDS.HIT);
    this.load.audio("jump", path + this.FILE_SOUNDS.JUMP);
    this.load.audio("jumpPower", path + this.FILE_SOUNDS.JUMP_POWER);
    this.load.audio("firstBlood", path + this.FILE_SOUNDS.FIRST_BLOOD);
    this.load.audio("squish", path + this.FILE_SOUNDS.SQUISH);
    this.load.audio("die", path + this.FILE_SOUNDS.DIE);
    this.load.audio("start", path + this.FILE_SOUNDS.START);
    this.load.audio("mii", path + this.FILE_SOUNDS.MII);

    this.load.image("laser", "images/laser.png");
    this.load.image("blockcracked", "images/blockcracked.png");
    this.load.image("fireball", "images/fireball.png");
    this.load.image("flagpole", "images/flagpole.png");
    this.load.image("greenshell", "images/greenshell.png");
    this.load.image("hammer", "images/ham.png");
    this.load.image("sword", "images/sword_right.png");

    this.load.image("table", "images/table.png");
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

    for (let i = 0; i < this.PLAYER_CHOICES.length; i++) {
      this.players.push(
        JSON.parse(JSON.stringify(this.playerOptions[this.PLAYER_CHOICES[i]]))
      );
    }

    console.log("PLAYERS CURRENT", this.players);

    this.players.forEach((player, playerIndex) => {
      this.load.image(player.char.name, player.char.src);
      player.pad = Phaser.Input.Gamepad.Gamepad;
    });
  }
  create() {
    create(this);
  }

  update() {
    update(this);
  }
}
