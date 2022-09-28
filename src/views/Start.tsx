import { useState } from "react";
import Phaser from "phaser";
import Game from "../scenes/Game";
import "../App.css";
import { Link } from "react-router-dom";
import Play from "./Play";

function Start() {
  const [sGame, setSGame] = useState();
  const [buttonsOnOff, setButtonsOnOff] = useState([
    { state: true },
    { state: true },
    { state: true },
    { state: true },
  ]);
  const [smashConfig, setSmashConfig] = useState({
    players: [
      { characterId: 0 },
      { characterId: 1 },
      { characterId: 2 },
      { characterId: 3 },
    ],
  });
  const configFirst: Phaser.Types.Core.GameConfig = {
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

  let myGame: any;

  const onStartHandler = () => {
    let players = [...smashConfig.players];
    let newPlayers: { characterId: number }[] = [];
    buttonsOnOff.forEach((button, buttonIndex) => {
      if (button.state) {
        newPlayers.push({ characterId: players[buttonIndex].characterId });
      }
    });

    let newSmashConfig = { players: [...newPlayers] };

    myGame = new Phaser.Game(configFirst);
    myGame.registry.set("parentContext", Play);
    // newGame.registry.set("smashConfig", smashConfig);
    myGame.registry.set("smashConfig", newSmashConfig);
    setSGame(myGame);
    myGame.registry.set("smashGame", sGame);
  };

  const onclickButtons = (playerIndex: number, flipState: boolean): void => {
    let buttons = [...buttonsOnOff];
    let button = buttons[playerIndex];
    button.state = flipState;
    setButtonsOnOff([...buttons]);
  };

  const onClickRotateSelection = (playerIndex: number): void => {
    let choices = [...smashConfig.players];
    let choice = choices[playerIndex];
    choice.characterId =
      choice.characterId + 1 < 6 ? choice.characterId + 1 : 0;
    setSmashConfig({ players: [...choices] });
  };

  return (
    <div className="startClassDiv">
      <div className="playerChoices">
        {smashConfig.players.map((player, playerIndex) => {
          return (
            <div className="playerChoice" key={playerIndex}>
              <div
                className="playerChar"
                onClick={() => {
                  onClickRotateSelection(playerIndex);
                }}
              >
                {buttonsOnOff[playerIndex].state && (
                  <span className="startImageNumber">{player.characterId}</span>
                )}
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
                    onclickButtons(playerIndex, false);
                  }}
                >
                  ON
                </button>
              )}
              {!buttonsOnOff[playerIndex].state && (
                <button
                  className="btn btn-danger px-4"
                  onClick={() => {
                    onclickButtons(playerIndex, true);
                  }}
                >
                  OFF
                </button>
              )}
            </div>
          );
        })}
      </div>
      <Link to={"/play"} className="playLink">
        <button className="btn btn-primary px-4" onClick={onStartHandler}>
          Start
        </button>
      </Link>
    </div>
  );
}

export default Start;

// {
//   /* <Link
//           to={"/"}
//           id="link"
//           onClick={() => {
//             newGame.destroy(true);
//           }}
//         >
//           <button className="linkTag btn btn-outline-light px-4 my-2">
//             <span>Back</span>
//           </button>
//         </Link> */
// }
// {
//   /* <button
//           className="linkTag btn btn-outline-light"
//           onClick={() => {
//             newGame.destroy(true);
//             newGame = new Phaser.Game(config);
//             newGame.registry.set("parentContext", Play);
//             // newGame.registry.set("smashConfig", smashConfig);
//             onClickHandlerButtons("ReStart");
//           }}
//         >
//           <span>ReStart</span>
//         </button> */
// }
