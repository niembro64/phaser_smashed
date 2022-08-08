import { Physics } from "phaser";
import Game from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
    scale: {
        width: 800,
        height: 400,
    },
    pixelArt: false,
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#005577",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    scene: Game,
};

export default new Phaser.Game(config);
