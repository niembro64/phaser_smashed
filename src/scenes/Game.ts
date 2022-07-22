import Phaser from "phaser";
import { ParenthesizedTypeNode } from "typescript";
import { isBoxedPrimitive } from "util/types";

export default class Game extends Phaser.Scene {
    char0: any;

    constructor() {
        super("helloworld");
    }

    preload() {
        this.load.setBaseURL("https://labs.phaser.io");
        this.load.image("logo", "assets/sprites/phaser3-logo.png");
        this.load.image("red", "assets/particles/red.png");
        this.load.image("x", "assets/images/character_0");
    }

    create() {
        this.createEmitter();
    }

    update() {}

    createEmitter() {
        const particles = this.add.particles("red");

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: "ADD",
        });

        const logo = this.physics.add.image(400, 100, "logo");

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
}
