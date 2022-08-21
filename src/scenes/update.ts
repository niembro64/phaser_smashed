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
  updateKeepOnScreenLREnergyAttack,
  setRespawn,
  hitThenFly,
  isPlayerOffscreen,
  setGravityTrue,
  setGravityFalse,
} from "./helpers/movement";
import {
  setSpriteFilterFalse,
  setSpriteFilterTrue,
  updateAllSpriteFilters,
  updateSpritesLR,
} from "./helpers/sprites";
import {
  goToState,
  isPlayerHit,
  resetAllHitboxes,
  updateTime,
} from "./helpers/state";
import { updateText } from "./helpers/text";

export function update(game: Game): void {
  // game.text = game.timer.actualFps;
  // console.log(game.timer);
  // console.log(game.players[0].state);

  // BEFORE PLAYERS
  updateTime(game);
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
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
  resetAllHitboxes(game);
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
    if (playerIndex === 0) {
      console.log(player.playerNumber, player.char.name, player.state);
    }
    switch (player.state.name) {
      case "start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// timeout => dead
        ////////////////////////////////
        if (game.millisecondsTime > game.START_DELAY_DURATION) {
          setGravityTrue(player);
          setSpriteFilterFalse(player);
          goToState(player, "alive", game);
        }

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

        controllerMovement(player, game);

        if (isPlayerHit(playerIndex, game)) {
          console.log("HIT", player.char.name);
          setGravityFalse(player);
          hitThenFly(player, game);
          goToState(player, "hurt", game);
        }
        ////////////////////////////////
        ///////// timeout => air
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          setSpriteFilterTrue(player);
          setGravityFalse(player);
          goToState(player, "dead", game);
          setRespawn(player, game);
        }

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
        setTimeout(() => {
          if (isPlayerOffscreen(player, game)) {
            setGravityFalse(player);
            setSpriteFilterTrue(player);
            setRespawn(player, game);
            goToState(player, "dead", game);
          } else {
            setGravityTrue(player);
            setSpriteFilterFalse(player);
            goToState(player, "alive", game);
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
          setGravityTrue(player);
          setSpriteFilterFalse(player);
          goToState(player, "alive", game);
        }, game.DEAD_DURATION);

        break;
    }
  });
}
