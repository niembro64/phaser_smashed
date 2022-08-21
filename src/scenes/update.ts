import Game from "./Game";
import { updateCamera } from "./helpers/camera";
import {
  controllerMovement,
  controllerSetFast,
  updatePadPrevious,
  assignGamePadsConnected,
  attackEnergy,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updateAttackEnergyFrictionGroundMovement,
} from "./helpers/pad";
import {
  jump,
  frictionGroundX,
  frictionAirX,
  frictionAirY,
  frictionWallY,
  updateWallTouchArray,
  updateLastDirectionTouched,
  isPlayerOffscreen,
  updateKeepOnScreenLREnergyAttack,
  updateEnergyAttacksScreenWrap,
  setRespawn,
} from "./helpers/movement";
import { updateSpritesLR } from "./helpers/sprites";
import {
  checkHitboxes,
  goToState,
  hitboxOverlapReset as resetAllHitboxOverlapMatrix,
} from "./helpers/state";
import { updateText } from "./helpers/text";

export function update(game: Game): void {
  // game.text = game.timer.actualFps;
  // console.log(game.timer);
  // console.log(game.players[0].state);

  // BEFORE PLAYERS
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateSpritesLR(game);
  updateText(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateKeepOnScreenLREnergyAttack(game);
  // updateEnergyAttacksScreenWrap(game);

  // PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPrevious(game);
  resetAllHitboxOverlapMatrix(game);
}

export function updatePlayers(game: Game): void {
  // for (let i = 0; i < 4; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     if (game.hitboxOverlap[i][j] === true) {
  //       console.log(game.hitboxOverlap);
  //     }
  //   }
  // }

  // printAllPadsActive(player, game);
  game.players.forEach((player, playerIndex) => {
    // if (playerIndex === 0) {
    //   console.log(player.playerNumber, player.char.name, player.state);
    // }
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
        }, game.START_DELAY_DURATION);

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        player.char.sprite.body.allowGravity = true;

        attackEnergy(player, game);
        updateLastDirectionTouched(player);
        controllerSetFast(player, game);
        frictionGroundX(player, game);
        frictionAirX(player, game);
        frictionWallY(player, game);
        frictionAirY(player, game);
        jump(player, game);

        controllerMovement(player, game);
        checkHitboxes(player, playerIndex, game);

        ////////////////////////////////
        ///////// timeout => air
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          goToState(player, "dead");
          setRespawn(player, game);
        }

        break;
      case "hurt":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        // checkPlayerOffscreen(player, game);
        // player.char.sprite.body.allowGravity = false;
        // attackEnergy(player, game);
        // updateLastDirectionTouched(player);
        // controllerSetFast(player, game);
        // frictionGroundX(player, game);
        // frictionAirX(player, game);
        // frictionWallY(player, game);
        // frictionAirY(player, game);
        // jump(player, game);
        // updateKeepOnScreenLREnergyAttack(player.char.attackEnergy, game);
        // controllerMovement(player, game);

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        setTimeout(() => {
          if (isPlayerOffscreen(player, game)) {
            setRespawn(player, game);
            goToState(player, "dead");
          } else {
            player.char.sprite.body.allowGravity = true;
            goToState(player, "alive");
          }
        }, game.HURT_DURATION);

        break;
      case "dead":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => alive
        ////////////////////////////////
        setTimeout(() => {
          player.char.sprite.body.allowGravity = true;
          goToState(player, "alive");
        }, game.DEAD_DURATION);

        break;
    }
  });
}
