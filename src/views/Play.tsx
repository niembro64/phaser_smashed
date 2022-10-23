import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
import "@fontsource/press-start-2p";
import { ButtonName, CharacterMove } from "../App";
import { setGameState } from "../scenes/helpers/state";
import useSound from "use-sound";

// @ts-ignore
import importedSpecial12Sound from "../sounds/special-m12.wav";
// @ts-ignore
import importedSpecial5Sound from "../sounds/special-m5.wav";
// @ts-ignore
import importedStartSound from "../sounds/start.wav";
// @ts-ignore
import importedBlipSound from "../sounds/game-start-liquid.wav";
// import { playerGrabAttackEnergy } from "../scenes/helpers/pad";
// import { BooleanSchemaDefinition } from "mongoose";

export type CharacterId = 0 | 1 | 2 | 3 | 4 | 5;

export type CharacterName =
  | "Mario"
  | "Link"
  | "Pikachu"
  | "Kirby"
  | "Chez"
  | "BlackChez";

export interface SmashConfig {
  players: PlayerConfig[];
}

export interface SmashConfigScale {
  name: CharacterName;
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

export interface Debug {
  setLevel: number;
  setDurationMinutes: number;
  setMusicNumber: number;
  setMusicActive: boolean;
  setUpdateLoopsNumSkip: number;
  setFrictionAirActive: boolean;
  setCamerasActive: boolean;
  setCamerasVisible: boolean;
  setCollidersPvP: boolean;
  setCollidersPvAttackPhysical: boolean;
  setCollidersPvAttackEnergy: boolean;
  setCollidersAEvAE: boolean;
  setCollidersAEvAP: boolean;
  setAEWrapScreen: boolean;
  setPlayerIdVisible: boolean;
  setPlayerIdFiltersActive: boolean;
  setWallJumpsActive: boolean;
  setDefaultDamage: boolean;
  setDefaultHitback: boolean;
  setReadySoundActive: boolean;
  setHealthInverted: boolean;
  setMatricesAlwaysVisible: boolean;
  setPrintControllerButtonsConsole: boolean;
  setPrintControllerConnectedConsole: boolean;
  setLoadTimeExtra: boolean;
  setChezSecret: boolean;
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
  const [special12Sound] = useSound(importedSpecial12Sound, { volume: 0.2 });
  const [special5Sound] = useSound(importedSpecial5Sound, { volume: 0.2 });
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
  const [showLoader, setShowLoader] = useState(false);
  const [buttonsOnOff, setButtonsOnOff] = useState([
    { state: true },
    { state: true },
    { state: true },
    { state: true },
  ]);
  const [smashConfig, setSmashConfig] = useState({
    players: [
      { characterId: 0, scale: 0.9, name: "Mario" },
      { characterId: 1, scale: 0.9, name: "Link" },
      { characterId: 2, scale: 1, name: "Pikachu" },
      { characterId: 3, scale: 0.7, name: "Kirby" },
    ],
  });

  const smashConfigScaleArray: SmashConfigScale[] = [
    { characterId: 0, scale: 0.9, name: "Mario" },
    { characterId: 1, scale: 0.9, name: "Link" },
    { characterId: 2, scale: 1, name: "Pikachu" },
    { characterId: 3, scale: 0.7, name: "Kirby" },
    { characterId: 4, scale: 1.2, name: "Chez" },
    { characterId: 5, scale: 1.2, name: "BlackChez" },
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
        // debug: true,
      },
    },
    scene: [Game],
  };
  let setTimeoutQuotesLengthStart: number = 2000;
  let setTimeoutQuotesLengthReStart: number = 1500;
  // const setTimeoutQuotesLength: number = 1000;
  const [quotesRandomNumber, setQuotesRandomNumber] = useState(0);
  const quotes: Quote[] = [
    { name: "Breezy", text: "The turtle will die." },
    // { name: "Breezy", text: "Oh, is it? Oh cool. Ur soo cool." },
    // { name: "Lau", text: "I'm sorry, I didn't know it was gonna happen." },
    { name: "TR3", text: "Smashed." },
    {
      name: "TR3",
      text: "How am I supposed to make more than that... shit... happen?",
    },
    // { name: "Chadams", text: "AAAYYYUUUGGGGHHHH!!" },
    { name: "Chadams", text: "Two shots... two shots." },
    // { name: "Chadams", text: "Spike Enerjeaoah." },
    // { name: "Chadams", text: "Stop breakin' shit." },
    // { name: "Chadams", text: "Is there no one else?" },
    { name: "Eddie-Z", text: "He'll do it again, yeah!" },
    // { name: "Deen Davis Jr.", text: "VIDEOTAPE MA-SELF FUCKIN YOU UP!" },
    {
      name: "DDj",
      text: "It's safe to say we're not going to the bars tonite.",
    },
    {
      name: "DDj",
      text: "...yes you are.",
    },
    // {
    //   name: "DDj",
    //   text: "I can fight you one-handed.",
    // },
    // {
    //   name: "DDj",
    //   text: "I thought you put Spike in there.",
    // },
    // { name: "Gin", text: "Clean it up, and we'll do it again." },
    { name: "Ginman", text: "Set it up... and we'll do it... again." },
    // { name: "Gin", text: "Shitty, shitty-fuckin-ass." },
  ];
  const debug: Debug = {
    setLevel: 5, //012345
    setDurationMinutes: 7, //01234567
    setUpdateLoopsNumSkip: 2, // 012
    setMusicNumber: 2, // 012
    setMusicActive: false,
    setReadySoundActive: false,
    setFrictionAirActive: true,
    setCamerasActive: true,
    setCamerasVisible: false,
    setCollidersPvP: false,
    setCollidersPvAttackPhysical: false,
    setCollidersPvAttackEnergy: false,
    setCollidersAEvAE: true,
    setCollidersAEvAP: true,
    setAEWrapScreen: false,
    setPlayerIdVisible: true,
    setWallJumpsActive: true,
    setDefaultDamage: false,
    setDefaultHitback: false,
    setPlayerIdFiltersActive: false,
    setHealthInverted: false,
    setMatricesAlwaysVisible: false,
    setPrintControllerButtonsConsole: false,
    setPrintControllerConnectedConsole: false,
    setLoadTimeExtra: false,
    setChezSecret: true,
  };
  const onClickStartStartButton = () => {
    // pauseSound.play();
    // pauseSound();
    startSound();
    setWebState("play");
    let players = [...smashConfig.players];
    let newPlayers: {
      name: CharacterName;
      characterId: CharacterId;
      scale: number;
    }[] = [];
    buttonsOnOff.forEach((button, buttonIndex) => {
      if (button.state) {
        newPlayers.push({
          name: players[buttonIndex].name as CharacterName,
          characterId: players[buttonIndex].characterId as CharacterId,
          scale: players[buttonIndex].scale,
        });
      }
    });
    let newSmashConfig = { players: [...newPlayers] };
    setQuotesRandomNumber(Math.floor(Math.random() * quotes.length));

    if (!debug.setLoadTimeExtra) {
      setTimeoutQuotesLengthStart = 0;
    }
    setTimeout(() => {
      myGame.current = new Phaser.Game(config);
      myGame.current.registry.set("parentContext", Play);
      myGame.current.registry.set("smashConfig", newSmashConfig);
      myGame.current.registry.set("debug", debug);
    }, setTimeoutQuotesLengthStart);

    setShowLoaderIntervalFunction();
  };

  const setShowLoaderIntervalFunction = () => {
    setShowLoader(true);
    const myInterval = setInterval(() => {
      console.log(
        "myGame?.current?.scene?.keys?.game?.loaded",
        myGame?.current?.scene?.keys?.game?.loaded
      );
      if (myGame?.current?.scene?.keys?.game?.loaded) {
        setShowLoader(false);
        clearInterval(myInterval);
      }
    }, 100);
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

  const setAllCharacter = (charId: number) => {
    // startSound();
    // specialSound();
    if (!debug.setChezSecret || webState === "play") {
      return;
    }
    if (charId === 4) {
      special5Sound();
    }
    if (charId === 5) {
      special12Sound();
    }
    let choices = [...smashConfig.players];
    let choice = choices[0];
    choice.characterId = charId;
    let tempScale = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.scale;
    let tempName = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.name;
    choice.scale = tempScale ? tempScale : 1;
    choice.name = tempName ? tempName : "";
    setSmashConfig({ players: [...choices] });
    // for (let i = 0; i < 4; i++) {}
  };

  const onClickStartRotateSelection = (playerIndex: number): void => {
    blipSound();
    let choices = [...smashConfig.players];
    let choice = choices[playerIndex];
    if (debug.setChezSecret) {
      choice.characterId =
        choice.characterId + 1 < 4 ? choice.characterId + 1 : 0;
    } else {
      choice.characterId =
        choice.characterId + 1 < 6 ? choice.characterId + 1 : 0;
    }
    let tempScale = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.scale;
    let tempName = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.name;
    choice.scale = tempScale ? tempScale : 1;
    choice.name = tempName ? tempName : "";
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
    { button: "All Players Ready", move: "UnPause", ready: "✔️" },
  ];

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

    setShowControls(false);
    setShowControllers(false);
    setShowRulesN64(false);
    setShowAbout(false);
    setShowHistory(false);
  };

  const onClickPlayNavButtons = (buttonName: ButtonName) => {
    blipSound();
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

  useEffect(() => {
    console.log(
      "SECONDS",
      myGame?.current?.scene?.keys?.game?.gameClock?.seconds
    );
  }, [myGame?.current?.scene?.keys?.game?.timeSeconds]);

  return (
    <div className="overDiv">
      {/* <audio src={importedMonkeysMusic} ref={importedMonkeysMusic} /> */}

      {webState !== "start" && showLoader && (
        <div className="loader">
          {/* <div className="loader-inner">
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
          </div> */}
          <div className="spinnerShrink">
            <div className="spinnerOuterOuter">
              <div className="spinnerOuter">
                <div className="spinner">
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                  <div className="cube_side">
                    <div className="cube_side_inside"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="loading-table-wrapper">
            <img
              className="loading-table"
              src="/images/table.png"
              alt="table"
            />
          </div>
          <p className="firstLoaderP">{quotes[quotesRandomNumber].text}</p>
          <p className="secondLoaderP">- {quotes[quotesRandomNumber].name}</p>
        </div>
      )}
      <div className="phaser-container" id="phaser-container"></div>
      {webState === "start" && (
        <div className="startClassDiv">
          <div className="startTitleWrapper2">
            <div className="startTitleWrapper1">
              <div className="startTitle">
                {/* <img src="images/smashTitle.png" alt="smash title" /> */}
                <img
                  className="startGif"
                  src="images/smashed-gif-cropped.gif"
                  alt="smash title"
                />
                <h1>SMASHED</h1>
              </div>
            </div>
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
                          width={(50 * cPlayer.scale).toString() + "%"}
                          alt="char"
                        />
                      </div>
                    )}
                  </div>
                  {buttonsOnOff[cPlayerIndex].state && (
                    <button
                      className="b-dark px-4"
                      onClick={() => {
                        onClickStartOnOffButtons(cPlayerIndex, false);
                      }}
                    >
                      <span>{cPlayer.name}</span>
                    </button>
                  )}
                  {!buttonsOnOff[cPlayerIndex].state && (
                    <button
                      className="px-4 b-black"
                      onClick={() => {
                        onClickStartOnOffButtons(cPlayerIndex, true);
                      }}
                    >
                      <span>OFF</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button className="b-start" onClick={onClickStartStartButton}>
            <span>START</span>
          </button>
        </div>
        // <Link to={"/play"} className="playLink"></Link>
      )}

      <div className="overDiv">
        <div className="top-bar">
          <img
            className="question-mark"
            src="/images/qblack_trans.png"
            alt="question mark"
          />
          {webState === "start" && (
            <button
              className="linkTag b-top"
              onClick={() => {
                onClickPlayNavButtons("Controllers");
              }}
            >
              <span>Controllers</span>
            </button>
          )}
          {webState !== "start" && (
            <button
              className="linkTag b-top"
              onClick={() => {
                if (myGame?.current?.scene?.keys?.game) {
                  myGame.current.scene.keys.game.loaded = false;
                }
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
              className="linkTag b-top"
              onClick={() => {
                // if (myGame?.current?.scene?.keys?.game) {
                //   myGame.current.scene.keys.game.loaded = false;
                // }
                if (myGame?.current?.scene?.keys?.game?.loaded) {
                  startSound();
                  const myGameX = myGame.current.scene.keys.game as Game;
                  myGameX.loaded = false;
                  setShowLoaderIntervalFunction();
                  onClickPlayNavButtons("ReStart");
                  setQuotesRandomNumber(
                    Math.floor(Math.random() * quotes.length)
                  );

                  let newSmashConfig = JSON.parse(
                    JSON.stringify(myGameX.smashConfig)
                  );
                  let newDebug = JSON.parse(JSON.stringify(myGameX.debug));
                  myGame.current.destroy(true);

                  if (!debug.setLoadTimeExtra) {
                    setTimeoutQuotesLengthReStart = 0;
                  }
                  setTimeout(() => {
                    myGame.current = new Phaser.Game(config);
                    myGame.current.registry.set("parentContext", Play);
                    myGame.current.registry.set("smashConfig", newSmashConfig);
                    myGame.current.registry.set("debug", newDebug);
                  }, setTimeoutQuotesLengthReStart);
                }
              }}
            >
              <span>ReStart</span>
            </button>
          )}
          <button
            className="linkTag b-top"
            onClick={() => {
              onClickPlayNavButtons("Controls");
            }}
          >
            <span>Controls</span>
          </button>
          <button
            className="linkTag b-top"
            onClick={() => {
              onClickPlayNavButtons("Rules-N64");
            }}
          >
            <span>Rules-N64</span>
          </button>
          {webState === "start" && (
            <button
              className="linkTag b-top"
              onClick={() => {
                onClickPlayNavButtons("History");
              }}
            >
              <span>History</span>
            </button>
          )}
          <button
            className="linkTag b-top"
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
                  <div id="move" key={charMoveIndex}>
                    <h5>{charMove.move}</h5>
                    <h5>
                      {charMove.button} {charMove.ready}
                    </h5>
                  </div>
                );
              })}
              <span> fyi, button mapping is insane</span>
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
              {/* <h1>🚧</h1> */}
              <p>USB controllers are required. </p>
              <a
                className="linkTag btn btn-dark"
                href="https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/"
              >
                {/* <h4>See Other Projects</h4> */}
                <span>Amazon: (2) SNES Controllers $12</span>
              </a>
              <a
                className="linkTag btn btn-dark"
                href="https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/"
              >
                {/* <h4>See Other Projects</h4> */}
                <span>Amazon: USB Hub/Extension $13</span>
              </a>
              {/* <p>Some types of controllers don't work yet.</p> */}

              <div>
                <ul>
                  These work:
                  <li>✔️ iNNEXT SNES Wired USB</li>
                  <li>✔️ Nintendo Switch Pro</li>
                  <li>✔️ Nintendo Switch Wired</li>
                  <li>✔️ KIWITATA Wired N64 </li>
                  <li>✔️ Mekela NGC Wired Gamecube</li>
                </ul>
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
                <li>ReactTS 17</li>
                <li>Bootstrap 5</li>
                <li
                  onMouseDown={() => {
                    console.log("MOUSE ENTER");
                    setAllCharacter(5);
                  }}
                >
                  Press Start 2P
                </li>
              </ul>
              {/* <h1>🚧</h1> */}
              <img
                className="kirbyNiembro"
                src="./images/character_3_cropped.png"
                alt="kirby"
                onMouseDown={() => {
                  console.log("MOUSE DOWN");
                  setAllCharacter(4);
                }}
                // onMouseUp={() => {
                //   console.log("MOUSE UP");
                // }}
                // onMouseEnter={() => {
                //   console.log("MOUSE ENTER");
                //   setAllCharacter(5);
                // }}
                // onMouseLeave={() => {
                //   console.log("MOUSE LEAVE");
                // }}
              />
              <p>by NIEMBRO64</p>
              <a className="linkTag btn btn-dark" href="http://niembro64.com/">
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
