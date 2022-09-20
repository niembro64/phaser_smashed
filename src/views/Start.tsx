// import { useState } from "react";
import { useEffect, useState } from "react";
// import phaserGame from "../PhaserGame";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
// import "@fontsource/press-start-2p";
import { ButtonName, CharacterMove } from "../App";
import { Link } from "react-router-dom";
import Play from "./Play";

function Start() {
  const [smashGame, setSmashGame] = useState();
  const [smashConfig, setSmashConfig] = useState({
    players: [
      { characterId: 0 },
      { characterId: 0 },
      { characterId: 0 },
      { characterId: 0 },
    ],
  });
  const config: Phaser.Types.Core.GameConfig = {
    title: "Smashed",
    // bannerBackgroundColor: [],
    antialias: true,
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      // mode: Phaser.Scale.ENVELOP,
      // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      // width: 3840,
      width: 1920,
      // width: 1080,
      // height: 2160,
      // height: 1920,
      height: 1080,
      // autoRound: true,
    },
    type: Phaser.AUTO,
    parent: "phaser-container",
    // #{numPlayers}
    // bannerTextColor: [
    //   "#00000055",
    //   "#00000055",
    //   "#00000055",
    //   "#00000055",
    //   "#00000055",
    // ],
    backgroundColor: "#00000055",
    // backgroundColor: '#0077dd',
    input: {
      gamepad: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 3000 },
        debug: false,
        // debug: true,
      },
    },
    scene: [Game],
    // dom: {
    //   createContainer: true,
    // },
    // fps: {
    //   forceSetTimeOut: true,
    //   // forceSetTimeOut: false,
    //   // min: 60,
    //   // max: 60,
    //   target: 60,
    //   // target: 120,
    // },
  };

  let newGame: any;

  const onStartHandler = () => {
    newGame = new Phaser.Game(config);
    newGame.registry.set("parentContext", Play);
    newGame.registry.set("smashConfig", smashConfig);
    setSmashGame(newGame);
    newGame.registry.set("smashGame", smashGame);
  };

  return (
    <>
      <Link to={"/play"}>
        <button className="btn btn-primary px-4" onClick={onStartHandler}>
          <span>Start</span>
        </button>
      </Link>
    </>
  );
}

export default Start;
