import Game from "./Game";
import { updateCamera } from "./helpers/camera";
import {
  controllerMovement,
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
  updateEnergyAttacksWrapScreen,
  setRespawn,
  isPlayerOffscreen,
  setGravityTrue,
  setGravityFalse,
  keepObjectsFromFallingLikeCrazy,
} from "./helpers/movement";
import {
  setBlinkFalse,
  setBlinkTrue,
  updateAllSpriteFilters,
  updateSpritesFlipX,
} from "./helpers/sprites";
import {
  goToState,
  hasThisDurationPassed,
  isPlayerHit,
  resetAllHitboxes,
  updateTime,
} from "./helpers/state";
import { updateText } from "./helpers/text";
import {
  resetDamage,
  onDeadUpdateMatrix,
  updateDeathsAndKillsMatrices,
} from "./helpers/damage";
import { upB } from "./helpers/attacks";

export function update(game: Game): void {
  // BEFORE PLAYERS
  updateTime(game);
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
  updateSpritesFlipX(game);
  updateText(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateEnergyAttacksWrapScreen(game);
  updateDeathsAndKillsMatrices(game);
  keepObjectsFromFallingLikeCrazy(game);

  // updateEnergyAttacksScreenWrap(game);

  // PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPrevious(game);
  resetAllHitboxes(game);
}

export function updatePlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    switch (player.state.name) {
      case "start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (hasThisDurationPassed(player, game.START_DELAY_DURATION, game)) {
          setGravityTrue(player);
          setBlinkFalse(player);
          goToState(player, "alive", game);
        }

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        attackEnergy(player, game);
        updateLastDirectionTouched(player);
        frictionGroundX(player, game);
        frictionAirX(player, game);
        frictionWallY(player, game);
        frictionAirY(player, game);
        jump(player, game);
        controllerMovement(player, game);
        upB(player, game);

        ////////////////////////////////
        ///////// hit => hurt
        ////////////////////////////////
        if (isPlayerHit(playerIndex, game)) {
          setBlinkTrue(player);
          setGravityTrue(player);
          // hitThenFly(player, game);
          goToState(player, "hurt", game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          setBlinkTrue(player);
          setGravityFalse(player);
          resetDamage(player);
          onDeadUpdateMatrix(playerIndex, game);
          goToState(player, "dead", game);
          setRespawn(player, game);
        }

        break;
      case "hurt":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        updateLastDirectionTouched(player);
        frictionGroundX(player, game);
        frictionAirX(player, game);
        frictionWallY(player, game);
        frictionAirY(player, game);
        jump(player, game);
        controllerMovement(player, game);
        upB(player, game);

        ////////////////////////////////
        ///////// !offscreen && duration => alive
        ////////////////////////////////
        if (
          !isPlayerOffscreen(player, game) &&
          hasThisDurationPassed(player, game.HURT_DURATION, game)
        ) {
          setGravityTrue(player);
          setBlinkFalse(player);
          goToState(player, "alive", game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          setGravityFalse(player);
          setBlinkTrue(player);
          setRespawn(player, game);
          resetDamage(player);
          onDeadUpdateMatrix(playerIndex, game);
          goToState(player, "dead", game);
        }

        break;
      case "dead":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        setRespawn(player, game);

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (hasThisDurationPassed(player, game.DEAD_DURATION, game)) {
          setGravityTrue(player);
          setBlinkFalse(player);
          goToState(player, "alive", game);
        }

        break;
    }
  });
}
