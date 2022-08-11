import "phaser";
import { create } from "./create";
import { update } from "./update";
import { Player } from "./interfaces";

export default class Game extends Phaser.Scene {
  DEAD_TIME: number = 1000;
  RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
  DEFAULT_SPEED: number = 400;
  DEFAULT_JUMP: number = 70;
  INITIAL = { POSITION: { PLAYER_Y: 100 } };
  SCREEN_DIMENSIONS = { HEIGHT: 600, WIDTH: 1600 };
  GRAVITY: number = 0.1;
  platforms: any | Phaser.GameObjects.Sprite;
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
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        // acc: { x: 0, y: 0 },
        jumps: [1, 1],
        jumpPower: 0.9,
        jumpIndex: 0,
        damage: 0,
        speed: 0.7,
        fast: 1,
        friction_ground: 0.94,
        friction_air: 0.98,
      },
      keyboard: null,
      pad: null,
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
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        // acc: { x: 0, y: 0 },
        jumps: [1, 1.3],
        jumpPower: 0.5,
        jumpIndex: 0,
        damage: 0,
        speed: 0.7,
        fast: 1,
        friction_ground: 0.94,
        friction_air: 0.97,
      },
      keyboard: null,
      pad: null,
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
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 1],
        jumpPower: 0.8,
        jumpIndex: 0,
        damage: 0,
        speed: 1,
        fast: 1,
        friction_ground: 0.96,
        friction_air: 0.98,
      },
      keyboard: null,
      pad: null,
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
        vel: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        jumps: [1, 0.8, 0.6, 0.4, 0.2],
        jumpPower: 0.7,
        jumpIndex: 0,
        damage: 0,
        speed: 0.8,
        fast: 1,
        friction_ground: 0.95,
        friction_air: 0.96,
      },
      keyboard: null,
      pad: null,
    },
  ];
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", "images/platform.png");

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
