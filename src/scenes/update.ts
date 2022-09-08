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
  hasNumDeadIncrased,
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
  addShotToMatrixFirstBlood as addToShotsMatrixFirstBlood,
  addToShotsMatrixScreenClear,
  isFirstBlood,
  isScreenClear,
} from "./helpers/drinking";
import { pausePhysics, resumePhysics } from "./helpers/physics";
import {
  pauseAllReadySounds,
  pauseMusic,
  pauseWiiMusic,
  playBGMusic,
  playWiiMusic,
  playWiiMusicWait,
  resumeMusic,
} from "./helpers/sound";
import {
  turnOnSplash,
  updateGlassesTransparency,
  updateText,
} from "./helpers/text";

export function update(game: Game, time: number, delta: number): void {
  updateTimeTime(game, time, delta);
  updateText(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  // console.log(
  //   "PLAYERS DEAD",
  //   game.players[0].gameState.name,
  //   game.players[1].gameState.name,
  //   game.players[2].gameState.name,
  //   game.players[3].gameState.name
  // );
  // console.log("DELTA", delta);
  // console.log(
  //   "GAME STATE",
  //   game.gameState.name,
  //   " | NanosecondsTime",
  //   game.NanosecondsTime
  // );
  switch (game.state.name) {
    case "start":
      turnOnSplash("none", game);
      playBGMusic(game);
      pauseWiiMusic(game);

      goToStateGame("play", game);
      break;
    case "play":
      gameStatePlayHandler(game, time, delta);
      if (
        isScreenClear(game) &&
        hasNumDeadIncrased(game) &&
        longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        goToStateGame("screen-clear", game);
        turnOnSplash("screen-clear", game);
        pauseMusic(game);

        game.ENERJA_SMASHED.play();
        game.SOUND_SQUISH.play();
        pausePhysics(game);
        console.log("SCREEN CLEAR");
      }
      if (
        isFirstBlood(game) &&
        hasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        goToStateGame("first-blood", game);
        turnOnSplash("first-blood", game);
        pauseMusic(game);

        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        pausePhysics(game);
        console.log("FIRST BLOOD");
      }
      if (game.gameSecondsClock < 1) {
        goToStateGame("end", game);
        pausePhysics(game);
        turnOnSplash("end", game);
        pauseMusic(game);
        game.ENERJA_FINISH.play();
        // game.SOUND_PAUSED.play()
      }
      break;
    case "first-blood":
      playWiiMusicWait(game);
      // updateSomeReadySound(game);
      if (
        longEnoughTime(game.DURATION_GAME_SHOT, game) &&
        isAllPlayersReady(game)
      ) {
        turnOnSplash("none", game);
        pauseWiiMusic(game);
        pauseAllReadySounds(game);
        goToStateGame("play", game);
        turnOnSplash("none", game);
        resumeMusic(game);
        game.SOUND_START.play();
        resumePhysics(game);
        console.log("ALL READY");
      }

      break;
    case "screen-clear":
      playWiiMusicWait(game);
      // updateSomeReadySound(game);
      if (
        longEnoughTime(game.DURATION_GAME_SHOT, game) &&
        isAllPlayersReady(game)
      ) {
        pauseWiiMusic(game);
        pauseAllReadySounds(game);
        resumeMusic(game);
        goToStateGame("play", game);
        turnOnSplash("none", game);
        game.SOUND_START.play();
        resumePhysics(game);
        console.log("ALL READY");
      }
      break;
    case "end":
      playWiiMusic(game);
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
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (isScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
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

        // resetMyHitByMatrix(player, playerIndex, game);
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
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (isScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
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
