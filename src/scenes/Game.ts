import "phaser";
import { Key } from "react";
import {
    updateMovements,
    setState,
    addKeyboard,
    updateSpriteVelocity,
    addGravity,
} from "./helpers";

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
        // {
        //     state: "start",
        //     multipliers_static: {
        //         speed: 0.8,
        //         friction_ground: 0.95,
        //         friction_air: 0.96,
        //     },
        //     keyboard_static: {
        //         up: Phaser.Input.Keyboard.KeyCodes.UP,
        //         down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        //         left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        //         right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        //         fast: Phaser.Input.Keyboard.KeyCodes.END,
        //         jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
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
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(300, 300, "platform").setScale(1, 1);
        this.players.forEach((p, i) => {
            p.char.sprite = this.physics.add.sprite(
                200 * i + 100,
                this.INITIAL.POSITION.PLAYER_Y,
                "c" + i.toString()
            );

            p.char.sprite.setScale(1);
            p.char.sprite.setCollideWorldBounds(false);
            this.physics.add.collider(p.char.sprite, this.platforms);
            p.keyboard = this.input.keyboard.addKeys(p.keyboard_static);
            p.char.sprite.body.setBounce(0);
            p.char.sprite.body.setAllowGravity(false);
            // p.char.sprite.body.setAllowGravity(true);
        });
        console.log("SPRITE", this.players[0].char.sprite);
    }
    update() {
        console.log(
            "0",
            this.players[0].state,
            this.players[0].char.sprite.body.touching.down,
            this.players[0].char.sprite.y
        );

        this.players.forEach((player, index) => {
            switch (player.state) {
                case "start":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// timeout => dead
                    ///////////////////////////////////////////////////////////////
                    player.char.sprite.body.setAllowGravity(false);
                    setState(player, "dead");

                    break;
                case "dead":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// timeout => air
                    ///////////////////////////////////////////////////////////////

                    player.char.sprite.body.setAllowGravity(true);
                    setState(player, "air");

                    break;
                case "air":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////
                    addKeyboard(player, this);
                    addGravity(player, this);
                    updateSpriteVelocity(player, this);

                    ///////////////////////////////////////////////////////////////
                    ///////// die => dead
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// touch down => ground
                    ///////////////////////////////////////////////////////////////
                    if (player.char.sprite.body.touching.down) {
                        player.char.sprite.body.setAllowGravity(false);
                        setState(player, "ground");
                    } // shit

                    ///////////////////////////////////////////////////////////////
                    ///////// touch side => wall
                    ///////////////////////////////////////////////////////////////

                    break;
                case "ground":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////
                    addKeyboard(player, this);
                    addGravity(player, this);
                    updateSpriteVelocity(player, this);

                    ///////// jump => air
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// fall => air
                    ///////////////////////////////////////////////////////////////
                    break;
                case "wall":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// jump => air
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// fall => air
                    ///////////////////////////////////////////////////////////////
                    break;
                case "spin":
                    ///////////////////////////////////////////////////////////////
                    ///////// WHILE IN LOOP
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// jump => air
                    ///////////////////////////////////////////////////////////////

                    ///////////////////////////////////////////////////////////////
                    ///////// fall => air
                    ///////////////////////////////////////////////////////////////
                    break;
                default:
                    console.log("????");
            }
        });
    }
}
