import "phaser";

export interface player {
    char: char;
}

export interface char {
    sprite: any | Phaser.GameObjects.Sprite;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    damage: number;
}

export default class Game extends Phaser.Scene {
    screen = { height: 800, width: 400 };
    defaults = { position: { playerY: 100 } };
    gravity: number = 0.2;
    players: player[] = [
        {
            char: {
                sprite: 0,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.2 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: 0,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.4 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: 0,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.5 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: 0,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.9 },
                damage: 0,
            },
        },
    ];
    constructor() {
        super("game");
    }
    platform: any | Phaser.GameObjects.Sprite;
    preload() {
        this.load.image("platform", "platform.png");
        for (let i = 0; i < 4; i++) {
            this.load.image("c" + i.toString(), "character_" + i + ".png");
        }
    }

    create() {
        this.platform = this.physics.add.staticGroup();
        this.platform.create(300, 300, "platform").setScale(1, 1);
        this.players.forEach((p, i) => {
            p.char.sprite = this.physics.add.sprite(
                200 * i + 100,
                this.defaults.position.playerY,
                "c" + i.toString()
            );
            p.char.sprite.setScale(1, 1);
            console.log(p.char.sprite);
        });
    }
    update() {
        updateposition(this);
        updateAllMovingParts(this);
        printStatus(this);
    }
}

export function updateposition(g: Game): void {
    g.players.forEach((p, i) => {
        if (!p.char.sprite) {
            return;
        }
        p.char.velocity.y += g.gravity + p.char.acceleration.y;
        p.char.sprite.y += p.char.velocity.y;
    });
}

export function updateAllMovingParts(g: Game): void {
    g.players.forEach((p, i) => {
        if (!p.char.sprite) {
            return;
        }
        if (p.char.sprite.y > g.screen.height) {
            p.char.sprite.y = 0;
        }
    });
}

export function printStatus(g: Game): void {
    if (!g.players[0].char.sprite) {
        return;
    }
    console.log("0", Math.round(g.players[0].char.sprite.y));
}
