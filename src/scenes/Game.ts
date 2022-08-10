import 'phaser';
import { create } from './create';
import { update } from './update';
import { Player } from './interfaces';

export default class Game extends Phaser.Scene {
    DEAD_TIME: number = 1000;
    RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
    DEFAULT_SPEED: number = 70;
    DEFAULT_JUMP: number = 70;
    INITIAL = { POSITION: { PLAYER_Y: 100 } };
    SCREEN_DIMENSIONS = { HEIGHT: 400, WIDTH: 800 };
    GRAVITY: number = 0.1;
    platforms: any | Phaser.GameObjects.Sprite;
    players: Player[] = [
        {
            state: 'start',
            multipliers_static: {
                speed: 0.7,
                friction_ground: 0.94,
                friction_air: 0.98,
            },
            keyboard_static: {
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                fast: Phaser.Input.Keyboard.KeyCodes.Z,
                jump: Phaser.Input.Keyboard.KeyCodes.X,
            },
            char: {
                name: 'Mario',
                src: 'images/character_0.png',
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                // acc: { x: 0, y: 0 },
                jumps: [1, 1],
                damage: 0,
            },
            keyboard: 0,
            pad: 0,
        },
        {
            state: 'start',
            multipliers_static: {
                speed: 0.7,
                friction_ground: 0.94,
                friction_air: 0.97,
            },
            keyboard_static: {
                up: Phaser.Input.Keyboard.KeyCodes.T,
                down: Phaser.Input.Keyboard.KeyCodes.G,
                left: Phaser.Input.Keyboard.KeyCodes.F,
                right: Phaser.Input.Keyboard.KeyCodes.H,
                fast: Phaser.Input.Keyboard.KeyCodes.V,
                jump: Phaser.Input.Keyboard.KeyCodes.B,
            },
            char: {
                name: 'Link',
                src: 'images/character_1.png',
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                // acc: { x: 0, y: 0 },
                jumps: [1, 1.3],
                damage: 0,
            },
            keyboard: 0,
            pad: 0,
        },
        {
            state: 'start',
            multipliers_static: {
                speed: 1,
                friction_ground: 0.96,
                friction_air: 0.98,
            },
            keyboard_static: {
                up: Phaser.Input.Keyboard.KeyCodes.I,
                down: Phaser.Input.Keyboard.KeyCodes.K,
                left: Phaser.Input.Keyboard.KeyCodes.J,
                right: Phaser.Input.Keyboard.KeyCodes.L,
                fast: Phaser.Input.Keyboard.KeyCodes.O,
                jump: Phaser.Input.Keyboard.KeyCodes.P,
            },
            char: {
                name: 'Pikachu',
                src: 'images/character_2.png',
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                jumps: [1, 1],
                damage: 0,
            },
            keyboard: 0,
            pad: 0,
        },
        {
            state: 'start',
            multipliers_static: {
                speed: 0.8,
                friction_ground: 0.95,
                friction_air: 0.96,
            },
            keyboard_static: {
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                fast: Phaser.Input.Keyboard.KeyCodes.END,
                jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
            },
            char: {
                name: 'Kirby',
                src: 'images/character_3.png',
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                jumps: [1, 0.8, 0.6, 0.4, 0.2],
                damage: 0,
            },
            keyboard: 0,
            pad: 0,
        },
    ];
    constructor() {
        super('game');
    }
    preload() {
        this.load.image('platform', 'images/platform.png');

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
