import Game from './scenes/Game';

const config: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // width: 3200,
        // height: 1200,
        // width: 800,
        // height: 300,
        width: 1600,
        height: 600,
    },
    pixelArt: false,
    type: Phaser.AUTO,
    parent: 'phaser-container',
    backgroundColor: '#0077dd',
    input: {
        gamepad: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 4300 },
            debug: true,
        },
    },
    scene: Game,
};

export default new Phaser.Game(config);
