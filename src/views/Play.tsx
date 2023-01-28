import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import Game from '../scenes/Game';
import '../App.css';
import '@fontsource/press-start-2p';
import { setGameState } from '../scenes/helpers/state';
import useSound from 'use-sound';
import html2canvas from 'html2canvas';
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js';
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
  Debug,
  PlayerConfig,
  Quote,
  WebState,
  InputType,
  SmashConfig,
  ButtonName,
  CharacterMove,
  emoji,
  KeyboardGroup,
  WorkingController,
} from '../scenes/interfaces';
import { debugInit, debugMax } from '../debugOptions';

function Play() {
  let myPhaser: any = useRef(null);

  const space: string = '&nbsp';

  function captureScreenshot() {
    console.log('captureScreenshot');
    // Select the element that you want to capture a screenshot of
    const element = document.querySelector('#top-level');

    // Use html2canvas to capture a screenshot of the element
    html2canvas(element as HTMLElement).then((canvas) => {
      // Get a data URL representing the image
      const dataUrl = canvas.toDataURL();

      // Create an anchor element
      const link = document.createElement('a');

      // Set the href of the anchor element to the data URL
      link.href = dataUrl;

      // Set the download attribute of the anchor element
      link.download = 'screenshot.png';

      // Click the anchor element to trigger the download
      link.click();
    });
  }

  const [debug, setDebug] = useState<Debug>(debugInit);

  const trance = new Audio(importedTrance);
  trance.volume = 0.3;
  const [woah] = useSound(importedWoah, { volume: 0.2 });
  const [bam] = useSound(importedBambalam, { volume: 0.2 });
  const [startSound] = useSound(importedStartSound, { volume: 0.4 });
  const [blipSound] = useSound(importedBlipSound, { volume: 0.2 });
  const [numClicks, setNumClicks] = useState<number>(0);
  const [webState, setWebState] = useState<WebState>('start');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [inputArray, setInputArray] = useState<InputType[]>([2, 0, 0, 3]);

  const keyboardGroups: KeyboardGroup[][] = [
    [
      { left: 'D-Pad', right: 'W A S D' },
      { left: 'A X B Y', right: 'F G H Space' },
      { left: 'L Select Start R', right: 'R T Y U' },
    ],
    [
      { left: 'ArrowKeys', right: 'D-Pad' },
      { left: 'A X B Y', right: '4 5 6 Enter' },
      { left: 'L Select Start R', right: '7 8 9 +' },
    ],
  ];

  const [workingControllers, setWorkingControllers] = useState<
    WorkingController[]
  >([
    {
      name: 'Wired | SNES | iNNEXT',
      url: 'https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/',
    },
    {
      name: 'Wired | N64 | KIWITATA',
      url: 'https://www.amazon.com/gp/product/B08X677HR4/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1',
    },
    {
      name: 'Wired | GameCube | Mekela NGC',
      url: 'https://www.amazon.com/Mekela-5-8-foot-classic-controller-Windows/dp/B07GSSXS84/ref=sr_1_5?crid=3N3MSRPF8INFK&keywords=Mekela+5.8+feet+Classic+USB+wired+NGC+Controller&qid=1673335159&sprefix=mekela+5.8+feet+classic+usb+wired+ngc+controller%2Caps%2C68&sr=8-5',
    },
    {
      name: 'Wired | Switch | PowerA | Nintendo',
      url: 'https://www.amazon.com/gp/product/B07PDJ45BT/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1',
    },
    {
      name: 'Wireless | Switch | Pro | Nintendo',
      url: 'https://www.amazon.com/gp/product/B01NAWKYZ0/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1',
    },
  ]);

  const [smashConfig, setSmashConfig] = useState<SmashConfig>({
    players: [
      {
        characterId: 0,
        scale: 0.9,
        name: 'Mario',
      },
      {
        characterId: 7,
        scale: 0.6,
        name: 'RedKoopa',
      },
      {
        characterId: 6,
        scale: 0.6,
        name: 'GreenKoopa',
      },
      {
        characterId: 1,
        scale: 0.9,
        name: 'Link',
      },
    ],
  });

  // always keep Chez and BlackChez at positions 4 and 5
  const smashConfigScaleArray: PlayerConfig[] = [
    { characterId: 0, scale: 0.9, name: 'Mario' },
    { characterId: 1, scale: 0.9, name: 'Link' },
    { characterId: 2, scale: 1, name: 'Pikachu' },
    { characterId: 3, scale: 0.7, name: 'Kirby' },
    { characterId: 4, scale: 1.2, name: 'Chez' },
    { characterId: 5, scale: 1.2, name: 'BlackChez' },
    { characterId: 6, scale: 0.6, name: 'GreenKoopa' },
    { characterId: 7, scale: 0.6, name: 'RedKoopa' },
    { characterId: 8, scale: 0.6, name: 'BlueKoopa' },
  ];
  let config: Phaser.Types.Core.GameConfig = {
    plugins: {
      global: [
        {
          key: 'rexShakePosition',
          plugin: ShakePositionPlugin,
          start: true,
        },
      ],
    },
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
        debug: debug.DevMode,
      },
    },
    scene: [Game],
  };
  let setTimeoutQuotesLengthStart: number = 3000;
  let setTimeoutQuotesLengthReStart: number = 1500;
  const [quotesRandomNumber, setQuotesRandomNumber] = useState(0);
  const quotes: Quote[] = [
    { name: 'Breezy', text: 'The turtle will die.' },
    { name: 'TR3', text: 'Smashed.' },
    { name: 'Chadams', text: 'Two shots... two shots.' },
    { name: 'Eddie-Z', text: "He'll do it again, yeah!" },
    {
      name: 'TR3',
      text: 'How am I supposed to make more than that... shit... happen?',
    },
    {
      name: 'DDj',
      text: "It's safe to say we're not going to the bars tonite.",
    },
    {
      name: 'DDj',
      text: '...yes you are.',
    },
    // { name: 'Chadams', text: 'AAAYYYUUUGGGGHHHH!!' },
    // { name: 'Chadams', text: 'Spike Enerjeaoah.' },
    // { name: 'Chadams', text: "Stop breakin' shit." },
    // { name: 'Chadams', text: 'Is there no one else?' },
    // { name: 'Deen Davis Jr.', text: 'VIDEOTAPE MA-SELF FUCKIN YOU UP!' },
    // { name: 'Breezy', text: 'Oh, is it? Oh cool. Ur soo cool.' },
    // { name: 'Lau', text: "I'm sorry, I didn't know it was gonna happen." },
    // { name: "Gin", text: "Clean it up, and we'll do it again." },
    // { name: 'Ginman', text: "Set it up... and we'll do it... again." },
    // { name: 'Gin', text: 'Shitty, shitty-fuckin-ass.' },
    // {
    //   name: 'DDj',
    //   text: 'I can fight you one-handed.',
    // },
    // {
    //   name: 'DDj',
    //   text: 'I thought you put Spike in there.',
    // },
  ];
  const componentPseudoLoad = useRef(true);
  const intervalClock: any = useRef(null);

  const p1Keys: string[] = ['w', 'a', 's', 'd'];
  const p2Keys: string[] = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

  const [p1KeysTouched, setP1KeysTouched] = useState<boolean>(false);
  const [p2KeysTouched, setP2KeysTouched] = useState<boolean>(false);
  const [bothKeysTouched, setBothKeysTouched] = useState<boolean>(false);
  const [anyKeyWasPressed, setAnyKeyWasPressed] = useState<boolean>(false);
  const [numKeyboards, setNumKeyboards] = useState<number>(0);

  const onClickStartStartButton = () => {
    setShowControls(false);
    setShowControllers(false);
    setShowRulesN64(false);
    setShowAbout(false);
    setShowHistory(false);
    setShowOptions(false);

    trance.pause();
    startSound();
    setWebState('play');

    let players = [...smashConfig.players];
    // let newPlayers: {
    //   name: CharacterName;
    //   characterId: CharacterId;
    //   scale: number;
    // }[] = [];
    let newPlayers: PlayerConfig[] = [];
    inputArray.forEach((input, inputIndex) => {
      switch (input) {
        case 0:
          break;
        case 1:
          newPlayers.push({
            name: players[inputIndex].name,
            characterId: players[inputIndex].characterId,
            scale: players[inputIndex].scale,
            input: inputArray[inputIndex],
          });
          break;
        case 2:
          newPlayers.push({
            name: players[inputIndex].name,
            characterId: players[inputIndex].characterId,
            scale: players[inputIndex].scale,
            input: inputArray[inputIndex],
          });
          break;
        case 3:
          newPlayers.push({
            name: players[inputIndex].name,
            characterId: players[inputIndex].characterId,
            scale: players[inputIndex].scale,
            input: inputArray[inputIndex],
          });
          break;
        default:
      }
      // if (input.state) {
      //   newPlayers.push({
      //     name: players[inputIndex].name as CharacterName,
      //     characterId: players[inputIndex].characterId as CharacterId,
      //     scale: players[inputIndex].scale,
      //   });
      // }
    });
    let newSmashConfig = { players: [...newPlayers] };
    setQuotesRandomNumber(Math.floor(Math.random() * quotes.length));

    if (!debug.LoadTimeExtra || debug.DevMode) {
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
          debug.DevMode ? 0 : 1
        );
        clearInterval(myInterval);
      }
    }, 1);
  };

  // const onClickRotateInput = (index: number): void => {
  //   let newPlayers = [...smashConfig.players];
  //   newPlayers[index].inputIndex + 1 > inputTypeConfig.length - 1
  //     ? (newPlayers[index].inputIndex = 0)
  //     : newPlayers[index].inputIndex++;
  //   newPlayers[index].inputType = inputTypeConfig[newPlayers[index].inputIndex];
  //   newPlayers[index].inputEmoji =
  //     inputEmojiConfig[newPlayers[index].inputIndex];
  //   setSmashConfig({ players: [...newPlayers] });
  // };

  const getNumKeyboardsInUse = (): number => {
    let numKeyboardsInUse = 0;
    inputArray.forEach((input) => {
      if (input === 2) {
        numKeyboardsInUse++;
      }
    });
    return numKeyboardsInUse;
  };

  const onClickSetInputArrayElement = (
    playerIndex: number,
    newInput: InputType
  ): void => {
    blipSound();
    let i = newInput;
    let k = getNumKeyboardsInUse();
    if (i === 2 && k >= 2) {
      i = 0;
    }
    let newInputArray = [...inputArray];
    newInputArray[playerIndex] = i;
    setInputArray([...newInputArray]);
    // console.log('newInputArray', newInputArray);
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

  const setFirstCharacterSlot = (charId: CharacterId): void => {
    if (debug.AllowCharsChez || webState === 'play') {
      return;
    }
    if (charId === 4) {
      bamPlay();
      // onClickSetInputArrayElement(0, 2);
      // onClickSetInputArrayElement(1, 0);
      // onClickSetInputArrayElement(2, 0);
      // onClickSetInputArrayElement(3, 0);
      // onClickSetChez();
      setInputArray([2, 0, 0, 0]);
    }
    if (charId === 5) {
      woahPlay();
      // onClickSetInputArrayElement(0, 2);
      // onClickSetInputArrayElement(1, 0);
      // onClickSetInputArrayElement(2, 0);
      // onClickSetInputArrayElement(3, 0);
      // onClickSetBlackChez();
      setInputArray([2, 0, 0, 0]);
    }

    let choices = [...smashConfig.players];
    let choice = choices[0];
    choice.characterId = charId;
    let tempScale = ensureTypeCharacterId(
      smashConfigScaleArray.find((s, sIndex) => {
        return s.characterId === choice.characterId;
      })
    ).scale;
    let tempName = ensureTypeCharacterName(
      smashConfigScaleArray.find((s) => {
        return s.characterId === choice.characterId;
      })
    ).name;

    choice.scale = tempScale;
    choice.name = tempName;
    setSmashConfig({ players: [...choices] });
  };

  function ensureTypeCharacterId<CharacterId>(
    argument: CharacterId | undefined | null,
    message: string = 'This value was promised to be there.'
  ): CharacterId {
    if (argument === undefined || argument === null) {
      throw new TypeError(message);
    }

    return argument;
  }

  function ensureTypeCharacterName<CharacterName>(
    argument: CharacterName | undefined | null,
    message: string = 'This value was promised to be there.'
  ): CharacterName {
    if (argument === undefined || argument === null) {
      throw new TypeError(message);
    }

    return argument;
  }

  const onClickRotateSelection = (playerIndex: number): void => {
    blipSound();
    let choices = [...smashConfig.players];
    let choice = choices[playerIndex];

    let newCharacterId = choice.characterId + 1;

    // player cannot directly select Chez or BlackChez
    if (!debug.DevMode && !debug.AllowCharsChez) {
      while (newCharacterId === 4 || newCharacterId === 5) {
        newCharacterId++;
      }
    }

    if (newCharacterId > smashConfigScaleArray.length - 1) {
      newCharacterId = 0;
    }

    if (!debug.DevMode && !debug.AllowCharsExtended && newCharacterId > 5) {
      newCharacterId = 0;
    }

    choice.characterId = newCharacterId as CharacterId;

    let tempScale = smashConfigScaleArray.find((s, sIndex) => {
      return s.characterId === choice.characterId;
    })?.scale;
    let tempName = ensureTypeCharacterName(
      smashConfigScaleArray.find((s, sIndex) => {
        return s.characterId === choice.characterId;
      })
    ).name;

    choice.scale = tempScale ? tempScale : 1;
    choice.name = tempName;
    setSmashConfig({ players: [...choices] });
  };

  // ✔️🚧❌🚫🛑🔜📄📋⚙️🚪⛔⌚🕹️🎮☠️👾💣🔥​➡️​⌨️​⌨🧊🌑🌒🌙⭐🌞☁☁☁
  // 🏴‍☠️🏳️🏁🏴
  // 🔴🟠🟡🟢🔵🟣🟤⚫⚪
  // ⌨🎮

  const [showRulesN64, setShowRulesN64] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showControllers, setShowControllers] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const characterMoves: CharacterMove[] = [
    { button: 'D-Pad', move: 'Move', status: emoji.greenCheck },
    { button: 'Ground + X', move: 'Jump', status: emoji.greenCheck },
    { button: 'Air + X', move: 'Jump-Double', status: emoji.greenCheck },
    { button: 'Air + D-Pad + A', move: 'Jump-Energy', status: emoji.caution },
    { button: 'B', move: 'Attack-Physical', status: emoji.caution },
    { button: 'Y', move: 'Attack-Energy', status: emoji.greenCheck },
    { button: 'Forward + B', move: 'Attack-Smash', status: emoji.redX },
    {
      button: 'Air + Wall + Forward',
      move: 'Slide-Wall',
      status: emoji.greenCheck,
    },
    { button: 'L + R', move: 'Pause', status: emoji.greenCheck },
    { button: 'Paused + Any Button', move: 'Ready', status: emoji.greenCheck },
    { button: 'Paused + All Ready', move: 'UnPause', status: emoji.greenCheck },
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
    setShowOptions(false);
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
        setShowOptions(false);
        break;
      case 'ReStart':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(false);
        break;
      case 'Controls':
        setShowControls(!showControls);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(false);
        break;
      case 'Controllers':
        setShowControls(false);
        setShowControllers(!showControllers);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(false);
        break;
      case 'Rules-N64':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(!showRulesN64);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(false);
        break;
      case 'About':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(!showAbout);
        setShowHistory(false);
        setShowOptions(false);
        break;
      case 'History':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(!showHistory);
        setShowOptions(false);
        break;
      case 'Options':
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(!showOptions);
        break;
      default:
        setShowControls(false);
        setShowControllers(false);
        setShowRulesN64(false);
        setShowAbout(false);
        setShowHistory(false);
        setShowOptions(false);
    }
  };

  const onClickOscura = (index: number) => {
    onClickSetInputArrayElement(
      index,
      inputArray[index] + 1 > 3
        ? (0 as InputType)
        : ((inputArray[index] + 1) as InputType)
    );
  };

  const onEventKeyboard = (event: any) => {
    let k = event.key;

    if (webState === 'start') {
      let pIndex;
      switch (k) {
        case 'Enter':
          onClickStartStartButton();
          break;
        // case 'a':
        //   pIndex = 0;
        //   if (inputArray[pIndex] !== 0) {
        //     onClickRotateSelection(pIndex);
        //   }
        //   break;
        // case 's':
        //   pIndex = 1;
        //   if (inputArray[pIndex] !== 0) {
        //     onClickRotateSelection(pIndex);
        //   }
        //   break;
        // case 'd':
        //   pIndex = 2;
        //   if (inputArray[pIndex] !== 0) {
        //     onClickRotateSelection(pIndex);
        //   }
        //   break;
        // case 'f':
        //   pIndex = 3;
        //   if (inputArray[pIndex] !== 0) {
        //     onClickRotateSelection(pIndex);
        //   }
        //   break;
        case 'j':
          onClickOscura(0);
          break;
        case 'k':
          onClickOscura(1);
          break;
        case 'l':
          onClickOscura(2);
          break;
        case ';':
          onClickOscura(3);
          break;
        case 'u':
          pIndex = 0;
          if (inputArray[pIndex] !== 0) {
            onClickRotateSelection(pIndex);
          }
          break;
        case 'i':
          pIndex = 1;
          if (inputArray[pIndex] !== 0) {
            onClickRotateSelection(pIndex);
          }
          break;
        case 'o':
          pIndex = 2;
          if (inputArray[pIndex] !== 0) {
            onClickRotateSelection(pIndex);
          }
          break;
        case 'p':
          pIndex = 3;
          if (inputArray[pIndex] !== 0) {
            onClickRotateSelection(pIndex);
          }
          break;
      }
    }

    if (webState === 'play') {
      if (p1Keys.includes(k)) {
        setP1KeysTouched(true);
      }
      if (p2Keys.includes(k)) {
        setP2KeysTouched(true);
      }
      switch (k) {
        case 'Backspace':
          onClickReStartEventHandler();
          break;
        case 'Escape':
          onClickBackEventHandler();
          break;
      }
    }
  };

  const cb = (event: any) => {
    onEventKeyboard(event);
    setAnyKeyWasPressed(!anyKeyWasPressed);
  };

  useEffect(() => {
    window.addEventListener<'keydown'>('keydown', cb, { once: true });
  }, [anyKeyWasPressed]);

  const onClickReStartEventHandler = () => {
    if (myPhaser?.current?.scene?.keys?.game?.loaded) {
      startSound();
      myPhaser.current.scene.keys.game.loaded = false;
      setShowLoaderIntervalFunction();
      onClickPlayNavButtons('ReStart');
      setQuotesRandomNumber(Math.floor(Math.random() * quotes.length));

      let newSmashConfig = JSON.parse(
        JSON.stringify(myPhaser.current?.scene?.keys?.game.smashConfig)
      );
      let newDebug = JSON.parse(
        JSON.stringify(myPhaser.current?.scene?.keys?.game.debug)
      );
      clearInterval(intervalClock.current);
      intervalClock.current = null;
      componentPseudoLoad.current = true;
      myPhaser.current.destroy(true);

      if (!debug.LoadTimeExtra || debug.DevMode) {
        setTimeoutQuotesLengthReStart = 0;
      }
      setTimeout(() => {
        myPhaser.current = new Phaser.Game(config);
        myPhaser.current.registry.set('parentContext', Play);
        myPhaser.current.registry.set('smashConfig', newSmashConfig);
        myPhaser.current.registry.set('debug', newDebug);
      }, setTimeoutQuotesLengthReStart);
    }
  };

  const getNumControllersExistLower = (myI: number): number => {
    let num: number = 0;

    inputArray.forEach((ia: number, iaIndex: number) => {
      if (ia === 1 && iaIndex < myI) {
        num++;
      }
    });

    return num;
  };

  const getDoesKeyboardExistLower = (myI: number): boolean => {
    let exists: boolean = false;

    inputArray.forEach((ia: number, iaIndex: number) => {
      if (ia === 2 && iaIndex < myI) {
        exists = true;
      }
    });

    return exists;
  };

  const onClickBackEventHandler = () => {
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

    setP1KeysTouched(false);
    setP2KeysTouched(false);
  };

  useEffect(() => {
    let numK = 0;
    inputArray.forEach((input) => {
      if (input === 2) {
        numK++;
      }
    });
    setNumKeyboards(numK);
  }, [inputArray]);

  useEffect(() => {
    if (p1KeysTouched && p2KeysTouched) {
      setBothKeysTouched(true);
    } else {
      setBothKeysTouched(false);
    }
  }, [p1KeysTouched, p2KeysTouched]);

  const getMaxFromKey = (key: string) => {
    console.log('getInitFromKey', key);

    let newVal = debugMax[key as keyof Debug];
    return newVal;
  };

  const [text, setText] = useState('');
  const interval: any = useRef(null);
  // const [quoteCss, setQuoteCss] = useState<boolean>(false);

  useEffect(
    function () {
      if (!debug.TypedLoadingText) {
        return;
      }

      if (interval.current !== null) {
        clearInterval(interval.current);
      }

      let tempIndex = 0;
      let tempText = '';
      interval.current = setInterval(function () {
        tempText = quotes[quotesRandomNumber].text.substring(0, tempIndex + 1);
        setText(tempText);

        if (tempIndex === quotes[quotesRandomNumber].text.length - 1) {
          clearInterval(interval.current);
          interval.current = null;
        }

        tempIndex++;
      }, 1700 / quotes[quotesRandomNumber].text.length);
    },
    [quotesRandomNumber, webState]
  );

  return (
    <div id="top-level" className="over-div">
      {/* <div className="download-screenshot">Download Screenshot</div> */}
      {!debug.DevMode &&
        webState !== 'start' &&
        numKeyboards === 2 &&
        !bothKeysTouched && (
          <div
            className="keyboard-explainer-double"
            onClick={() => {
              onClickPlayNavButtons('Controls');
            }}
          >
            {!p1KeysTouched && (
              <div className="keyboard-left-checkmark">
                <span>Awaiting</span>
                <div className="small-spinner ss-red"></div>
                <span>WASD</span>
              </div>
            )}
            {!p2KeysTouched && (
              <div className="keyboard-right-checkmark">
                <span>Awaiting</span>
                <div className="small-spinner ss-blue"></div>
                <span>Arrows</span>
              </div>
            )}
          </div>
        )}
      {!debug.DevMode &&
        webState !== 'start' &&
        numKeyboards === 1 &&
        !p1KeysTouched && (
          <div
            className="keyboard-explainer-single"
            onClick={() => {
              onClickPlayNavButtons('Controls');
            }}
          >
            {!p1KeysTouched && (
              <div className="keyboard-left-checkmark">
                <span>Awaiting</span>
                <div className="small-spinner ss-red"></div>
                <span>WASD</span>
              </div>
            )}
          </div>
        )}
      {webState !== 'start' && showLoader && (
        // {true && (
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
          {debug.TypedLoadingText && (
            <p className={'.first-loader-p'}>{text}</p>
          )}
          {!debug.TypedLoadingText && (
            <p className="first-loader-p">{quotes[quotesRandomNumber].text}</p>
          )}
          <p className="second-loader-p">- {quotes[quotesRandomNumber].name}</p>
          {debug.TypedLoadingText && (
            <p className="third-loader-p">
              Loading{space};can{space};take{space};a{space};few{space};seconds.
              {space};
            </p>
          )}
          {/* {!debug.TypedText && (
            <p className="fourth-loader-p">
              Loading&nbsp;can&nbsp;take&nbsp;a&nbsp;few&nbsp;seconds.&nbsp;
            </p>
          )} */}
          {/* <p className="third-loader-p">{loadingTwenty}</p> */}
        </div>
      )}
      <div className="phaser-container" id="phaser-container"></div>
      {webState === 'start' && (
        <div className="start-class-div">
          <div className="startTitleWrapper2">
            <div className="startTitleWrapper1">
              <div
                className="startTitle"
                onMouseDown={trancePlay}
                onMouseUp={trancePause}
              >
                <img src="images/smashed_x10_gif.gif" alt="smash title" />
                {/* <img src="images/smashed-gif-cropped.gif" alt="smash title" /> */}
                <h1>SMASHED</h1>
              </div>
            </div>
          </div>
          {!debug.DevMode && <div className="black-hiding-div"></div>}
          <div className="player-choices">
            {smashConfig.players.map((p, pIndex) => {
              return (
                <div className="player-choice" key={pIndex}>
                  {inputArray[pIndex] === 0 && (
                    <div
                      className="player-char-blank"
                      onClick={() => {
                        onClickRotateSelection(pIndex);
                      }}
                    >
                      <div className="startImageWrapper">
                        {(inputArray[pIndex] === 1 ||
                          inputArray[pIndex] === 2 ||
                          inputArray[pIndex] === 3) && (
                          <img
                            className={
                              'startImage' + (pIndex > 1 ? 'Inverse' : 'Normal')
                            }
                            src={
                              'images/character_' +
                              p.characterId.toString() +
                              '_cropped.png'
                            }
                            width={(55 * p.scale).toString() + '%'}
                            alt="char"
                          />
                        )}
                        <p className="player-char-image-name">{p.name}</p>
                      </div>
                    </div>
                  )}
                  {(inputArray[pIndex] === 1 ||
                    inputArray[pIndex] === 2 ||
                    inputArray[pIndex] === 3) && (
                    <div
                      className="player-char"
                      onClick={() => {
                        onClickRotateSelection(pIndex);
                      }}
                    >
                      <div className="startImageWrapper">
                        {(inputArray[pIndex] === 1 ||
                          inputArray[pIndex] === 2 ||
                          inputArray[pIndex] === 3) && (
                          <img
                            className={
                              'startImage' + (pIndex > 1 ? 'Inverse' : 'Normal')
                            }
                            src={
                              'images/character_' +
                              p.characterId.toString() +
                              '_cropped.png'
                            }
                            width={(55 * p.scale).toString() + '%'}
                            alt="char"
                          />
                        )}
                        <p className="player-char-image-name">{p.name}</p>
                      </div>
                    </div>
                  )}
                  {inputArray[pIndex] === 0 && (
                    <div
                      className="b-oscuro b-black"
                      onClick={() => {
                        onClickOscura(pIndex);
                        // onClickSetInputArrayElement(
                        //   cPlayerIndex,
                        //   inputArray[cPlayerIndex] + 1 > 2
                        //     ? (0 as InputType)
                        //     : ((inputArray[cPlayerIndex] + 1) as InputType)
                        // );
                      }}
                    >
                      <span>Off</span>
                      <div className="button-input-emoji">
                        {emoji.cloudWhite}
                      </div>
                    </div>
                  )}
                  {inputArray[pIndex] === 1 && (
                    <div
                      className="b-oscuro b-dark"
                      onClick={() => {
                        onClickOscura(pIndex);
                        // onClickSetInputArrayElement(
                        //   cPlayerIndex,
                        //   inputArray[cPlayerIndex] + 1 > 2
                        //     ? (0 as InputType)
                        //     : ((inputArray[cPlayerIndex] + 1) as InputType)
                        // );
                      }}
                    >
                      <span>Gamepad</span>
                      {getNumControllersExistLower(pIndex) === 0 && (
                        <span id="input-sub">1</span>
                      )}
                      {getNumControllersExistLower(pIndex) === 1 && (
                        <span id="input-sub">2</span>
                      )}
                      {getNumControllersExistLower(pIndex) === 2 && (
                        <span id="input-sub">3</span>
                      )}
                      {getNumControllersExistLower(pIndex) === 3 && (
                        <span id="input-sub">4</span>
                      )}
                      {pIndex < 2 && (
                        <div className="button-input-emoji">
                          {emoji.gamepad}
                        </div>
                      )}
                      {!(pIndex < 2) && (
                        <div className="button-input-emoji">
                          {emoji.gamepad}
                        </div>
                      )}
                    </div>
                  )}
                  {inputArray[pIndex] === 2 && (
                    <div
                      className="b-oscuro b-dark"
                      onClick={() => {
                        onClickOscura(pIndex);
                        // onClickSetInputArrayElement(
                        //   cPlayerIndex,
                        //   inputArray[cPlayerIndex] + 1 > 2
                        //     ? (0 as InputType)
                        //     : ((inputArray[cPlayerIndex] + 1) as InputType)
                        // );
                      }}
                    >
                      <span>Keyboard</span>
                      {getDoesKeyboardExistLower(pIndex) && (
                        <span id="input-sub">Arrows</span>
                      )}
                      {!getDoesKeyboardExistLower(pIndex) && (
                        <span id="input-sub">WASD</span>
                      )}
                      {pIndex < 2 && (
                        <div className="button-input-emoji">
                          {emoji.keyboardWhite}
                        </div>
                      )}
                      {!(pIndex < 2) && (
                        <div className="button-input-emoji">
                          {emoji.keyboardWhite}​
                        </div>
                      )}
                    </div>
                  )}
                  {inputArray[pIndex] === 3 && (
                    <div
                      className="b-oscuro b-dark"
                      onClick={() => {
                        onClickOscura(pIndex);
                      }}
                    >
                      <span>Bot</span>
                      <span id="input-sub">In Progress</span>
                      <div className="button-input-emoji">{emoji.bot}</div>
                    </div>
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
      <div className="over-div">
        <div className="top-bar">
          <img
            className="question-mark"
            src="/images/qblack_trans.png"
            alt="question mark"
            onClick={captureScreenshot}
          />
          {webState === 'start' && (
            <div
              className="link-tag"
              onClick={() => {
                onClickPlayNavButtons('Options');
              }}
            >
              {showOptions && <span className="dark-span">Options</span>}
              {!showOptions && <span>Options</span>}
            </div>
          )}
          {webState === 'start' && (
            <div
              className="link-tag"
              onClick={() => {
                onClickPlayNavButtons('Controllers');
              }}
            >
              {showControllers && <span className="dark-span">Pads</span>}
              {!showControllers && <span>Pads</span>}
            </div>
          )}
          {webState !== 'start' && (
            <div className="link-tag" onClick={onClickBackEventHandler}>
              <span>Back</span>
            </div>
          )}
          {webState !== 'start' && (
            <div className="link-tag" onClick={onClickReStartEventHandler}>
              <span>ReStart</span>
            </div>
          )}

          <div
            className="link-tag"
            onClick={() => {
              onClickPlayNavButtons('Controls');
            }}
          >
            {showControls && <span className="dark-span">Buttons</span>}
            {!showControls && <span>Buttons</span>}
          </div>
          <div
            className="link-tag"
            onClick={() => {
              onClickPlayNavButtons('Rules-N64');
            }}
          >
            {showRulesN64 && <span className="dark-span">Rules</span>}
            {!showRulesN64 && <span>Rules</span>}
          </div>
          {webState === 'start' && (
            <div
              className="link-tag"
              onClick={() => {
                onClickPlayNavButtons('About');
              }}
            >
              {showAbout && <span className="dark-span">About</span>}
              {!showAbout && <span>About</span>}
            </div>
          )}
        </div>
        {showOptions && (
          <div className="over-div">
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody('Options');
              }}
            >
              <h1>Debug Options</h1>
              <div id="debug-col">
                {Object.entries(debug).map(([key, value], index: number) => {
                  return (
                    <div
                      id="option"
                      key={index}
                      onClick={(e) => {
                        blipSound();
                        e.stopPropagation();
                        if (typeof value === 'number') {
                          setDebug((prevState) => ({
                            ...prevState,
                            [key]:
                              value - 1 < 0
                                ? getMaxFromKey(key as keyof Debug)
                                : value - 1,
                          }));
                          console.log(index, key, value);
                        }

                        if (typeof value === 'boolean') {
                          setDebug((prevState) => ({
                            ...prevState,
                            [key]: !value,
                          }));
                          console.log(index, key, value);
                        }
                      }}
                    >
                      <div className="debug-value">
                        <p>
                          {typeof value !== 'boolean'
                            ? value
                            : value
                            ? emoji.greenCheck
                            : emoji.redX}
                        </p>
                      </div>
                      <p className="key">{key}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {showControls && (
          <div className="over-div">
            <div
              className="popup"
              onClick={() => {
                onClickPlayNavBody('Controls');
              }}
            >
              <h1>Buttons</h1>
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
                {keyboardGroups.map((kGroup: KeyboardGroup[]) => {
                  return (
                    <div id="keyboard">
                      <div id="keyboard-top">
                        <h3>Keyboard {kGroup[0].right}</h3>
                      </div>
                      {kGroup.map((kItem) => {
                        return (
                          <div id="keyboard-bottom">
                            <div id="keyboard-left">{kItem.left}</div>
                            <div id="keyboard-right">{kItem.right}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div className="keyboard-buttons"></div>
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
              <h1>GamePads</h1>

              <a
                className="link-tag btn btn-dark"
                href="https://www.amazon.com/dp/B01MYUDDCV?ref=ppx_yo2ov_dt_b_product_details&th=1/"
              >
                <span>Amazon: USB Hub/Extension $13</span>
              </a>
              <p>USB controllers are recommended: </p>
              <div>
                <ul>
                  {/* These work: */}
                  {workingControllers.map((controller) => {
                    return (
                      <li>
                        <a className="working-controller" href={controller.url}>
                          <span>
                            {emoji.greenCheck} &nbsp;
                            {controller.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
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
              <p>
                Since the inception in 2009, Niemo has been actively persuing
                the fundamental polished essense of Smashed; both as an exercise
                of logic, and such that one day it could be realized as a fully
                functional, independent game.
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
              <a className="link-tag btn btn-dark" href="http://niembro64.com/">
                <span>See Other Projects</span>
              </a>
            </div>
          </div>
        )}
      </div>
      {debug.DevMode && <div className="dev-mode-div">Dev Mode</div>}
    </div>
  );
}

export default Play;
