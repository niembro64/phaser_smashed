import { SignPrivateKeyInput } from "crypto";
import "phaser";

export default class Game extends Phaser.Scene {
    char0: any;
    constructor() {
        super("game");
    }

    preload() {
        this.load.image("char0", "../images/star.png");
    }

    create() {
        this.char0 = this.physics.add.sprite(100, 100, "char0");
    }
    update() {
        if (this.char0.y > 300) {
            this.char0.y = 100;
        }
    }
}
