import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig =  {
  scale: {
      width: 800,
      height: 400,
  },
  pixelArt: false,
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0072bc",
  physics: {
      default: "arcade",
      arcade: {
          gravity: { y: 300 },
          debug: false,
      },
  },
  scene: Game,
};

export default new Phaser.Game(config)
