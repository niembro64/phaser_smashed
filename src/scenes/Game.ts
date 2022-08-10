import "phaser";
import { Key } from "react";
import { create } from "./create";
import {
    updateMovements,
    setState,
    addKeyboard,
    updateSpriteVelocity,
    addGravity,
} from "./helpers";
import { update } from "./update";

export interface Player {
    state: string;
    multipliers_static: {
        speed: number;
        friction_ground: number;
        friction_air: number;
    };
    keyboard_static: Keyboard;
    char: Char;
    keyboard: Keyboard | any;
    // keyboard: typeof Phaser.Input.Keyboard | any;
}
export interface Keyboard {
    up: Key;
    down: Key;
    left: Key;
    right: Key;
    fast: Key;
    jump: Key;
}
// export interface Keyboard_Static {
//     up: typeof Phaser.Input.Keyboard.Key | any;
//     down: typeof Phaser.Input.Keyboard.Key | any;
//     left: typeof Phaser.Input.Keyboard.Key | any;
//     right: typeof Phaser.Input.Keyboard.Key | any;
//     fast: typeof Phaser.Input.Keyboard.Key | any;
//     jump: typeof Phaser.Input.Keyboard.Key | any;
// }

export interface Char {
    sprite: any | Phaser.GameObjects.Sprite;
    vel: { x: number; y: number };
    pos: { x: number; y: number };
    canJump: boolean;
    damage: number;
}

export default class Game extends Phaser.Scene {
    DEAD_TIME: number = 1000;
    RATIO_ANGLED_MOVEMENT: number = Math.sin(Math.PI / 4);
    DEFAULT_SPEED: number = 70;
    DEFAULT_JUMP: number = 70;
    INITIAL = { POSITION: { PLAYER_Y: 100 } };
    SCREEN_DIMENSIONS = { HEIGHT: 400, WIDTH: 800 };
    GRAVITY: number = 0.1;
    players: Player[] = [
        {
            state: "start",
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
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                // acc: { x: 0, y: 0 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
        // {
        //     state: "start",
        //     multipliers_static: {
        //         speed: 0.7,
        //         friction_ground: 0.94,
        //         friction_air: 0.97,
        //     },
        //     keyboard_static: {
        //         up: Phaser.Input.Keyboard.KeyCodes.T,
        //         down: Phaser.Input.Keyboard.KeyCodes.G,
        //         left: Phaser.Input.Keyboard.KeyCodes.F,
        //         right: Phaser.Input.Keyboard.KeyCodes.H,
        //         fast: Phaser.Input.Keyboard.KeyCodes.V,
        //         jump: Phaser.Input.Keyboard.KeyCodes.B,
        //     },
        //     char: {
        //         sprite: 0,
        //         vel: { x: 0, y: 0 },
        //         pos: { x: 0, y: 0 },
        //         // acc: { x: 0, y: 0 },
        //         canJump: false,
        //         damage: 0,
        //     },
        //     keyboard: 0,
        // },
        // {
        //     state: "start",
        //     multipliers_static: {
        //         speed: 1,
        //         friction_ground: 0.96,
        //         friction_air: 0.98,
        //     },
        //     keyboard_static: {
        //         up: Phaser.Input.Keyboard.KeyCodes.I,
        //         down: Phaser.Input.Keyboard.KeyCodes.K,
        //         left: Phaser.Input.Keyboard.KeyCodes.J,
        //         right: Phaser.Input.Keyboard.KeyCodes.L,
        //         fast: Phaser.Input.Keyboard.KeyCodes.O,
        //         jump: Phaser.Input.Keyboard.KeyCodes.P,
        //     },
        //     char: {
        //         sprite: 0,
        //         vel: { x: 0, y: 0 },
        //         pos: { x: 0, y: 0 },
        //         canJump: false,
        //         damage: 0,
        //     },
        //     keyboard: 0,
        // },
        {
            state: "start",
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
                sprite: 0,
                vel: { x: 0, y: 0 },
                pos: { x: 0, y: 0 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
    ];
    constructor() {
        super("game");
    }
    platforms: any | Phaser.GameObjects.Sprite;
    preload() {
        this.load.image("platform", "platform.png");
        for (let i = 0; i < 4; i++) {
            this.load.image("c" + i.toString(), "character_" + i + ".png");
        }
    }

    create() {
        create(this);
    }
    update() {
        update(this);
    }
}
