import { Key } from "react";

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
    pad: Gamepad | any; 
}

export interface Keyboard {
    up: Key;
    down: Key;
    left: Key;
    right: Key;
    fast: Key;
    jump: Key;
}

export interface Char {
    name: string;
    src: string;
    sprite: any | Phaser.GameObjects.Sprite;
    vel: { x: number; y: number };
    pos: { x: number; y: number };
    canJump: boolean;
    damage: number;
}
    // export interface Keyboard_Static {
    //     up: typeof Phaser.Input.Keyboard.Key | any;
    //     down: typeof Phaser.Input.Keyboard.Key | any;
    //     left: typeof Phaser.Input.Keyboard.Key | any;
    //     right: typeof Phaser.Input.Keyboard.Key | any;
    //     fast: typeof Phaser.Input.Keyboard.Key | any;
    //     jump: typeof Phaser.Input.Keyboard.Key | any;
    // }
