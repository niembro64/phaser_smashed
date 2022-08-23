import "phaser";
import { create } from "./create";
import { update } from "./update";
import { Camera, Clock, Debug, Player } from "./interfaces";

export default class Game extends Phaser.Scene {
  debug: Debug = {
    useCameras: true,
    seeCameras: false,
    setCollidePlayerPlayers: false,
    setCollidePlayerEnergyAttacks: false,
  };

  HURT_FLICKER_SPEED: number = 100;
  START_DELAY_DURATION: number = 2000;
  HURT_DURATION: number = 1000;
  DEAD_DURATION: number = 2000;
  playerSpawnOrder: number[] = [0, 1, 2, 3];
  // playerSpawnOrder: number[] = [1, 2, 3, 0];
  // playerSpawnOrder: number[] = [2, 3, 0, 1];
  // playerSpawnOrder: number[] = [3, 0, 1, 2];

  textLocationLROffset: number = 60;
  textLocations: number[] = [-760, -460, 460, 760];
  // playerSpawnLocations: number[] = [-800, -400, 400, 800];
  playerSpawnLocations: number[] = [-200, -110, 110, 200];

  scoreBoardTime: any;
  time: any;
  NanosecondsTime: number = 0;
  millisecondsTime: number = 0;
  secondsTime: number = 0;
  clockTime: Clock = { minutes: 0, seconds: 0 };
  timer: any;
  TITLE: any;
  SUBTITLE: any;
  SUPERTITLE: any;
  allPlayersWallTouchIterator: number = 0;
  // RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
  DEFAULT_SPEED_X: number = 80;
  DEFAULT_SPEED_Y: number = 30;
  DEFAULT_JUMP: number = -1500;
  INITIAL = { POSITION: { PLAYER_Y: 10 } };
  SCREEN_DIMENSIONS = { HEIGHT: 3840, WIDTH: 2160 };
  // SCREEN_DIMENSIONS = { HEIGHT: 1080, WIDTH: 1920 };
  GRAVITY: number = 0.1;
  PLATFORMS: any | Phaser.GameObjects.Sprite;
  BACKGROUND: any | Phaser.GameObjects.Sprite;
  TABLE: any | Phaser.GameObjects.Sprite;
  cameraMoverZoomStatusKeeper: number = 1;

  HITBACK_X: number = 300;
  HITBACK_Y: number = 300;

  ATTACK_ENERGY_SPEED_X: number = 600;
  ATTACK_ENERGY_SPEED_Y: number = 600;

  ZOOM_RATIO_SLOW = 0.995;
  ZOOM_RATIO_FAST = 0.9;
  // BORDER_PADDING_X: number = 0;
  // BORDER_PADDING_Y: number = 0;
  BORDER_PADDING_X: number = 200;
  BORDER_PADDING_Y: number = 100;
  CAMERA_OFFSET_Y: number = -50;
  // CAMERA_OFFSET_Y: number = 0;

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

  players: Player[] = [
    {
      playerNumber: 0,
      killCount: 0,
      deathCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKills: "",
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
        damage: 0,
        speed: 0.8,
        fast: 1,
        friction_ground: 0.94,
        friction_air: 0.98,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
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
            speed: 1000,
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
    },
    {
      playerNumber: 1,
      killCount: 0,
      deathCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKills: "",
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
        damage: 0,
        speed: 0.7,
        fast: 1,
        friction_ground: 0.94,
        friction_air: 0.97,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
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
    },
    {
      playerNumber: 2,
      killCount: 0,
      deathCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKills: "",
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
        damage: 0,
        speed: 1,
        fast: 1,
        friction_ground: 0.96,
        friction_air: 0.98,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
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
    },
    {
      playerNumber: 3,
      killCount: 0,
      deathCount: 0,
      scoreBoardDamage: "",
      scoreBoardDeathsKills: "",
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
        damage: 0,
        speed: 0.9,
        fast: 1,
        friction_ground: 0.95,
        friction_air: 0.96,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attackEnergy: {
          sprite: null,
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
    },
  ];

  constructor() {
    super("game");
    // this.laserGroup;
  }

  preload() {
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
