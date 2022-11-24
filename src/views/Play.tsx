import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import Game from '../scenes/Game';
import '../App.css';
import '@fontsource/press-start-2p';
import { ButtonName, CharacterMove } from '../App';
import { setGameState } from '../scenes/helpers/state';
import useSound from 'use-sound';
// import { useGamepads } from 'react-gamepads';

// import { Howl } from "howler";
// import { Howl, HowlOptions, HowlCallback, HowlErrorCallback } from "howler";

// import ReactHowler from 'react-howler';

// @ts-ignore
import importedWoah from '../sounds/BlackBetty_Woah.mp3';
// @ts-ignore
import importedBambalam from '../sounds/BlackBetty_Bambalam.mp3';
// @ts-ignore
import importedTrance from '../sounds/trance.wav';
// @ts-ignore
import importedStartSound from '../sounds/start.wav';
// @ts-ignore
import importedBlipSound from '../sounds/game-start-liquid.wav';
import {
  CharacterId,
  CharacterName,
  Debug,
  PlayerConfig,
  Quote,
  WebState,
} from './ViewInterfaces';
import { InputType } from '../scenes/interfaces';

function Play() {
  let myPhaser: any = useRef(null);

  // const [gamePads, setGamePads] = useState<any[]>([]);

  // useGamepads((pad) => {
  //   setGamePads(Object.values(pad));
  // });

  const trance = new Audio(importedTrance);
  trance.volume = 0.3;
  const [woah] = useSound(importedWoah, { volume: 0.2 });
  const [bam] = useSound(importedBambalam, { volume: 0.2 });
  const [startSound] = useSound(importedStartSound, { volume: 0.4 });
  const [blipSound] = useSound(importedBlipSound, { volume: 0.2 });
  const [numClicks, setNumClicks] = useState(0);
  const [webState, setWebState] = useState<WebState>('start');
  const [showLoader, setShowLoader] = useState(false);
  const [buttonsOnOff, setButtonsOnOff] = useState([
    { state: false },
    { state: true },
    { state: true },
    { state: false },
  ]);

  const inputTypeConfig: InputType[] = [
    'wasd',
    'arrows',
    'snes',
    's-wired',
    's-pro',
  ];
  const inputEmojiConfig: string[] = ['⌨️​', '⌨️​', '🎮', '🎮', '🎮'];

  const [smashConfig, setSmashConfig] = useState({
    players: [
      {
        characterId: 2,
        scale: 1,
        name: 'Pikachu',
        inputIndex: 2,
        inputType: 'snes',
        inputEmoji: '🎮',
      },
      {
        characterId: 0,
        scale: 0.9,
        name: 'Mario',
        inputIndex: 0,
        inputType: 'wasd',
        inputEmoji: '⌨️​',
      },
      {
        characterId: 1,
        scale: 0.9,
        name: 'Link',
        inputIndex: 1,
        inputType: 'arrows',
        inputEmoji: '⌨️​',
      },
      {
        characterId: 3,
        scale: 0.7,
        name: 'Kirby',
        inputIndex: 2,
        inputType: 'snes',
        inputEmoji: '🎮',
      },
    ],
  });

  const smashConfigScaleArray: PlayerConfig[] = [
    { characterId: 0, scale: 0.9, name: 'Mario' },
    { characterId: 1, scale: 0.9, name: 'Link' },
    { characterId: 2, scale: 1, name: 'Pikachu' },
    { characterId: 3, scale: 0.7, name: 'Kirby' },
    { characterId: 4, scale: 1.2, name: 'Chez' },
    { characterId: 5, scale: 1.2, name: 'BlackChez' },
  ];
  const config: Phaser.Types.Core.GameConfig = {
    transparent: true,
    title: 'Smashed',
    antialias: true,
    pixelArt: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920,
      height: 1080,
    },
    type: Phaser.AUTO,
    parent: 'phaser-container',
    backgroundColor: '#00000055',
    input: {
      gamepad: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 3000 },
        debug: false,
      },
    },
    scene: [Game],
  };
  let setTimeoutQuotesLengthStart: number = 2000;
  let setTimeoutQuotesLengthReStart: number = 1500;
  const [quotesRandomNumber, setQuotesRandomNumber] = useState(0);
  const quotes: Quote[] = [
    { name: 'Breezy', text: 'The turtle will die.' },
    // { name: 'Breezy', text: 'Oh, is it? Oh cool. Ur soo cool.' },
    // { name: 'Lau', text: "I'm sorry, I didn't know it was gonna happen." },
    { name: 'TR3', text: 'Smashed.' },
    {
      name: 'TR3',
      text: 'How am I supposed to make more than that... shit... happen?',
    },
    // { name: 'Chadams', text: 'AAAYYYUUUGGGGHHHH!!' },
    { name: 'Chadams', text: 'Two shots... two shots.' },
    // { name: 'Chadams', text: 'Spike Enerjeaoah.' },
    // { name: 'Chadams', text: "Stop breakin' shit." },
    // { name: 'Chadams', text: 'Is there no one else?' },
    { name: 'Eddie-Z', text: "He'll do it again, yeah!" },
    // { name: 'Deen Davis Jr.', text: 'VIDEOTAPE MA-SELF FUCKIN YOU UP!' },
    {
      name: 'DDj',
      text: "It's safe to say we're not going to the bars tonite.",
    },
    {
      name: 'DDj',
      text: '...yes you are.',
    },
    // {
    //   name: 'DDj',
    //   text: 'I can fight you one-handed.',
    // },
    // {
    //   name: 'DDj',
    //   text: 'I thought you put Spike in there.',
    // },
    // { name: "Gin", text: "Clean it up, and we'll do it again." },
    // { name: 'Ginman', text: "Set it up... and we'll do it... again." },
    // { name: 'Gin', text: 'Shitty, shitty-fuckin-ass.' },
  ];
  const debug: Debug = {
    setLevel: 5, //012345
    setDurationMinutes: 7, //01234567
    setUpdateLoopsNumSkip: 2, // 012
    setMusicNumber: 2, // 012
    setMusicActive: true,
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
    setLoadTimeExtra: true,
    setChezSecret: true,
    setIsDevMode: false,
  };
  const onClickStartStartButton = () => {
    trance.pause();
    startSound();
    setWebState('play');

    let players = [...smashConfig.players];
    let newPlayers: {
      name: CharacterName;
      characterId: CharacterId;
      scale: number;
      inputType: InputType;
    }[] = [];
    buttonsOnOff.forEach((button, buttonIndex) => {
      if (button.state) {
        newPlayers.push({
          name: players[buttonIndex].name as CharacterName,
          characterId: players[buttonIndex].characterId as CharacterId,
          scale: players[buttonIndex].scale,
          inputType: players[buttonIndex].inputType as InputType,
        });
      }
    });
    let newSmashConfig = { players: [...newPlayers] };
    setQuotesRandomNumber(Math.floor(Math.random() * quotes.length));

    if (!debug.setLoadTimeExtra || debug.setIsDevMode) {
      setTimeoutQuotesLengthStart = 0;
    }
    setTimeout(() => {
      myPhaser.current = new Phaser.Game(config);
      myPhaser.current.registry.set('parentContext', Play);
      myPhaser.current.registry.set('smashConfig', newSmashConfig);
      myPhaser.current.registry.set('debug', debug);
    }, setTimeoutQuotesLengthStart);

    setShowLoaderIntervalFunction();
  };

  const setShowLoaderIntervalFunction = () => {
    setShowLoader(true);
    const myInterval = setInterval(() => {
      console.log(
        'myPhaser.current?.scene?.keys?.game?.loaded',
        myPhaser?.current?.scene?.keys?.game?.loaded
      );
      if (myPhaser?.current?.scene?.keys?.game?.loaded) {
        setTimeout(
          () => {
            setShowLoader(false);
          },
          debug.setIsDevMode ? 0 : 20
        );
        clearInterval(myInterval);
      }
    }, 20);
  };

  // useEffect(() => {
  //   console.log(
  //     'useEffect',
  //     'chonk',
  //     'myPhaser?.current?.scene?.keys?.game?.loaded',
  //     myPhaser?.current?.scene?.keys?.game?.loaded
  //   );
  //   if (myPhaser?.current?.scene?.keys?.game?.loaded) {
  //     setTimeout(
  //       () => {
  //         setShowLoader(false);
  //       },
  //       debug.setIsDevMode ? 0 : 20
  //     );
  //   }
  // }, [
  //   myPhaser,
  //   myPhaser.current.scene,
  //   myPhaser.current.scene.keys,
  //   myPhaser.current.scene.keys.game,
  //   myPhaser.current.scene.keys.game.loaded,
  //   debug.setIsDevMode,
  // ]);

  const onClickRotateInput = (index: number): void => {
    let newPlayers = [...smashConfig.players];
    newPlayers[index].inputIndex + 1 > inputTypeConfig.length - 1
      ? (newPlayers[index].inputIndex = 0)
      : newPlayers[index].inputIndex++;
    newPlayers[index].inputType = inputTypeConfig[newPlayers[index].inputIndex];
    newPlayers[index].inputEmoji =
      inputEmojiConfig[newPlayers[index].inputIndex];
    setSmashConfig({ players: [...newPlayers] });
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

  const bamPlay = (): void => {
    bam();
  };
  const woahPlay = (): void => {
    woah();
  };

  let playNumber = useRef(0);

  const trancePlay = (): void => {
    if (playNumber.current === 0) {
      playNumber.current += 1;
      trance.play();
      trance.addEventListener(
        'ended',
        () => {
          setFirstCharacterSlot(4);
        },
        { once: true }
      );
    }
  };
  const trancePause = (): void => {
    trance.pause();
  };

  const setFirstCharacterSlot = (charId: number): void => {
    if (!debug.setChezSecret || webState === 'play') {
      return;
    }
    if (charId === 4) {
      bamPlay();
      onClickStartOnOffButtons(0, true);
    }
    if (charId === 5) {
      woahPlay();
      onClickStartOnOffButtons(0, true);
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
    choice.name = tempName ? tempName : '';
    setSmashConfig({ players: [...choices] });
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
    choice.name = tempName ? tempName : '';
    setSmashConfig({ players: [...choices] });
  };

  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥​➡️​⌨️​⌨
  // 🏴‍☠️🏳️🏁🏴
  // 🔴🟠🟡🟢🔵🟣🟤⚫⚪
  // ⌨🎮

  const [showRulesN64, setShowRulesN64] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showControllers, setShowControllers] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const characterMoves: CharacterMove[] = [
    { button: 'D-Pad', move: 'Movement', status: '✔️' },
    { button: 'Ground + X', move: 'Jump', status: '✔️' },
    { button: 'Air + X', move: 'Jump-Air', status: '✔️' },
    { button: 'Air + D-Pad + A', move: 'Jump-Fire', status: '🚧' },
    { button: 'Y', move: 'Attack-Energy', status: '✔️' },
    { button: 'B', move: 'Attack-Physical', status: '🚧' },
    { button: 'Forward + B', move: 'Attack-Smash', status: '🔜' },
    { button: 'Air + Wall + Forward', move: 'Slide-Wall', status: '✔️' },
    { button: 'L + R', move: 'Pause', status: '✔️' },
    { button: 'Paused + Any Button', move: 'Ready', status: '✔️' },
    { button: 'Paused + All Ready', move: 'UnPause', status: '✔️' },
  ];

  const clickPauseParent = () => {
    if (webState === 'play') {
      if (
        !(
          myPhaser.current.scene.keys.game.gameState.name ===
            'game-state-paused' ||
          myPhaser.current?.scene?.keys?.game.gameState.name ===
            'game-state-first-blood' ||
          myPhaser.current?.scene?.keys?.game.gameState.name ===
            'game-state-screen-clear'
        )
      ) {
        setGameState(myPhaser.current?.scene?.keys?.game, 'game-state-paused');
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
      case 'Back':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case 'ReStart':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case 'Controls':
        setShowControls(!showControls);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case 'Controllers':
        setShowControls(false);
        setShowControllers(!showControllers);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case 'Rules-N64':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(!showRulesN64);
        setShowAbout(false);
        setShowHistory(false);
        break;
      case 'About':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(!showAbout);
        setShowHistory(false);
        break;
      case 'History':
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

  const [clockTime, setClockTime] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [clockGame, setClockGame] = useState({
    minutes: 0,
    seconds: 0,
  });

  const componentPseudoLoad = useRef(true);
  const intervalClock: any = useRef(null);

  return (
    <div className="overDiv">
      {webState !== 'start' && showLoader && (
        <div className="loader">
          {quotesRandomNumber % 2 === 0 && (
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
            </div>
          )}
          {quotesRandomNumber % 2 !== 0 && (
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
          )}
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
      {webState === 'start' && (
        <div className="startClassDiv">
          <div className="startTitleWrapper2">
            <div className="startTitleWrapper1">
              <div
                className="startTitle"
                onMouseDown={trancePlay}
                onMouseUp={trancePause}
              >
                {/* <img src="images/smashTitle.png" alt="smash title" /> */}
                <img src="images/smashed-gif-cropped.gif" alt="smash title" />
                <h1>SMASHED</h1>
              </div>
            </div>
          </div>
          {!debug.setIsDevMode && <div className="black-hiding-div"></div>}
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
                          className={
                            'startImage' +
                            (cPlayerIndex > 1 ? 'Inverse' : 'Normal')
                          }
                          src={
                            'images/character_' +
                            cPlayer.characterId.toString() +
                            '_cropped.png'
                          }
                          width={(55 * cPlayer.scale).toString() + '%'}
                          alt="char"
                        />
                      </div>
                    )}
                  </div>
                  {/* {buttonsOnOff[cPlayerIndex].state && (
                    <button
                      className="b-dark d-flex flex-row justify-content-between align-items-center"
                      onClick={() => {
                        onClickRotateInput(cPlayerIndex);
                      }}
                    >
                      <div className="center-my-children-small">
                        <span id="button-input-emoji">{cPlayer.inputEmoji} </span>
                      </div>
                      <div className="center-my-children-big">
                        <span id="button-input-name">&nbsp; {cPlayer.inputType}</span>
                      </div>
                    </button>
                  )} */}
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
                      <span>Off</span>
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
      )}

      <div className="overDiv">
        <div className="top-bar">
          <img
            className="question-mark"
            src="/images/qblack_trans.png"
            alt="question mark"
          />
          {webState === 'start' && (
            <button
              className="linkTag b-top"
              onClick={() => {
                onClickPlayNavButtons('Controllers');
              }}
            >
              {showControllers && <span>...........</span>}
              {!showControllers && <span>Controllers</span>}
            </button>
          )}
          {webState !== 'start' && (
            <button
              className="linkTag b-top"
              onClick={() => {
                if (myPhaser?.current?.scene?.keys?.game) {
                  myPhaser.current.scene.keys.game.loaded = false;
                }
                onClickPlayNavButtons('Back');
                setWebState('start');
                setNumClicks(numClicks + 1);
                clearInterval(intervalClock.current);
                intervalClock.current = null;
                componentPseudoLoad.current = true;
                myPhaser.current.destroy(true);
              }}
            >
              <span>Back</span>
            </button>
          )}
          {webState !== 'start' && (
            <button
              className="linkTag b-top"
              onClick={() => {
                if (myPhaser?.current?.scene?.keys?.game?.loaded) {
                  startSound();
                  myPhaser.current.scene.keys.game.loaded = false;
                  setShowLoaderIntervalFunction();
                  onClickPlayNavButtons('ReStart');
                  setQuotesRandomNumber(
                    Math.floor(Math.random() * quotes.length)
                  );

                  let newSmashConfig = JSON.parse(
                    JSON.stringify(
                      myPhaser.current?.scene?.keys?.game.smashConfig
                    )
                  );
                  let newDebug = JSON.parse(
                    JSON.stringify(myPhaser.current?.scene?.keys?.game.debug)
                  );
                  clearInterval(intervalClock.current);
                  intervalClock.current = null;
                  componentPseudoLoad.current = true;
                  myPhaser.current.destroy(true);

                  if (!debug.setLoadTimeExtra) {
                    setTimeoutQuotesLengthReStart = 0;
                  }
                  setTimeout(() => {
                    myPhaser.current = new Phaser.Game(config);
                    myPhaser.current.registry.set('parentContext', Play);
                    myPhaser.current.registry.set(
                      'smashConfig',
                      newSmashConfig
                    );
                    myPhaser.current.registry.set('debug', newDebug);
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
              onClickPlayNavButtons('Controls');
            }}
          >
            {showControls && <span>........</span>}
            {!showControls && <span>Controls</span>}
          </button>
          <button
            className="linkTag b-top"
            onClick={() => {
              onClickPlayNavButtons('Rules-N64');
            }}
          >
            {showRulesN64 && <span>.........</span>}
            {!showRulesN64 && <span>Rules-N64</span>}
          </button>
          {webState === 'start' && (
            <button
              className="linkTag b-top"
              onClick={() => {
                onClickPlayNavButtons('History');
              }}
            >
              {showHistory && <span>.......</span>}
              {!showHistory && <span>History</span>}
            </button>
          )}
          <button
            className="linkTag b-top"
            onClick={() => {
              onClickPlayNavButtons('About');
            }}
          >
            {showAbout && <span>.....</span>}
            {!showAbout && <span>About</span>}
          </button>
        </div>
        {showControls && (
          <div className="overDiv">
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody('Controls');
              }}
            >
              <h1>Controls</h1>
              <div id="controls-col">
                {characterMoves.map((charMove, charMoveIndex) => {
                  return (
                    <div id="move" key={charMoveIndex}>
                      <h5>{charMove.move}</h5>
                      <h5>
                        {charMove.button} {charMove.status}
                      </h5>
                    </div>
                  );
                })}
                {/* <p> fyi, button mapping is insane</p> */}
                <div id="keyboard">
                  <h3>P1 Keyboard</h3>
                  <p>(Left-Side)</p>
                  <p>D-Pad: W-A-S-D</p>
                  <p>A-B-X-Y: F-G-H-SPACE</p>
                  <p>L-R: T-Y</p>
                </div>
                <div id="keyboard">
                  <h3>P2 Keyboard</h3>
                  <p>(Right-Side)</p>
                  <p>D-Pad: Arrows</p>
                  <p>A-B-X-Y: 1-2-3-0</p>
                  <p>L-R: 5-6</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {showRulesN64 && (
          <div>
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody('Rules-N64');
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
                onClickPlayNavBody('Controllers');
              }}
            >
              <h1>Controllers</h1>
              {/* <h1>🚧</h1> */}
              <p>USB controllers are recommended. </p>
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
                <span>Amazon: USB Hub/Extension $13</span>
              </a>
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
                onClickPlayNavBody('About');
              }}
            >
              <h1>About</h1>
              <p>
                Since the inception in 2009, Niemo has been actively persuing
                the fundamental polished essense of Smashed; both as an exercise
                of logic, and such that one day it could be realized as a fully
                functional, independent game.
              </p>
              <p>
                The rules are described - and this is the start of that game -
                on github - such that it may live on and be expanded upon.
              </p>
              <p>
                IMO, the primary rule "Screen Clear" is what makes these rules
                stand out from other smash drinking games; this rule pushes a
                player to actively time their own death rather than just try to
                not die.
              </p>
              <p>
                Assets & sounds that you don't immediately recognize are
                probably OC.
              </p>
              <h4>Tech Used</h4>
              <ul>
                <li>Phaser 3</li>
                <li>ReactTS 17</li>
                <li>Bootstrap 5</li>
                <li
                  onMouseDown={() => {
                    console.log('MOUSE ENTER');
                    setFirstCharacterSlot(5);
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
                  console.log('MOUSE DOWN');
                  setFirstCharacterSlot(5);
                }}
              />
              <p>by NIEMBRO64</p>
              <a className="linkTag btn btn-dark" href="http://niembro64.com/">
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
                onClickPlayNavBody('History');
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
      {webState === 'play' && myPhaser.current?.scene?.keys?.game?.loaded && (
        <div className="game-bar">
          <div className="game-bar-time">
            <p>
              {clockTime.minutes}:
              {clockTime.seconds < 10
                ? '0' + clockTime.seconds.toString()
                : clockTime.seconds}
            </p>
            <h1>
              {clockGame.minutes}:
              {clockGame.seconds < 10
                ? '0' + clockGame.seconds.toString()
                : clockGame.seconds}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;
