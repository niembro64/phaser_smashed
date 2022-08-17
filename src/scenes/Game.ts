import "phaser";
import { create } from "./create";
import { update } from "./update";
import { Camera, Player } from "./interfaces";

export default class Game extends Phaser.Scene {
  timer: any;
  title: any;
  subTitle: any;
  superTitle: any;
  allPlayersWallTouchIterator: number = 0;
  DEAD_TIME: number = 1000;
  RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
  DEFAULT_SPEED_X: number = 50;
  DEFAULT_SPEED_Y: number = 15;
  DEFAULT_JUMP: number = 1800;
  INITIAL = { POSITION: { PLAYER_Y: 10 } };
  SCREEN_DIMENSIONS = { HEIGHT: 1080, WIDTH: 1920 };
  GRAVITY: number = 0.1;
  platforms: any | Phaser.GameObjects.Sprite;
  background: any | Phaser.GameObjects.Sprite;
  table: any | Phaser.GameObjects.Sprite;
  playerZoomKeeper: number = 1;

  zoomRatioSlow = 0.995;
  zoomRatioFast = 0.9;
  // BORDER_PADDING_X: number = 0;
  // BORDER_PADDING_Y: number = 0;
  BORDER_PADDING_X: number = 200;
  BORDER_PADDING_Y: number = 100;
  CAMERA_OFFSET_Y: number = -100;
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
      zoom: 1,
    },
  };
  cameraCenter: Camera = {
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 1,
    },
  };
  cameraBox: Camera = {
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 1,
    },
  };
  // playersOrder: number[] = [0, 1, 2, 3];
  // playersOrder: number[] = [1, 2, 3, 0];
  // playersOrder: number[] = [2, 3, 0, 1];
  playersOrder: number[] = [3, 0, 1, 2];
  playerLocations: number[] = [-800, -400, 400, 800];
  // playerLocations: number[] = [-200, -110, 110, 200];
  players: Player[] = [
    {
      index: 0,
      text: "",
      state: "start",
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
        attack: {
          sprite: null,
          damage: 10,
          width: 30,
          height: 30,
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
      index: 1,
      text: "",
      state: "start",
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
        src: "images/character_1_cropped.png",
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        // acc: { x: 0, y: 0 },
        jumps: [1, 0.8, 0],
        jumpPower: 0.8,
        jumpIndex: 0,
        damage: 0,
        speed: 0.7,
        fast: 1,
        friction_ground: 0.94,
        friction_air: 0.97,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attack: {
          sprite: null,
          damage: 10,
          width: 30,
          height: 30,
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
      index: 2,
      text: "",
      state: "start",
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
        attack: {
          sprite: null,
          damage: 10,
          width: 30,
          height: 30,
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
      index: 3,
      text: "",
      state: "start",
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
        src: "images/character_3_cropped.png",
        sprite: null,
        zoom: 1,
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0],
        jumpPower: 0.9,
        jumpIndex: 0,
        damage: 0,
        speed: 0.9,
        fast: 1,
        friction_ground: 0.95,
        friction_air: 0.96,
        wallTouchArray: [],
        lastDirectionTouched: null,
        attack: {
          sprite: null,
          damage: 10,
          width: 30,
          height: 30,
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
  // style = {
  //   "background-color": "lime",
  //   position: "absolute",
  //   top: "0%",
  //   left: "50%",
  //   width: "200px",
  //   height: "100px",
  //   font: "48px Arial",
  //   "font-weight": "bold",
  //   display: "flex",
  // };

  // element: any;
  scoreBoard: any;

  preload() {
    // this.load.bitmapFont(
    //   "ice",
    //   "assets/fonts/bitmap/iceicebaby.png",
    //   "assets/fonts/bitmap/iceicebaby.xml"
    // );

    // this.load.plugin(
    //   "rexdynamictextplugin",
    //   "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdynamictextplugin.min.js",
    //   true
    // );

    this.load.image("laser", "images/laser.png");

    this.load.image("table", "images/table.png");
    this.load.image("background", "images/darkxp.jpg");
    this.load.image("centerWhite", "images/wx.png");
    this.load.image("centerBlack", "images/bx.png");
    this.load.image("centerMagenta", "images/mx.png");
    this.load.image("centerRed", "images/rx.png");
    this.load.image("platformHorizontal", "images/platformHorizontal.png");
    this.load.image("platformShort", "images/platformShort.bmp");
    this.load.image("platformShorter", "images/platformShorter.bmp");
    this.load.image("platformVertical", "images/platformVertical.png");
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
