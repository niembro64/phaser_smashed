// import { useState } from "react";
import { useEffect, useState } from "react";
import phaserGame from "./PhaserGame";
import Game from "./scenes/Game";
import "./App.css";
// import "@fontsource/press-start-2p";
import { setGameState } from "./scenes/helpers/state";
import { setSoundStartPlayLiquid } from "./scenes/helpers/sound";

export interface CharacterMove {
  button: string;
  move: string;
  ready: string;
}

export type ButtonName = "Projects" | "Controls" | "Rules" | "About" | "Plans";

function App() {
  const [showRules, setShowRules] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {}, [showRules, showControls, showAbout, showPlans]);

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
    const game = phaserGame.scene.keys.game as Game;
    setShowControls(false);
    setShowRules(false);
    setShowAbout(false);
    setShowPlans(false);

    game.connectionFunction();
    setSoundStartPlayLiquid(game);
  };

  const onClickHandlerButtons = (buttonName: ButtonName) => {
    const game = phaserGame.scene.keys.game as Game;
    game.connectionFunction();
    setSoundStartPlayLiquid(game);
    if (game.gameState.name !== "game-state-paused") {
      setGameState(game, "game-state-paused");
    }

    switch (buttonName) {
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
      <div className="top-bar">
        <a
          className="linkTag btn btn-outline-light"
          href="http://niembro64.com/"
        >
          <span>Projects</span>
        </a>
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
            onClickHandlerButtons("About");
          }}
        >
          <span>About</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandlerButtons("Plans");
          }}
        >
          <span>Plans</span>
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
            <h1>🚧</h1>
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
            <h1>Plans</h1> <h1>🚧</h1>
          </div>
        </>
      )}
      <div id="phaser-container"></div>
    </>
  );
}

export default App;
