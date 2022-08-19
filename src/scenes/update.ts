import Game from "./Game";
import {
  controllerMovement,
  controllerSetFast,
  updatePadPrevious,
  assignGamePadsConnected,
  printAllPadsActive,
  attackEnergy,
  updateAttackEnergyFriction,
} from "./gamePad";
import {
  jump,
  frictionGroundX,
  frictionAirX,
  frictionAirY,
  frictionWallY,
  updateWallTouchArray,
  updateLastDirectionTouched,
  setCamera,
  updateKeepOnScreenPlayer,
  updateKeepOnScreenPlayerDead,
  updateKeepOnScreenLREnergyAttack,
} from "./movement";
import { updateSpritesLR } from "./sprites";
import { updateText } from "./text";

export function update(game: Game): void {
  // game.text = game.timer.actualFps;
  // console.log(game.timer);
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  setCamera(game);
  updateSpritesLR(game);
  updateText(game);
  // updateAttackEnergyFriction(game);
  updateKeepOnScreenPlayer(game);
  // updatePadPrevious(game);
  updatePlayers(game);
  updatePadPrevious(game);
}

export function updatePlayers(game: Game): void {
  game.players.forEach((player, index) => {
    // printAllPadsActive(player, game);
    attackEnergy(player, game);
    updateLastDirectionTouched(player);
    controllerSetFast(player, game);
    frictionGroundX(player, game);
    frictionAirX(player, game);
    frictionWallY(player, game);
    frictionAirY(player, game);
    jump(player, game);
    updateKeepOnScreenLREnergyAttack(player.char.attackEnergy, game);
    controllerMovement(player, game);
    // updateKeepOnScreenPlayerDead(player, game);
  });
}

//   switch (player.state) {
//     case "start":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// timeout => dead
//       ////////////////////////////////
//       // player.char.sprite.body.setAllowGravity(false);
//       setState(player, "dead");

//       break;
//     case "dead":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// timeout => air
//       ////////////////////////////////

//       // player.char.sprite.body.setAllowGravity(true);
//       setState(player, "air");

//       break;
//     case "air":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// die => dead
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// touch down => ground
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// touch side => wall
//       ////////////////////////////////

//       break;
//     case "ground":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ///////// jump => air
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// fall => air
//       ////////////////////////////////
//       break;
//     case "wall":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// jump => air
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// fall => air
//       ////////////////////////////////
//       break;
//     case "spin":
//       ////////////////////////////////
//       ///////// WHILE IN LOOP
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// jump => air
//       ////////////////////////////////

//       ////////////////////////////////
//       ///////// fall => air
//       ////////////////////////////////
//       break;
//     default:
//   }
