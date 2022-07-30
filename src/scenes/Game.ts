import 'phaser';

export interface player {
    MULTIPLIERS: {
        SPEED: number;
        FRICTION_GROUND: number;
        FRICTION_AIR: number;
    };
    KEYBOARD: KEYBOARD;
    char: char;
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
    damage: number;
}

export default class Game extends Phaser.Scene {
    RATIO_SPEED_OVER_ACC: number = 0.5;
    DEFAULT_SPEED: number = 30;
    INITIAL = { POSITION: { PLAYER_Y: 100 } };
    SCREEN = { HEIGHT: 400, WIDTH: 800 };
    GRAVITY: number = 40;
    players: player[] = [
        {
            MULTIPLIERS: {
                SPEED: 0.7,
                FRICTION_GROUND: 0.94,
                FRICTION_AIR: 1,
            },
            KEYBOARD: {
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
                acc: { x: 0, y: 1 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
        {
            MULTIPLIERS: {
                SPEED: 0.7,
                FRICTION_GROUND: 0.94,
                FRICTION_AIR: 0.98,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.T,
                down: Phaser.Input.Keyboard.KeyCodes.G,
                left: Phaser.Input.Keyboard.KeyCodes.F,
                right: Phaser.Input.Keyboard.KeyCodes.H,
                fast: Phaser.Input.Keyboard.KeyCodes.V,
                jump: Phaser.Input.Keyboard.KeyCodes.B,
            },
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 0 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
        {
            MULTIPLIERS: {
                SPEED: 1,
                FRICTION_GROUND: 0.96,
                FRICTION_AIR: 0.98,
            },
            KEYBOARD: {
                up: Phaser.Input.Keyboard.KeyCodes.I,
                down: Phaser.Input.Keyboard.KeyCodes.K,
                left: Phaser.Input.Keyboard.KeyCodes.J,
                right: Phaser.Input.Keyboard.KeyCodes.L,
                fast: Phaser.Input.Keyboard.KeyCodes.O,
                jump: Phaser.Input.Keyboard.KeyCodes.P,
            },
            char: {
                sprite: 0,
                vel: { x: 0, y: 0 },
                acc: { x: 0, y: 0 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
        {
            MULTIPLIERS: {
                SPEED: 0.8,
                FRICTION_GROUND: 0.95,
                FRICTION_AIR: 0.97,
            },
            KEYBOARD: {
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
                acc: { x: 0, y: 0 },
                canJump: false,
                damage: 0,
            },
            keyboard: 0,
        },
    ];
    constructor() {
        super('game');
    }
    platforms: any | Phaser.GameObjects.Sprite;
    preload() {
        this.load.image('platform', 'platform.png');
        for (let i = 0; i < 4; i++) {
            this.load.image('c' + i.toString(), 'character_' + i + '.png');
        }
    }

    create() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(300, 300, 'platform').setScale(1, 1);
        this.players.forEach((p, i) => {
            p.char.sprite = this.physics.add.sprite(
                200 * i + 100,
                this.INITIAL.POSITION.PLAYER_Y,
                'c' + i.toString()
            );

            p.char.sprite.setScale(1);
            p.char.sprite.setCollideWorldBounds(false);
            this.physics.add.collider(p.char.sprite, this.platforms);
            p.keyboard = this.input.keyboard.addKeys(p.KEYBOARD);
        });
    }
    update() {
        updateKeyboard(this);
        updateMovements(this);
        updateFrictionGround(this);
        updateFrictionAir(this);
        updateKeepOnScreen(this);
        updateTouching(this);
        printStatus(this);
    }
}
export function updateFrictionAir(g: Game) {
    g.players.forEach((p, i) => {
        p.char.vel.x = p.char.vel.x * p.MULTIPLIERS.FRICTION_AIR;
        p.char.vel.y = p.char.vel.y * p.MULTIPLIERS.FRICTION_AIR;
    });
}
export function updateFrictionGround(g: Game) {
    g.players.forEach((p, i) => {
        if (p.char.sprite.body.touching.down) {
            p.char.vel.x = p.char.vel.x * p.MULTIPLIERS.FRICTION_GROUND;
            p.char.canJump = true;
        }
    });
}
export function updateKeepOnScreen(g: Game): void {
    g.players.forEach((p, i) => {
        if (p.char.sprite.y < 0) {
            p.char.sprite.y = g.SCREEN.HEIGHT;
        }
        if (p.char.sprite.y > g.SCREEN.HEIGHT) {
            p.char.sprite.y = 0;
        }
        if (p.char.sprite.x < 0) {
            p.char.sprite.x = g.SCREEN.WIDTH;
        }
        if (p.char.sprite.x > g.SCREEN.WIDTH) {
            p.char.sprite.x = 0;
        }
    });
}
export function updateTouching(g: Game): void {
    g.players.forEach((p, i) => {
        if (p.char.sprite.body.touching.down) {
            p.char.vel.y = 0;
            p.char.canJump = true;
        }
        if (
            p.char.sprite.body.touching.left ||
            p.char.sprite.body.touching.right
        ) {
            p.char.vel.x = 0;
        }
    });
}

export function updateKeyboard(g: Game): void {
    g.players.forEach((p, i) => {
        // KEYBOARD LEFT RIGHT
        if (p.char.sprite.body.touching.down) {
            // GROUND
            if (p.keyboard.left.isDown && p.keyboard.right.isDown) {
                p.char.acc.x = 0;
            } else if (p.keyboard.left.isDown) {
                p.char.acc.x = -1 * p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED * 2;
            } else if (p.keyboard.right.isDown) {
                p.char.acc.x = p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED * 2;
            } else {
                p.char.acc.x = 0;
            }
        } else {
            // AIR
            if (p.keyboard.left.isDown && p.keyboard.right.isDown) {
                p.char.acc.x = 0;
            } else if (p.keyboard.left.isDown) {
                p.char.acc.x = -1 * p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED;
            } else if (p.keyboard.right.isDown) {
                p.char.acc.x = p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED;
            } else {
                p.char.acc.x = 0;
            }
        }

        // KEYBOARD LEFT RIGHT
        if (p.keyboard.up.isDown && p.keyboard.down.isDown) {
            p.char.acc.y = 0;
        } else if (p.keyboard.up.isDown) {
            p.char.acc.y = -1 * p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED;
        } else if (p.keyboard.right.isDown) {
            p.char.acc.y = p.MULTIPLIERS.SPEED * g.DEFAULT_SPEED;
        } else {
            p.char.acc.y = 0;
        }

        // KEYBOARD FAST
        if (p.keyboard.fast.isDown) {
            p.char.acc.x = p.char.acc.x * 3;
        }

        // KEYBOARD JUMP
        if (p.keyboard.jump.isDown && p.char.canJump) {
            p.char.vel.y = -900;
            p.char.canJump = false;
        }
    });
}

export function updateMovements(g: Game): void {
    g.players.forEach((p, i) => {
        p.char.vel.x = p.char.vel.x + p.char.acc.x;
        p.char.vel.y = p.char.vel.y + p.char.acc.y + g.GRAVITY;

        p.char.sprite.setVelocityX(p.char.vel.x);
        p.char.sprite.setVelocityY(p.char.vel.y);
    });
}

export function printStatus(g: Game): void {
    // console.log("0", Math.round(g.players[0].char.sprite.y));
    console.log(g.players[0].char.sprite.body.gameObject.body);
    // console.log(g.players[0].keyboard);
}
