import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
import "@fontsource/press-start-2p";
import { ButtonName, CharacterMove } from "../App";
import { setSoundStartPlayLiquid } from "../scenes/helpers/sound";
import { setGameState } from "../scenes/helpers/state";
import useSound from "use-sound";

// @ts-ignore
import titleImage from "../images/titleImage.png";
// @ts-ignore
import importedPauseSound from "../sounds/mariopause.mp3";
// @ts-ignore
import importedStartSound from "../sounds/start.wav";
// @ts-ignore
import importedBlipSound from "../sounds/game-start-liquid.wav";
// @ts-ignore
import importedMonkeysMusic from "../sounds/monkeys2.wav";
import React from "react";
// import importedPauseSound from "../../public/sounds/mariopause.mp3";

// test commit

export type CharacterId = 0 | 1 | 2 | 3 | 4 | 5;

// export type CharacterName =
//   | "Mario"
//   | "Link"
//   | "Pikachu"
//   | "Kirby"
//   | "Chez"
//   | "BlackChez";

export interface SmashConfig {
  players: PlayerConfig[];
}

export interface SmashConfigScale {
  characterId: CharacterId;
  scale: number;
}

export interface PlayerConfig {
  characterId: CharacterId;
  scale: number;
}

export type WebState = "start" | "play";

export interface Quote {
  name: string;
  text: string;
}

function Play() {
  let myGame: any = useRef({});
  // let monkeysMusic: any = useRef({});
  // let monkeysMusic: any = React.createRef()
  // monkeysMusic.current = new Audio("../sounds/monkeys2.wav");
  // let monkeysMusic = new Audio("monkeys2.wav");

  // @ts-ignore
  // const [monkeysMusic, { stop, isPlaying }] = useSound(importedMonkeysMusic, {
  //   volume: 0.4,
  // });
  // const [pauseSound] = useSound(importedPauseSound, { volume: 0.4 });
  const [startSound] = useSound(importedStartSound, { volume: 0.4 });
  const [blipSound] = useSound(importedBlipSound, { volume: 0.2 });
  // @ts-ignore
  // const [monkeysMusicPlay, { stop, isPlaying }] = useSound(
  //   importedMonkeysMusic,
  //   { volume: 0.3 }
  // );

  // let pauseSound = new Audio("../../public/sounds/mariopause.mp3");
  const [numClicks, setNumClicks] = useState(0);
  const [webState, setWebState] = useState<WebState>("start");
  const [buttonsOnOff, setButtonsOnOff] = useState([
    { state: true },
    { state: true },
    { state: true },
    { state: true },
  ]);
  const [smashConfig, setSmashConfig] = useState({
    players: [
      { characterId: 0, scale: 0.9 },
      { characterId: 1, scale: 0.9 },
      { characterId: 2, scale: 1 },
      { characterId: 3, scale: 0.7 },
    ],
  });
  const smashConfigScaleArray: SmashConfigScale[] = [
    { characterId: 0, scale: 0.9 },
    { characterId: 1, scale: 0.9 },
    { characterId: 2, scale: 1 },
    { characterId: 3, scale: 0.7 },
    { characterId: 4, scale: 1.2 },
    { characterId: 5, scale: 1.2 },
  ];
  const config: Phaser.Types.Core.GameConfig = {
    transparent: true,
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
  const quotes: Quote[] = [
    { name: "Breezy", text: "The turtle will die." },
    { name: "TR3", text: "Smashed." },
  ];

  const onClickStartStartButton = () => {
    // pauseSound.play();
    // pauseSound();
    startSound();
    setWebState("play");
    let players = [...smashConfig.players];
    let newPlayers: { characterId: CharacterId; scale: number }[] = [];
    buttonsOnOff.forEach((button, buttonIndex) => {
      if (button.state) {
        newPlayers.push({
          characterId: players[buttonIndex].characterId as CharacterId,
          scale: players[buttonIndex].scale,
        });
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
    blipSound();
    let buttons = [...buttonsOnOff];
    let button = buttons[playerIndex];
    button.state = flipState;
    setButtonsOnOff([...buttons]);
  };

  const onClickStartRotateSelection = (playerIndex: number): void => {
    // console.log("isPlaying", isPlaying);
    // console.log("monkeysMusic", monkeysMusic);
    // console.log("stop", stop);
    // if (isPlaying) {
    //   monkeysMusic();
    // }
    // monkeysMusic();
    // playMonkeyMusicStartScreen();
    blipSound();
    let choices = [...smashConfig.players];
    let choice = choices[playerIndex];
    choice.characterId =
      choice.characterId + 1 < 6 ? choice.characterId + 1 : 0;
    let tempScale = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.scale;
    choice.scale = tempScale ? tempScale : 1;
    setSmashConfig({ players: [...choices] });
  };

  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥
  // 🏴‍☠️🏳️🏁🏴
  // 🔴🟠🟡🟢🔵🟣🟤⚫⚪

  const [showRulesN64, setShowRulesN64] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showControllers, setShowControllers] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // const playMonkeyMusicStartScreen = (): void => {
  //   if (!isPlaying) {
  //     monkeysMusicPlay();
  //   }
  // };

  useEffect(() => {}, []);
  // useEffect(() => {}, [webState, showRulesN64, showControls, showAbout]);

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
    blipSound();
    // clickSoundParent();

    setShowControls(false);
    setShowControllers(false);
    setShowRulesN64(false);
    setShowAbout(false);
    setShowHistory(false);
  };

  const onClickPlayNavButtons = (buttonName: ButtonName) => {
    blipSound();
    // clickSoundParent();
    clickPauseParent();

    switch (buttonName) {
      case "Back":
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "ReStart":
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "Controls":
        setShowControls(!showControls);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "Controllers":
        setShowControls(false);
        setShowControllers(!showControllers);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "Rules-N64":
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(!showRulesN64);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case "About":
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(!showAbout);
        setShowHistory(false);
        break;
      case "History":
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(!showHistory);
        break;
      default:
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
    }
  };

  return (
    <div className="overDiv">
      {/* <audio src={monkeysMusic} ref={monkeysMusic} /> */}
      {webState !== "start" && (
        <div className="loader">
          <div className="loader-inner">
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
          </div>
          <img className="loadingTable" src="/images/table.png" alt="table" />
          <p className="firstLoaderP">{quotes[0].text}</p>
          <p>- {quotes[0].name}</p>
        </div>
      )}
      <div className="phaser-container" id="phaser-container"></div>
      {webState === "start" && (
        <div className="startClassDiv">
          <div className="startTitle">
            {/* <h1>Title</h1> */}
            <img src="images/smashTitle.png" alt="smash title" />
          </div>
          <div className="playerChoices">
            {smashConfig.players.map((cPlayer, cPlayerIndex) => {
              return (
                <div className="playerChoice" key={cPlayerIndex}>
                  <div
                    className="playerChar"
                    onClick={() => {
                      onClickStartRotateSelection(cPlayerIndex);
                    }}
                  >
                    {buttonsOnOff[cPlayerIndex].state && (
                      <div className="startImageWrapper">
                        <img
                          className="startImage"
                          src={
                            "images/character_" +
                            cPlayer.characterId.toString() +
                            "_cropped.png"
                          }
                          // style={{ transform: Scale({cPlayer.scale}) }}
                          // height={`100 * cPlayer.scale`}
                          width={(50 * cPlayer.scale).toString() + "%"}
                          // width={`120`}
                          // width={{cPlayer.scale}  * 2}
                          alt="char"
                        />
                      </div>
                    )}
                  </div>
                  {buttonsOnOff[cPlayerIndex].state && (
                    <button
                      className="btn btn-success px-4"
                      onClick={() => {
                        onClickStartOnOffButtons(cPlayerIndex, false);
                      }}
                    >
                      ON
                    </button>
                  )}
                  {!buttonsOnOff[cPlayerIndex].state && (
                    <button
                      className="btn btn-danger px-4"
                      onClick={() => {
                        onClickStartOnOffButtons(cPlayerIndex, true);
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
            className="startButton btn btn-primary px-2"
            onClick={onClickStartStartButton}
          >
            START
          </button>
        </div>
        // <Link to={"/play"} className="playLink"></Link>
      )}

      <div className="overDiv">
        <div className="top-bar">
          {webState === "start" && (
            <button
              className="linkTag btn btn-outline-light"
              onClick={() => {
                onClickPlayNavButtons("Controllers");
              }}
            >
              <span>Controllers</span>
            </button>
          )}
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
                const myGameX = myGame.current.scene.keys.game as Game;

                let newSmashConfig = JSON.parse(
                  JSON.stringify(myGameX.smashConfig)
                );
                myGame.current.destroy(true);
                myGame.current = new Phaser.Game(config);
                myGame.current.registry.set("parentContext", Play);
                myGame.current.registry.set("smashConfig", newSmashConfig);
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
          {webState === "start" && (
            <button
              className="linkTag btn btn-outline-light"
              onClick={() => {
                onClickPlayNavButtons("History");
              }}
            >
              <span>History</span>
            </button>
          )}
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
        {showControllers && (
          <div>
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody("Controllers");
              }}
            >
              <h1>Controllers</h1>
              <p>You need at least two, ideally 4 controllers to play.</p>
              <p>Some types of conotrollers don't work yet.</p>
              <a
                className="linkTag btn btn-outline-light"
                href="https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/"
              >
                {/* <h4>See Other Projects</h4> */}
                <span>Example: (2) SNES Controllers $12</span>
              </a>
              <a
                className="linkTag btn btn-outline-light"
                href="https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/"
              >
                {/* <h4>See Other Projects</h4> */}
                <span>Suggested: USB Hub/Extension $13</span>
              </a>

              <h1>🚧</h1>
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
                As referenced on the Rules-N64 sheet, (Chemon) Smashed was
                invented in Glen Carbon, Illinois (near St. Louis) some time in
                late 2009 by a group of college kids at the "Chemon" House.
                Since 2013, "The Young Boys" have been keeping it alive &
                thriving in St. Louis.
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
