import Game from "./Game";
import {
  controllerMovement,
  controllerSetFast,
  updatePadPrevious,
  assignGamePadsConnected,
  printAllPadsActive,
  attackEnergy,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updateAttackEnergyFrictionGroundMovement,
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
  updatePlaceOffscreenEnergyAttacks,
} from "./movement";
import { updateSpritesLR } from "./sprites";
import { goToState } from "./state";
import { updateText } from "./text";

export function update(game: Game): void {
  // game.text = game.timer.actualFps;
  // console.log(game.timer);
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  setCamera(game);
  updateSpritesLR(game);
  updateText(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  // updatePlaceOffscreenEnergyAttacks(game);
  updateAttackEnergyFrictionWall(game);
  updateKeepOnScreenPlayer(game);
  // updatePadPrevious(game);
  updatePlayers(game);
  updatePadPrevious(game);
}

export function updatePlayers(game: Game): void {
  // printAllPadsActive(player, game);
  game.players.forEach((player, index) => {
    if (player.playerNumber === 0) {
      // console.log("0", player.state);
    }
    switch (player.state) {
      case "start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => dead
        ////////////////////////////////
        setTimeout(() => {
          player.char.sprite.body.allowGravity = true;
          goToState(player, "alive");
        }, game.startDelay);

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
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

        ////////////////////////////////
        ///////// timeout => air
        ////////////////////////////////

        break;
      case "hurt":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////

        break;
      case "dead":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        player.char.sprite.body.allowGravity = false;

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////
        setTimeout(() => {
          player.char.sprite.body.allowGravity = true;
          goToState(player, "alive");
        }, 3000);

        break;
    }
  });
}
