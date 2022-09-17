// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import "@fontsource/press-start-2p";

export interface CharacterMove {
  button: string;
  move: string;
  ready: string;
}

export type ButtonName = "Home" | "Controlls" | "Rules" | "About" | "Plans";

function App() {
  const [showRules, setShowRules] = useState(false);
  const [showControlls, setShowControlls] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {}, [showRules, showControlls, showAbout, showPlans]);

  const smashRulesLocation = "smashRulesGimp01.png";

  const characterMoves: CharacterMove[] = [
    { button: "D-Pad", move: "Movement", ready: "✔️" },
    { button: "X", move: "Jump", ready: "✔️" },
    { button: "X", move: "Air Jump", ready: "✔️" },
    { button: "UP + X", move: "Energy Jump", ready: "🚧" },
    { button: "Forward + WallTouch", move: "Wall  Slide", ready: "✔️" },
    { button: "Y", move: "Energy Attack", ready: "🚧" },
    { button: "L + R", move: "Pause", ready: "✔️" },
    { button: "Any", move: "UnPause", ready: "✔️" },
    { button: "B", move: "Physical Attack", ready: "🔜" },
    { button: "Forward + B", move: "Smash Attack", ready: "🔜" },
  ];

  const onClickHandler = (buttonName: ButtonName) => {
    switch (buttonName) {
      case "Controlls":
        setShowControlls(!showControlls);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(false);
        break;
      case "Rules":
        setShowControlls(false);
        setShowRules(!showRules);
        setShowAbout(false);
        setShowPlans(false);
        break;
      case "About":
        setShowControlls(false);
        setShowRules(false);
        setShowAbout(!showAbout);
        setShowPlans(false);
        break;
      case "Plans":
        setShowControlls(false);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(!showPlans);
        break;
      default:
        setShowControlls(false);
        setShowRules(false);
        setShowAbout(false);
        setShowPlans(false);
    }
  };
  // ✔️🚧❌🚫🛑🔜
  return (
    <>
      <div className="top-bar">
        <a
          className="linkTag btn btn-outline-light"
          href="http://niembro64.com/"
        >
          <span>HOME</span>
        </a>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandler("Controlls");
          }}
        >
          <span>CONTROLLS</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandler("Rules");
          }}
        >
          <span>RULES</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandler("About");
          }}
        >
          <span>ABOUT</span>
        </button>
        <button
          className="linkTag btn btn-outline-light"
          onClick={() => {
            onClickHandler("Plans");
          }}
        >
          <span>PLANS</span>
        </button>
      </div>
      {showControlls && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandler("Controlls");
            }}
          >
            <h1>CONTROLLS</h1>
            {characterMoves.map((cm) => {
              return (
                <>
                  <div className="move">
                    <h5>{cm.move}</h5>
                    <h5>
                      {cm.button} {cm.ready}
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
              onClickHandler("Rules");
            }}
          >
            <h1>RULES</h1>
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
              onClickHandler("About");
            }}
          >
            <h1>ABOUT</h1>
            <h1>🚧</h1>
          </div>
        </>
      )}
      {showPlans && (
        <>
          <div
            className="popup"
            onClick={() => {
              onClickHandler("Plans");
            }}
          >
            <h1>PLANS</h1> <h1>🚧</h1>
          </div>
        </>
      )}
      {/* <div id="top-bar">
        <h1 id="title">SMASHED</h1>
        <h1 id="title">{{ debug } ? "DEBUGGING" : ""}</h1>
        <h1 id="title"># Controllers: {numControllers}</h1>
        <h1 id="boy"># Controllers: {numControllers}</h1>
      </div> */}
      {/* <div id="phaser-container"></div> */}
    </>
  );
}

export default App;
