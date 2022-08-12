import Game from './Game';
import {
    controllerMovement,
    assignGamePadsConnected as assignConnectedGamePads,
    printAllPadsActive,
    controllerSetFast,
    updatePadPrevious,
} from './gamePad';
import {
    jump,
    updateKeepOnScreen,
    frictionGroundX,
    frictionAirX,
    frictionAirY,
    frictionWallY,
    updateWallTouchArray,
    updateLastDirectionTouched,
    setCameraCenter,
} from './movement';
import { updateSprites } from './sprites';

export function update(game: Game): void {
    console.log(
        // "1",
        // game.players[1].state,
        // game.players[1].char.sprite.body.touching.down,
        // game.players[1].char.sprite.y,
        // game.players[1].char.sprite.body.velocity,
        // game.players[3].char.wallTouchArray,
        // hasPlayerTouchedWallRecently(game.players[3]),
        // game.players[3].char.lastDirectionTouched
        game.players[3].char.wallTouchArray
    );
    assignConnectedGamePads(game);
    updateWallTouchArray(game);
    updateSprites(game);
    setCameraCenter(game);
    game.players.forEach((player, index) => {
        updateLastDirectionTouched(player);
        // printAllPadsActive(player, game);
        controllerSetFast(player, game);
        frictionGroundX(player, game);
        frictionAirX(player, game);
        frictionWallY(player, game);
        frictionAirY(player, game);
        jump(player, game);
        controllerMovement(player, game);
        updateKeepOnScreen(player, game);
        updatePadPrevious(player, game);
        // console.log(player.char.sprite.velocity);
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
//       console.log("????");
//   }
