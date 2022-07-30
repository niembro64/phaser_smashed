import "phaser";
import { isPrefixUnaryExpression } from "typescript";

export interface player {
    char: char;
    KEYBOARD: KEYBOARD;
    keyboard: typeof Phaser.Input.Keyboard | any;
}
export interface KEYBOARD {
    up: typeof Phaser.Input.Keyboard.Key | any;
    down: typeof Phaser.Input.Keyboard.Key | any;
    left: typeof Phaser.Input.Keyboard.Key | any;
    right: typeof Phaser.Input.Keyboard.Key | any;
    fast: typeof Phaser.Input.Keyboard.Key | any;
    jump: typeof Phaser.Input.Keyboard.Key | any;
}

export interface char {
    sprite: any | Phaser.GameObjects.Sprite;
    vel: { x: number; y: number };
    acc: { x: number; y: number };
    canJump: boolean;
    mult: number;
    damage: number;
}

export default class Game extends Phaser.Scene {
    screen = { height: 800, width: 400 };
    defaults = { pos: { playerY: 100 } };
    gravity: number = 20;
    players: player[] = [
        {
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 1 },
                canJump: false,
                mult: 1.4,
                damage: 0,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D,
                fast: Phaser.Input.Keyboard.KeyCodes.Z,
                jump: Phaser.Input.Keyboard.KeyCodes.X,
            },
            keyboard: 0,
        },
        {
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 0.4 },
                canJump: false,
                mult: 1.1,
                damage: 0,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.T,
                down: Phaser.Input.Keyboard.KeyCodes.G,
                left: Phaser.Input.Keyboard.KeyCodes.F,
                right: Phaser.Input.Keyboard.KeyCodes.H,
                fast: Phaser.Input.Keyboard.KeyCodes.V,
                jump: Phaser.Input.Keyboard.KeyCodes.B,
            },
            keyboard: 0,
        },
        {
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 0.5 },
                canJump: false,
                mult: 2,
                damage: 0,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.I,
                down: Phaser.Input.Keyboard.KeyCodes.K,
                left: Phaser.Input.Keyboard.KeyCodes.J,
                right: Phaser.Input.Keyboard.KeyCodes.L,
                fast: Phaser.Input.Keyboard.KeyCodes.O,
                jump: Phaser.Input.Keyboard.KeyCodes.P,
            },
            keyboard: 0,
        },
        {
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 0.9 },
                canJump: false,
                mult: 1.5,
                damage: 0,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.UP,
                down: Phaser.Input.Keyboard.KeyCodes.DOWN,
                left: Phaser.Input.Keyboard.KeyCodes.LEFT,
                right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                fast: Phaser.Input.Keyboard.KeyCodes.END,
                jump: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,
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
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(300, 300, "platform").setScale(1, 1);
        this.players.forEach((p, i) => {
            p.char.sprite = this.physics.add.sprite(
                200 * i + 100,
                this.defaults.pos.playerY,
                "c" + i.toString()
            );

            p.char.sprite.setScale(1);
            p.char.sprite.setCollideWorldBounds(true);
            this.physics.add.collider(p.char.sprite, this.platforms);
            p.keyboard = this.input.keyboard.addKeys(p.KEYBOARD);
        });
    }
    update() {
        updateKeyboard(this);
        updateMovingData(this);
        updateTouching(this);
        updateMovingSprite(this);
        printStatus(this);
    }
}
export function updateTouching(g: Game) {
    g.players.forEach((p, i) => {
        if (p.char.sprite.body.touching.down && !p.char.canJump) {
            p.char.canJump = true;
        }
        // if (p.char.sprite.body.collideWorldBounds && !p.char.canJump) {
        //     p.char.canJump = true;
        // }
    });
}

export function updateFacingDirection(g: Game): void {
    g.players.forEach((p, i) => {
        if (p.char.vel.x > 0) {
            p.char.sprite.setScale(-1);
        } else if (p.char.vel.x < 0) {
            p.char.sprite.setScale(1);
        }
    });
}
export function updateKeyboard(g: Game): void {
    g.players.forEach((p, i) => {
        if (p.keyboard.right.isDown) {
            p.char.vel.x = 300;
        }
        if (p.keyboard.left.isDown) {
            p.char.vel.x = -300;
        }
        if (p.keyboard.jump.isDown && p.char.canJump) {
            console.log("JUMP")
            p.char.canJump = false;
            p.char.vel.y = -300;
        }
    });
}
export function updateMovingSprite(g: Game): void {
    g.players.forEach((p, i) => {
        p.char.sprite.setVelocityX(
            p.keyboard.fast.isDown ? p.char.vel.x * p.char.mult : p.char.vel.x
        );
        p.char.sprite.setVelocityY(p.char.vel.y);
    });
}
export function updateMovingData(g: Game): void {
    g.players.forEach((p, i) => {
        p.char.vel.x += p.char.acc.x;
        p.char.vel.y += g.gravity * p.char.acc.y;
    });
}

export function printStatus(g: Game): void {
    // console.log("0", Math.round(g.players[0].char.sprite.y));
    console.log(
        g.players[0].char.sprite.body.touching,
        g.players[0].char.canJump
    );
    // console.log(g.players[0].keyboard);
}
