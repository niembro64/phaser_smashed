import { SignPrivateKeyInput } from "crypto";
import "phaser";

export interface player {
    char: char;
}

export interface char {
    sprite: null | Phaser.GameObjects.Sprite;
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
                sprite: null,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.2 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: null,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.4 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: null,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0.5 },
                damage: 0,
            },
        },
        {
            char: {
                sprite: null,
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

    preload() {
        this.players.forEach((p, i) => {
            this.load.image("c" + i.toString(), "character_" + i + ".png");
        });
    }

    create() {
        this.players.forEach((p, i) => {
            p.char.sprite = this.physics.add.sprite(
                200 * i + 100,
                this.defaults.position.playerY,
                "c" + i.toString()
            );
            console.log(p.char.sprite);
        });
    }
    update() {
        updateposition(this);
        updateAllMovingParts(this);
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
