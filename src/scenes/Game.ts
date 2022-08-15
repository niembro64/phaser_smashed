import "phaser";
import { create } from "./create";
import { update } from "./update";
import { CameraHelper, Player } from "./interfaces";

export default class Game extends Phaser.Scene {
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
  BORDER_PADDING_X: number = 0;
  BORDER_PADDING_Y: number = 0;
  // BORDER_PADDING_X: number= 100;
  // BORDER_PADDING_Y: number= 150;
  CAMERA_OFFSET_Y: number = 0;
  // CAMERA_OFFSET_Y: number = -100;

  cameraPlayers: Player = {
    index: 0,
    state: "camera",
    keyboard_static: {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fast: Phaser.Input.Keyboard.KeyCodes.Z,
      jump: Phaser.Input.Keyboard.KeyCodes.X,
    },
    char: {
      name: "center_10",
      src: "images/x.png",
      sprite: null,
      zoom: 0,
      vel: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      // acc: { x: 0, y: 0 },
      jumps: [0],
      jumpPower: 0,
      jumpIndex: 0,
      damage: 0,
      speed: 0,
      fast: 0,
      friction_ground: 0,
      friction_air: 0,
      wallTouchArray: [],
      lastDirectionTouched: null,
    },
    keyboard: undefined,
    pad: undefined,
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
  };
  cameraPlayersHalfway: Player = {
    index: 0,
    state: "camera",
    keyboard_static: {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fast: Phaser.Input.Keyboard.KeyCodes.Z,
      jump: Phaser.Input.Keyboard.KeyCodes.X,
    },
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 1,
      vel: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      // acc: { x: 0, y: 0 },
      jumps: [0],
      jumpPower: 0,
      jumpIndex: 0,
      damage: 0,
      speed: 0,
      fast: 0,
      friction_ground: 0,
      friction_air: 0,
      wallTouchArray: [],
      lastDirectionTouched: null,
    },
    keyboard: undefined,
    pad: undefined,
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
  };
  cameraCenter: Player = {
    index: 0,
    state: "camera",
    keyboard_static: {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fast: Phaser.Input.Keyboard.KeyCodes.Z,
      jump: Phaser.Input.Keyboard.KeyCodes.X,
    },
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 1,
      vel: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      // acc: { x: 0, y: 0 },
      jumps: [0],
      jumpPower: 0,
      jumpIndex: 0,
      damage: 0,
      speed: 0,
      fast: 0,
      friction_ground: 0,
      friction_air: 0,
      wallTouchArray: [],
      lastDirectionTouched: null,
    },
    keyboard: undefined,
    pad: undefined,
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
  };
  cameraBox: Player = {
    index: 0,
    state: "camera",
    keyboard_static: {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fast: Phaser.Input.Keyboard.KeyCodes.Z,
      jump: Phaser.Input.Keyboard.KeyCodes.X,
    },
    char: {
      name: "center_80",
      src: "images/x.png",
      sprite: null,
      zoom: 1,
      vel: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      // acc: { x: 0, y: 0 },
      jumps: [0],
      jumpPower: 0,
      jumpIndex: 0,
      damage: 0,
      speed: 0,
      fast: 0,
      friction_ground: 0,
      friction_air: 0,
      wallTouchArray: [],
      lastDirectionTouched: null,
    },
    keyboard: undefined,
    pad: undefined,
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
  };
  // playersOrder: number[] = [0, 1, 2, 3];
  // playersOrder: number[] = [1, 2, 3, 0];
  playersOrder: number[] = [2, 3, 0, 1];
  // playersOrder: number[] = [3, 0, 1, 2];
  players: Player[] = [
    {
      index: 0,
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
        src: "images/character_0.png",
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
        src: "images/character_1.png",
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
        src: "images/character_2.png",
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
        src: "images/character_3.png",
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
  }

  preload() {
    this.load.image("background", "images/smaller_triforce_background.png");
    this.load.image("center", "images/x.png");
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
