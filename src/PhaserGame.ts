import Game from "./scenes/Game";
// import DynamicTextPlugin from "phaser3-rex-plugins/plugins/dynamictext-plugin.js";

const config: Phaser.Types.Core.GameConfig = {
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  pixelArt: false,
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#000000",
  // backgroundColor: '#0077dd',
  input: {
    gamepad: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 4300 },
      // debug: false,
      debug: false,
    },
  },
  scene: Game,
  // plugins: {
  //   global: [
  //     {
  //       key: "rexDynamicTextPlugin",
  //       plugin: DynamicTextPlugin,
  //       start: true,
  //     },
  //   ],
  // },
};

export default new Phaser.Game(config);
