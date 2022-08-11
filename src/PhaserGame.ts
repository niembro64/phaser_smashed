import Game from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    width: 1600,
    height: 600,
  },
  pixelArt: false,
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#005577",
  input: {
    gamepad: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 4300 },
      debug: false,
    },
  },
  scene: Game,
};

export default new Phaser.Game(config);
