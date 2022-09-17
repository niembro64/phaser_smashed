import Game from "./Game";
import {
  controllerMovement as updateControllerMovement,
  attackEnergy as updateAttackEnergy,
  isAllPlayersReady as getIsAllPlayersReady,
  printAllPadsActive as updatePrintAllPadsActive,
  isAnyPlayerPausing,
  assignGamePadsConnected as updateGamePadsConnected,
} from "./helpers/pad";
import {
  jump as updateJump,
  frictionGroundX as updateFrictionGroundX,
  frictionAirX as updateFrictionAirX,
  frictionAirY as updateFrictionAirY,
  frictionWallY as updateFrictionWallY,
  updateLastDirectionTouched,
  setRespawn,
  isPlayerOffscreen as getIsPlayerOffscreen,
  setGravityTrue,
  setGravityFalse,
} from "./helpers/movement";
import { setBlinkFalse, setBlinkTrue } from "./helpers/sprites";
import {
  goToStateGame as setGoToStateGame,
  goToStatePlayer as setGoToStatePlayer,
  hasNumDeadIncrased as getHasNumDeadIncrased,
  hasThisDurationPassed as getHasThisDurationPassed,
  isPlayerHit as getIsPlayerHit,
  // longEnoughGame,
  longEnoughTime as getIsLongEnoughTime,
  updateNumCurrentlyDead,
  updateTimeTime,
} from "./helpers/state";
import {
  resetDamage as setResetDamage,
  onDeadUpdateMatrix as setOnDeadUpdateMatrix,
  turnOnActiveHurtEmitter as setTurnOnActiveHurtEmitter,
  turnOffActiveHurtEmitter as setTurnOffActiveHurtEmitter,
  turnOnVisibleHurtEmitter as setTurnOnVisibleHurtEmitter,
  turnOffVisibleHurtEmitter as setTurnOffVisibleHurtEmitter,
} from "./helpers/damage";
import { turnOnPhysicsAttackEnergy as setTurnOnPhysicsAttackEnergy, upB as updateUpB } from "./helpers/attacks";
import { gameStatePlay as updateGameStatePlayHandler } from "./gameStates.ts/gameStatePlay";
import {
  addShotToMatrixFirstBlood as setAddToShotsMatrixFirstBlood,
  addToShotsMatrixScreenClear,
  isFirstBlood as getIsFirstBlood,
  isScreenClear as getIsScreenClear,
} from "./helpers/drinking";
import { pausePhysics as setPausePhysics, resumePhysics as setResumePhysics } from "./helpers/physics";
import {
  pauseAllReadySounds as setPauseAllReadySounds,
  pauseMusic as setPauseMusic,
  pauseWiiMusic as setPauseWiiMusic,
  playBGMusic as setPlayBGMusic,
  playWiiMusicWaitShort as updatePlayWiiMusicWaitShort,
  playWiiMusicWaitLong as updatePlayWiiMusicWaitLong,
  resumeMusic as setResumeMusic,
  playWiiMusic as updatePlayWiiMusic,
} from "./helpers/sound";
import {
  turnOnSplashRule as setTurnOnRuleSplash,
  updateGlassesTransparency,
  updateText,
} from "./helpers/text";

export function update(game: Game, time: number, delta: number): void {
  updateTimeTime(game, time, delta);
  updateText(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  updateGamePadsConnected(game);
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
      setTurnOnRuleSplash("none", game);
      setPlayBGMusic(game);
      setPauseWiiMusic(game);

      setGoToStateGame("play", game);
      break;
    case "play":
      updateGameStatePlayHandler(game, time, delta);
      if (isAnyPlayerPausing(game)) {
        setGoToStateGame("paused", game);
        setTurnOnRuleSplash("paused", game);
        setPauseMusic(game);
        game.SOUND_START.play();
        setPausePhysics(game);
        console.log("PAUSED");
      }
      if (
        getIsScreenClear(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGoToStateGame("screen-clear", game);
        setTurnOnRuleSplash("screen-clear", game);
        setPauseMusic(game);
        game.ENERJA_SMASHED.play();
        game.SOUND_SQUISH.play();
        setPausePhysics(game);
        console.log("SCREEN CLEAR");
      }
      if (
        getIsFirstBlood(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGoToStateGame("first-blood", game);
        setTurnOnRuleSplash("first-blood", game);
        setPauseMusic(game);
        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        setPausePhysics(game);
        console.log("FIRST BLOOD");
      }
      if (game.gameSecondsClock < 1) {
        setGoToStateGame("end", game);
        setPausePhysics(game);
        setTurnOnRuleSplash("finished", game);
        setPauseMusic(game);
        game.ENERJA_FINISH.play();
        // game.SOUND_PAUSED.play()
      }
      break;
    case "first-blood":
      updatePlayWiiMusicWaitLong(game);
      // updateSomeReadySound(game);
      if (
        getIsLongEnoughTime(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setTurnOnRuleSplash("none", game);
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setGoToStateGame("play", game);
        setTurnOnRuleSplash("none", game);
        setResumeMusic(game);
        game.SOUND_START.play();
        setResumePhysics(game);
        console.log("ALL READY");
      }

      break;
    case "screen-clear":
      updatePlayWiiMusicWaitLong(game);
      // updateSomeReadySound(game);
      if (
        getIsLongEnoughTime(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setResumeMusic(game);
        setGoToStateGame("play", game);
        setTurnOnRuleSplash("none", game);
        game.SOUND_START.play();
        setResumePhysics(game);
        console.log("ALL READY");
      }
      break;
    case "end":
      updatePlayWiiMusicWaitShort(game);
      break;
    case "paused":
      updatePlayWiiMusic(game);
      if (
        getIsLongEnoughTime(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setResumeMusic(game);
        setGoToStateGame("play", game);
        setTurnOnRuleSplash("none", game);
        game.SOUND_START.play();
        setResumePhysics(game);
        console.log("ALL READY");
      }
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
        if (getHasThisDurationPassed(player, game.DURATION_GAME_START, game)) {
          setGoToStatePlayer(player, "alive", game);
          setTurnOnActiveHurtEmitter(player);
          setTurnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        updatePrintAllPadsActive(player, game);
        updateAttackEnergy(player, game);
        updateLastDirectionTouched(player);
        updateFrictionGroundX(player, game);
        updateFrictionAirX(player, game);
        updateFrictionWallY(player, game);
        updateFrictionAirY(player, game);
        updateJump(player, game);
        updateControllerMovement(player, game);
        updateUpB(player, game);

        ////////////////////////////////
        ///////// hit => hurt
        ////////////////////////////////
        if (getIsPlayerHit(playerIndex, game)) {
          setGoToStatePlayer(player, "hurt", game);
          setTurnOnActiveHurtEmitter(player);
          setTurnOnVisibleHurtEmitter(player);
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
          player.char.attackEnergy.state = "released";
          setTurnOnPhysicsAttackEnergy(player);
          setBlinkTrue(player);
          setGravityTrue(player);
          game.SOUND_HIT.play();
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setGoToStatePlayer(player, "dead", game);
          setTurnOffActiveHurtEmitter(player);
          setTurnOnVisibleHurtEmitter(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddToShotsMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (getIsScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
          player.char.attackEnergy.state = "released";
          setTurnOnPhysicsAttackEnergy(player);
          setBlinkTrue(player);
          setGravityFalse(player);
          setResetDamage(player);
          setRespawn(player, game);
        }

        // resetMyHitByMatrix(player, playerIndex, game);
        break;
      case "hurt":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        updateLastDirectionTouched(player);
        updateFrictionGroundX(player, game);
        updateFrictionAirX(player, game);
        updateFrictionWallY(player, game);
        updateFrictionAirY(player, game);
        updateJump(player, game);
        updateControllerMovement(player, game);
        updateUpB(player, game);

        ////////////////////////////////
        ///////// !offscreen && duration => alive
        ////////////////////////////////
        if (
          !getIsPlayerOffscreen(player, game) &&
          getHasThisDurationPassed(player, game.DURATION_PLAYER_HURT, game)
        ) {
          setGoToStatePlayer(player, "alive", game);
          setTurnOnActiveHurtEmitter(player);
          setTurnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setGoToStatePlayer(player, "dead", game);
          setTurnOffActiveHurtEmitter(player);
          setTurnOnVisibleHurtEmitter(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddToShotsMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (getIsScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          setTurnOnPhysicsAttackEnergy(player);
          setGravityFalse(player);
          setBlinkTrue(player);
          setResetDamage(player);
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
        if (getHasThisDurationPassed(player, game.DURATION_PLAYER_DEAD, game)) {
          setGoToStatePlayer(player, "alive", game);
          setTurnOnActiveHurtEmitter(player);
          setTurnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });
}
