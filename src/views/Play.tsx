import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
import "@fontsource/press-start-2p";
import { ButtonName, CharacterMove } from "../App";
import { setSoundStartPlayLiquid } from "../scenes/helpers/sound";
import { setGameState } from "../scenes/helpers/state";

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
}

export interface SmashConfig {
  players: PlayerConfig[];
}

export type WebState = "start" | "play";

function Play() {
  let myGame: any = useRef({});
  const [numClicks, setNumClicks] = useState(0);
  const [webState, setWebState] = useState<WebState>("start");
  const [buttonsOnOff, setButtonsOnOff] = useState([
    { state: true },
    { state: true },
    { state: true },
    { state: false },
  ]);
  const [smashConfig, setSmashConfig] = useState({
    players: [
      { characterId: 0 },
      { characterId: 1 },
      { characterId: 2 },
      { characterId: 3 },
    ],
  });
  const config: Phaser.Types.Core.GameConfig = {
    title: "Smashed",
    antialias: true,
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920,
      height: 1080,
    },
    type: Phaser.AUTO,
    parent: "phaser-container",
    backgroundColor: "#00000055",
    input: {
      gamepad: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 3000 },
        debug: false,
      },
    },
    scene: [Game],
  };

  const onClickStartStartButton = () => {
    setWebState("play");
    let players = [...smashConfig.players];
    let newPlayers: { characterId: number }[] = [];
    buttonsOnOff.forEach((button, buttonIndex) => {
      if (button.state) {
        newPlayers.push({ characterId: players[buttonIndex].characterId });
      }
    });
    let newSmashConfig = { players: [...newPlayers] };
    myGame.current = new Phaser.Game(config);
    myGame.current.registry.set("parentContext", Play);
    myGame.current.registry.set("smashConfig", newSmashConfig);
  };

  const onClickStartOnOffButtons = (
    playerIndex: number,
    flipState: boolean
  ): void => {
    let buttons = [...buttonsOnOff];
    let button = buttons[playerIndex];
    button.state = flipState;
    setButtonsOnOff([...buttons]);
  };

  const onClickStartRotateSelection = (playerIndex: number): void => {
    let choices = [...smashConfig.players];
    let choice = choices[playerIndex];
    choice.characterId =
      choice.characterId + 1 < 6 ? choice.characterId + 1 : 0;
    setSmashConfig({ players: [...choices] });
  };

  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥
  // 🏴‍☠️🏳️🏁🏴
  // 🔴🟠🟡🟢🔵🟣🟤⚫⚪

  const [showRulesN64, setShowRulesN64] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {}, [webState, showRulesN64, showControls, showAbout]);

  const characterMoves: CharacterMove[] = [
    { button: "D-Pad", move: "Movement", ready: "✔️" },
    { button: "X", move: "Jump", ready: "✔️" },
    { button: "X", move: "Jump-Air", ready: "✔️" },
    { button: "UP + X", move: "Jump-Energy", ready: "✔️" },
    { button: "Y", move: "Attack-Energy", ready: "✔️" },
    { button: "B", move: "Attack-Physical", ready: "🚧" },
    { button: "Forward + B", move: "Attack-Smash", ready: "🚧" },
    { button: "Forward + WallTouch", move: "Slide-Wall", ready: "✔️" },
    { button: "L + R", move: "Pause", ready: "✔️" },
    { button: "Any", move: "UnPause", ready: "✔️" },
  ];
  const clickSoundParent = () => {
    if (webState === "play") {
      const myGameX = myGame.current.scene.keys.game as Game;
      setSoundStartPlayLiquid(myGameX);
    }
  };

  const clickPauseParent = () => {
    if (webState === "play") {
      const myGameX = myGame.current.scene.keys.game as Game;
      if (
        !(
          myGameX.gameState.name === "game-state-paused" ||
          myGameX.gameState.name === "game-state-first-blood" ||
          myGameX.gameState.name === "game-state-screen-clear"
        )
      ) {
        setGameState(myGameX, "game-state-paused");
      }
    }
  };

  const onClickPlayNavBody = (buttonName: ButtonName) => {
    clickSoundParent();

    setShowControls(false);
    setShowRulesN64(false);
    setShowAbout(false);
    setShowHistory(false);
  };

  const onClickPlayNavButtons = (buttonName: ButtonName) => {
    clickSoundParent();
    clickPauseParent();

    switch (buttonName) {
      case "Back":
        setShowControls(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "ReStart":
        setShowControls(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "Controls":
        setShowControls(!showControls);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "Rules-N64":
        setShowControls(false);
        setShowRulesN64(!showRulesN64);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "About":
        setShowControls(false);
        setShowRulesN64(false);
        setShowAbout(!showAbout);
        setShowHistory(false);
        break;
      case "History":
        setShowControls(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(!showHistory);
        break;
      default:
        setShowControls(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
    }
  };

  return (
    <div className="overDiv">
      <div className="phaser-container" id="phaser-container"></div>
      {webState === "start" && (
        <div className="startClassDiv">
          <div className="playerChoices">
            {smashConfig.players.map((player, playerIndex) => {
              return (
                <div className="playerChoice" key={playerIndex}>
                  <div
                    className="playerChar"
                    onClick={() => {
                      onClickStartRotateSelection(playerIndex);
                    }}
                  >
                    {buttonsOnOff[playerIndex].state && (
                      <div className="startImageWrapper">
                        <img
                          className="startImage"
                          src={
                            "images/character_" +
                            player.characterId.toString() +
                            "_cropped.png"
                          }
                          alt="char"
                        />
                      </div>
                    )}
                  </div>
                  {buttonsOnOff[playerIndex].state && (
                    <button
                      className="btn btn-success px-4"
                      onClick={() => {
                        onClickStartOnOffButtons(playerIndex, false);
                      }}
                    >
                      ON
                    </button>
                  )}
                  {!buttonsOnOff[playerIndex].state && (
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => {
                        onClickStartOnOffButtons(playerIndex, true);
                      }}
                    >
                      OFF
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            className="startButton btn btn-dark px-2"
            onClick={onClickStartStartButton}
          >
            Start
          </button>
        </div>
        // <Link to={"/play"} className="playLink"></Link>
      )}

      <div className="overDiv">
        <div className="top-bar">
          {webState !== "start" && (
            <button
              className="linkTag btn btn-outline-light"
              onClick={() => {
                onClickPlayNavButtons("Back");
                setWebState("start");
                setNumClicks(numClicks + 1);
                myGame.current.destroy(true);
              }}
            >
              <span>Back</span>
            </button>
          )}
          {webState !== "start" && (
            <button
              className="linkTag btn btn-outline-light"
              onClick={() => {
                onClickPlayNavButtons("ReStart");
                myGame.current.destroy(true);
                myGame.current = new Phaser.Game(config);
              }}
            >
              <span>ReStart</span>
            </button>
          )}
          <button
            className="linkTag btn btn-outline-light"
            onClick={() => {
              onClickPlayNavButtons("Controls");
            }}
          >
            <span>Controls</span>
          </button>
          <button
            className="linkTag btn btn-outline-light"
            onClick={() => {
              onClickPlayNavButtons("Rules-N64");
            }}
          >
            <span>Rules-N64</span>
          </button>
          <button
            className="linkTag btn btn-outline-light"
            onClick={() => {
              onClickPlayNavButtons("History");
            }}
          >
            <span>History</span>
          </button>
          <button
            className="linkTag btn btn-outline-light"
            onClick={() => {
              onClickPlayNavButtons("About");
            }}
          >
            <span>About</span>
          </button>
        </div>
        {showControls && (
          <div className="overDiv">
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody("Controls");
              }}
            >
              <h1>Controls</h1>
              {characterMoves.map((charMove, charMoveIndex) => {
                return (
                  <div className="move" key={charMoveIndex}>
                    <h5>{charMove.move}</h5>
                    <h5>
                      {charMove.button} {charMove.ready}
                    </h5>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {showRulesN64 && (
          <div>
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody("Rules-N64");
              }}
            >
              <h1>Rules-N64</h1>
              <div className="rulesOutline">
                <img
                  id="RulesN64Image"
                  src="images/smashRulesGimp01.png"
                  alt="Smashed Rules-N64"
                />
              </div>
            </div>
          </div>
        )}
        {showAbout && (
          <div>
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody("About");
              }}
            >
              <h1>About</h1>
              <p>
                The primary rule "Screen Clear" makes this game stand out from
                other smash drinking games; it requires a player to actively
                time their own death rather than just try to not die.
              </p>
              <h4>Tech Used</h4>
              <ul>
                <li>Phaser 3</li>
                <li>React 17 TS</li>
                <li>Bootstrap 5</li>
                <li>Press Start 2P</li>
              </ul>
              {/* <h1>🚧</h1> */}
              <img
                className="kirbyNiembro"
                src="./images/character_3_cropped.png"
                alt="kirby"
              />
              <p>by NIEMBRO64</p>
              <a
                className="linkTag btn btn-outline-light"
                href="http://niembro64.com/"
              >
                {/* <h4>See Other Projects</h4> */}
                <span>See Other Projects</span>
              </a>
            </div>
          </div>
        )}
        {showHistory && (
          <div>
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody("History");
              }}
            >
              <h1>History</h1>
              <p>
                As referenced on the RulesN64heet, (Chemon) Smashed was invented in
                Glen Carbon, Illinois (near St. Louis) some time in late 2009 by
                a group of college kids at the "Chemon" House. Since 2013, "The
                Young Boys" have been keeping it alive & thriving in St. Louis.
              </p>
              <p>
                It's normally played with the N64 Smash Bros game on the N64,
                Wii, or Emulation, but this is my attempt at recreating it with
                the RulesN64 baked in.
              </p>
              <p>
                Smashed has been played in at least 4 states and 3 countries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Play;
