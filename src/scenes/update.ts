import Game from "./Game";
import {
    assignGamePadsConnected as assignConnectedGamePads,
    printAllPadsActive,
    simpleMotion,
} from "./gamePad";
import {
    addGravity,
    addKeyboard,
    addPad,
    updateKeepOnScreen,
    updateSpriteVelocity,
} from "./movement";
import { setState } from "./state";

export function update(game: Game): void {
    // console.log(
    //     "0",
    //     game.players[0].state,
    //     game.players[0].char.sprite.body.touching.down,
    //     game.players[0].char.sprite.y
    // );
    // simpleMotion(game);

    assignConnectedGamePads(game);

    printAllPadsActive(game);
    addPad(game.players[0], game);
    updateSpriteVelocity(game.players[0], game);

    // game.players.forEach((player, index) => {
    //     // updateKeepOnScreen(player, game);
    //     switch (player.state) {
    //         case "start":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// timeout => dead
    //             ///////////////////////////////////////////////////////////////
    //             // player.char.sprite.body.setAllowGravity(false);
    //             setState(player, "dead");

    //             break;
    //         case "dead":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// timeout => air
    //             ///////////////////////////////////////////////////////////////

    //             // player.char.sprite.body.setAllowGravity(true);
    //             setState(player, "air");

    //             break;
    //         case "air":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////
    //             addKeyboard(player, game);
    //             addGravity(player, game);
    //             updateSpriteVelocity(player, game);

    //             ///////////////////////////////////////////////////////////////
    //             ///////// die => dead
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// touch down => ground
    //             ///////////////////////////////////////////////////////////////
    //             if (player.char.sprite.body.touching.down) {
    //                 player.char.sprite.body.setAllowGravity(false);
    //                 setState(player, "ground");
    //             } // shit

    //             ///////////////////////////////////////////////////////////////
    //             ///////// touch side => wall
    //             ///////////////////////////////////////////////////////////////

    //             break;
    //         case "ground":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////
    //             addKeyboard(player, game);
    //             addGravity(player, game);
    //             updateSpriteVelocity(player, game);

    //             ///////// jump => air
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// fall => air
    //             ///////////////////////////////////////////////////////////////
    //             break;
    //         case "wall":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// jump => air
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// fall => air
    //             ///////////////////////////////////////////////////////////////
    //             break;
    //         case "spin":
    //             ///////////////////////////////////////////////////////////////
    //             ///////// WHILE IN LOOP
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// jump => air
    //             ///////////////////////////////////////////////////////////////

    //             ///////////////////////////////////////////////////////////////
    //             ///////// fall => air
    //             ///////////////////////////////////////////////////////////////
    //             break;
    //         default:
    //             console.log("????");
    //     }
    // });
}
