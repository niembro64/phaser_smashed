// import { useState } from "react";
import { useEffect, useState } from "react";
// import phaserGame from "../PhaserGame";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
// import "@fontsource/press-start-2p";
import { ButtonName, CharacterMove } from "../App";
import { Link } from "react-router-dom";

export type CharacterId = 0 | 1 | 2 | 3 | 4 | 5;

// export type CharacterName =
//   | "Mario"
//   | "Link"
//   | "Pikachu"
//   | "Kirby"
//   | "Chez"
//   | "BlackChez";

export interface PlayerConfig {
  characterId: CharacterId;
  // name: CharacterName;
}

export interface SmashConfig {
  players: PlayerConfig[];
}

function Play() {
  let newGame: any;
  let smashGame: any;

  const [showRules, setShowRules] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  // const [smashConfig, setSmashConfig] = useState({
  //   players: [
  //     { characterId: 3 },
  //     { characterId: 3 },
  //     { characterId: 3 },
  //     { characterId: 3 },
  //   ],
  // });
  // const smashConfig: SmashConfig = {
  //   // players: [
  //   //   { name: "Mario" },
  //   //   { name: "Link" },
  //   //   { name: "Link" },
  //   //   { name: "Link" },
  //   // ],
  //   players: [
  //     { characterId: 1 },
  //     { characterId: 2 },
  //     { characterId: 2 },
  //     { characterId: 2 },
  //   ],
  // };
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

  // useEffect(() => {}, [showRules, showControls, showAbout, showPlans]);

  useEffect(() => {
    // if (newGame) {
    //   newGame.destroy(true);
    // }
    // newGame = new Phaser.Game(config);
    // newGame.registry.set("parentContext", Play);
    // newGame.registry.set("smashConfig", smashConfig);
  }, []);

  const characterMoves: CharacterMove[] = [
    { button: "D-Pad", move: "Movement", ready: "✔️" },
    { button: "X", move: "Jump", ready: "✔️" },
    { button: "X", move: "Air Jump", ready: "✔️" },
    { button: "UP + X", move: "Energy Jump", ready: "✔️" },
    { button: "Forward + WallTouch", move: "Wall  Slide", ready: "✔️" },
    { button: "Y", move: "Energy Attack", ready: "✔️" },
    { button: "L + R", move: "Pause", ready: "✔️" },
    { button: "Any", move: "UnPause", ready: "✔️" },
    { button: "B", move: "Physical Attack", ready: "🚧" },
    { button: "Forward + B", move: "Smash Attack", ready: "🚧" },
  ];

  const onClickHandlerBody = (buttonName: ButtonName) => {
    // const game = phaserGame.scene.keys.game as Game;
    setShowControls(false);
    setShowRules(false);
    setShowAbout(false);
    setShowPlans(false);

    // game.connectionFunction();
    // setSoundStartPlayLiquid(game);
  };

  const onClickHandlerButtons = (buttonName: ButtonName) => {
    // const game = phaserGame.scene.keys.game as Game;
    // game.connectionFunction();
    // setSoundStartPlayLiquid(game);
    // if (
    //   !(
    //     game.gameState.name === "game-state-paused" ||
    //     game.gameState.name === "game-state-first-blood" ||
    //     game.gameState.name === "game-state-screen-clear"
    //   )
    // ) {
    //   setGameState(game, "game-state-paused");
    // }

    switch (buttonName) {
      case "ReStart":
        setShowControls(false);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(false);
        break;
      case "Controls":
        setShowControls(!showControls);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(false);
        break;
      case "Rules":
        setShowControls(false);
        setShowRules(!showRules);
        setShowAbout(false);
        setShowPlans(false);
        break;
      case "About":
        setShowControls(false);
        setShowRules(false);
        setShowAbout(!showAbout);
        setShowPlans(false);
        break;
      case "Plans":
        setShowControls(false);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(!showPlans);
        break;
      default:
        setShowControls(false);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(false);
    }
  };
  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥
  // 🏴‍☠️🏳️🏁🏴
  // 🔴🟠🟡🟢🔵🟣🟤⚫⚪
  return (
    <>
      <div className="phaser-container" id="phaser-container"></div>
      <div className="top-bar">
        {/* <Link
          to={"/"}
          id="link"
          onClick={() => {
            newGame.destroy(true);
          }}
        >
          <button className="linkTag btn btn-outline-light px-4 my-2">
            <span>Back</span>
          </button>
        </Link> */}
        {/* <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            newGame.destroy(true);
            newGame = new Phaser.Game(config);
            newGame.registry.set("parentContext", Play);
            // newGame.registry.set("smashConfig", smashConfig);
            onClickHandlerButtons("ReStart");
          }}
        >
          <span>ReStart</span>
        </button> */}
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandlerButtons("Controls");
          }}
        >
          <span>Controls</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandlerButtons("Rules");
          }}
        >
          <span>Rules</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandlerButtons("Plans");
          }}
        >
          <span>Plans</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandlerButtons("About");
          }}
        >
          <span>About</span>
        </button>
      </div>
      {showControls && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandlerBody("Controls");
            }}
          >
            <h1>Controls</h1>
            {characterMoves.map((charMove, charMoveIndex) => {
              return (
                <>
                  <div className="move" key={charMoveIndex}>
                    <h5>{charMove.move}</h5>
                    <h5>
                      {charMove.button} {charMove.ready}
                    </h5>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
      {showRules && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandlerBody("Rules");
            }}
          >
            <h1>Rules</h1>
            <div className="rulesOutline">
              <img
                id="rulesImage"
                src="images/smashRulesGimp01.png"
                alt="Smashed Rules"
              />
            </div>
          </div>
        </>
      )}
      {showAbout && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandlerBody("About");
            }}
          >
            <h1>About</h1>
            <p>
              As referenced on the rulesheet, (Chemon) Smashed was invented in
              Glen Carbon, Illinois (near St. Louis) some time in late 2009 by a
              group of college kids at the "Chemon" House. Since 2013, "The
              Young Boys" have been keeping it alive in St. Louis.
            </p>
            <p>
              It's normally played with the N64 Smash Bros game on the N64, Wii,
              or Emulation, but this is my attempt at recreating it with the
              rules baked in.
            </p>
            <p>
              The thing that makes this game stand out from other smash drinking
              games is the main rule, "Screen Clear", requiring players to time
              their death rather than just try to not die.
            </p>
            <p>
              The game has been played in at least 4 states and 3 countries.
            </p>

            <h4>Tech Used</h4>
            <ul>
              <li>Phaser 3</li>
              <li>React TS</li>
              <li>Bootstrap</li>
              <li>Press Start 2P</li>
            </ul>
            <h1>🚧</h1>
            <p>by NIEMBRO64</p>
            <a
              className="linkTag btn btn-outline-light"
              href="http://niembro64.com/"
            >
              {/* <h4>See Other Projects</h4> */}
              <span>See Other Projects</span>
            </a>
          </div>
        </>
      )}
      {showPlans && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandlerBody("Plans");
            }}
          >
            <h1>Plans</h1>
            <p>
              Let me know if something weird happens, or if you have
              suggestions.
            </p>
            <h1>🚧</h1>
          </div>
        </>
      )}
    </>
  );
}

export default Play;
