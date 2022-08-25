import Game from "./Game";
import {
  controllerMovement,
  attackEnergy,
  isAllPlayersReady,
  resetMyHitByIfGroundAndNotHurt,
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
  hasNumDeadChanged,
  hasThisDurationPassed,
  isPlayerHit,
  longEnoughGame,
  longEnoughTime,
  updateNumCurrentlyDead,
  updateTimeTime,
} from "./helpers/state";
import { resetDamage, onDeadUpdateMatrix } from "./helpers/damage";
import { turnOnPhysicsAttackEnergy, upB } from "./helpers/attacks";
import { gameStatePlay as gameStatePlayHandler } from "./gameStates.ts/gameStatePlay";
import {
  addToShotsMatrix,
  isFirstBlood,
  isScreenClear,
} from "./helpers/drinking";
import { pausePhysics, resumePhysics } from "./helpers/physics";
import {
  pauseBGMusic,
  pauseWiiMusic,
  playBGMusic,
  playWiiMusic,
  resumeBGMusic,
} from "./helpers/sound";

export function update(game: Game, time: number, delta: number): void {
  updateTimeTime(game, time, delta);
  updateNumCurrentlyDead(game);
  console.log(
    "PLAYERS DEAD",
    game.players[0].gameState.name,
    game.players[1].gameState.name,
    game.players[2].gameState.name,
    game.players[3].gameState.name
  );
  // console.log("DELTA", delta);
  // console.log(
  //   "GAME STATE",
  //   game.gameState.name,
  //   " | NanosecondsTime",
  //   game.NanosecondsTime
  // );
  switch (game.state.name) {
    case "start":
      playBGMusic(game);
      pauseWiiMusic(game);
      goToStateGame("play", game);
      break;
    case "play":
      gameStatePlayHandler(game, time, delta);
      if (
        isScreenClear(game) &&
        hasNumDeadChanged(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        goToStateGame("screen-clear", game);
        pauseBGMusic(game);
        playWiiMusic(game);
        game.ENERJA_SMASHED.play();
        game.SOUND_SQUISH.play();
        pausePhysics(game);
        console.log("SCREEN CLEAR");
      }
      if (
        isFirstBlood(game) &&
        hasNumDeadChanged(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        goToStateGame("first-blood", game);
        pauseBGMusic(game);
        playWiiMusic(game);
        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        pausePhysics(game);
        console.log("FIRST BLOOD");
      }
      break;
    case "first-blood":
      if (
        longEnoughTime(game.DURATION_GAME_SHOT, game) &&
        isAllPlayersReady(game)
      ) {
        pauseWiiMusic(game);
        resumeBGMusic(game);
        goToStateGame("play", game);
        game.SOUND_START.play();
        resumePhysics(game);
        console.log("ALL READY");
      }
      break;
    case "screen-clear":
      if (
        longEnoughTime(game.DURATION_GAME_SHOT, game) &&
        isAllPlayersReady(game)
      ) {
        pauseWiiMusic(game);
        resumeBGMusic(game);
        goToStateGame("play", game);
        game.SOUND_START.play();
        resumePhysics(game);
        console.log("ALL READY");
      }
      break;
    case "pause":
      break;
    default:
      break;
  }
}

export function updatePlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    switch (player.gameState.name) {
      case "start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (hasThisDurationPassed(player, game.DURATION_GAME_START, game)) {
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
        resetMyHitByIfGroundAndNotHurt(player, playerIndex, game);

        ////////////////////////////////
        ///////// hit => hurt
        ////////////////////////////////
        if (isPlayerHit(playerIndex, game)) {
          goToStatePlayer(player, "hurt", game);
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
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
          onDeadUpdateMatrix(playerIndex, game);
          if (isFirstBlood(game)) {
            addToShotsMatrix(player, playerIndex, game);
            console.log("HERE", game.numberShotsTakenByMatrix[0]);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
          player.char.attackEnergy.state = "released";
          turnOnPhysicsAttackEnergy(player);
          setBlinkTrue(player);
          setGravityFalse(player);
          resetDamage(player);
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
          hasThisDurationPassed(player, game.DURATION_PLAYER_HURT, game)
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
          onDeadUpdateMatrix(playerIndex, game);
          if (isFirstBlood(game)) {
            addToShotsMatrix(player, playerIndex, game);
            console.log("HERE", game.numberShotsTakenByMatrix[0]);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          turnOnPhysicsAttackEnergy(player);
          setGravityFalse(player);
          setBlinkTrue(player);
          resetDamage(player);
          setRespawn(player, game);
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
        if (hasThisDurationPassed(player, game.DURATION_PLAYER_DEAD, game)) {
          goToStatePlayer(player, "alive", game);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });
}
