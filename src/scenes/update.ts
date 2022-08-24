import Game from "./Game";
import {
  controllerMovement,
  attackEnergy,
  isAllPlayersReady,
} from "./helpers/pad";
import {
  jump,
  frictionGroundX,
  frictionAirX,
  frictionAirY,
  frictionWallY,
  updateLastDirectionTouched,
  setRespawn,
  isPlayerOffscreen,
  setGravityTrue,
  setGravityFalse,
} from "./helpers/movement";
import { setBlinkFalse, setBlinkTrue } from "./helpers/sprites";
import {
  goToStateGame,
  goToStatePlayer,
  hasThisDurationPassed,
  isPlayerHit,
} from "./helpers/state";
import { resetDamage, onDeadUpdateMatrix } from "./helpers/damage";
import { turnOnPhysicsAttackEnergy, upB } from "./helpers/attacks";
import { gameStatePlay } from "./gameStates.ts/gameStatePlay";
import { isFirstBlood } from "./helpers/drinking";
import { pausePhysics, resumePhysics } from "./helpers/physics";

export function update(game: Game): void {
  console.log("GAME STATE", game.gameState.name);
  switch (game.gameState.name) {
    case "start":
      setTimeout(() => {
        if (game.debug.playStartupSound) {
          game.SOUND_INTRO.play();
        }
        game.SOUND_MII.play();
        goToStateGame("play", game);
      }, 100);
      break;
    case "play":
      gameStatePlay(game);
      if (isFirstBlood(game)) {
        goToStateGame("first-blood", game);
        game.SOUND_MII.pause();
        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        pausePhysics(game);
        console.log("FIRST BLOOD");
      }
      break;
    case "first-blood":
      if (isAllPlayersReady(game)) {
        game.SOUND_MII.resume();
        goToStateGame("play", game);
        game.SOUND_START.play();
        resumePhysics(game);
        console.log("ALL READY");
      }
      break;
    case "screen-clear":
      break;
    case "pause":
      break;
    default:
      break;
  }
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
          goToStatePlayer(player, "alive", game);
          setGravityTrue(player);
          setBlinkFalse(player);
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
          goToStatePlayer(player, "hurt", game);
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          turnOnPhysicsAttackEnergy(player);
          setBlinkTrue(player);
          setGravityTrue(player);
          game.SOUND_HIT.play();
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          goToStatePlayer(player, "dead", game);
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          turnOnPhysicsAttackEnergy(player);
          setBlinkTrue(player);
          setGravityFalse(player);
          resetDamage(player);
          onDeadUpdateMatrix(playerIndex, game);
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
          goToStatePlayer(player, "alive", game);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          goToStatePlayer(player, "dead", game);
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          turnOnPhysicsAttackEnergy(player);
          setGravityFalse(player);
          setBlinkTrue(player);
          setRespawn(player, game);
          resetDamage(player);
          onDeadUpdateMatrix(playerIndex, game);
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
          goToStatePlayer(player, "alive", game);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });
}
