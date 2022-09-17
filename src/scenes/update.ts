import Game from "./Game";
import {
  updateControllerMovement,
  updateAttackEnergy,
  getIsAllPlayersReady,
  updatePrintAllPadsActive,
  getIsAnyPlayerPausing,
  updateGamePadsConnected,
} from "./helpers/pad";
import {
  updateJump,
  updateFrictionGroundX,
  updateFrictionAirX,
  updateFrictionAirY,
  updateFrictionWallY,
  updateLastDirectionTouched,
  setRespawn,
  getIsPlayerOffscreen,
  setGravityTrue,
  setGravityFalse,
} from "./helpers/movement";
import { setBlinkFalse, setBlinkTrue } from "./helpers/sprites";
import {
  setGameState____________________,
  setPlayerState____________________,
  getHasNumDeadIncrased,
  getHasGameDurationPassed,
  getIsPlayerHit,
  getLongEnoughTimeDuration,
  updateNumCurrentlyDead,
  updateTimeTime,
} from "./helpers/state";
import {
  setResetDamage,
  setOnDeadUpdateMatrix,
  setActiveHurtEmitterOn,
  setActiveHurtEmitterOff,
  setVisibleHurtEmitterOn,
  setVisibleHurtEmitterOff,
} from "./helpers/damage";
import { setPhysicsAttackEnergyOn, updateUpB } from "./helpers/attacks";
import {
  setAddShotToMatrixFirstBlood,
  setAddToShotsMatrixScreenClear,
  getIsFirstBlood,
  getIsScreenClear,
} from "./helpers/drinking";
import {
  setPauseAllReadySounds,
  setMusicPause,
  setPauseWiiMusic,
  setMusicPlay,
  setPlayWiiMusicWaitShort,
  setPlayWiiMusicWaitLong,
  setMusicResume,
  playWiiMusic,
} from "./helpers/sound";
import {
  setRuleSplashOn,
  updateGlassesTransparency,
  updateText,
} from "./helpers/text";
import { updateGameStatePlay } from "./gameStates.ts/gameStatePlay";
import { setPhysicsPause, setPhysicsResume } from "./helpers/physics";

export function update(game: Game, time: number, delta: number): void {
  updateTimeTime(game, time, delta);
  updateText(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  updateGamePadsConnected(game);
  switch (game.state.name) {
    case "start":
      setGameState____________________(game, "play");
      setRuleSplashOn(game, "none");
      setMusicPlay(game);
      setPauseWiiMusic(game);
      break;
    case "play":
      updateGameStatePlay(game, time, delta);
      if (getIsAnyPlayerPausing(game)) {
        setGameState____________________(game, "paused");
        setRuleSplashOn(game, "paused");
        setMusicPause(game);
        game.SOUND_START.play();
        setPhysicsPause(game);
      }
      if (
        getIsScreenClear(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState____________________(game, "screen-clear");
        setRuleSplashOn(game, "screen-clear");
        setMusicPause(game);
        game.ENERJA_SMASHED.play();
        game.SOUND_SQUISH.play();
        setPhysicsPause(game);
      }
      if (
        getIsFirstBlood(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState____________________(game, "first-blood");
        setRuleSplashOn(game, "first-blood");
        setMusicPause(game);

        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        setPhysicsPause(game);
      }
      if (game.gameSecondsClock < 1) {
        setGameState____________________(game, "end");
        setPhysicsPause(game);
        setRuleSplashOn(game, "finished");
        setMusicPause(game);
        game.ENERJA_FINISH.play();
        // game.SOUND_PAUSED.play()
      }
      break;
    case "first-blood":
      setPlayWiiMusicWaitLong(game);
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState____________________(game, "play");
        setRuleSplashOn(game, "none");
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setMusicResume(game);
        game.SOUND_START.play();
        setPhysicsResume(game);
        console.log("ALL READY");
      }

      break;
    case "screen-clear":
      setPlayWiiMusicWaitLong(game);
      // updateSomeReadySound(game);
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState____________________(game, "play");
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setMusicResume(game);
        setRuleSplashOn(game, "none");
        game.SOUND_START.play();
        setPhysicsResume(game);
        console.log("ALL READY");
      }
      break;
    case "end":
      setPlayWiiMusicWaitShort(game);
      break;
    case "paused":
      playWiiMusic(game);
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState____________________(game, "play");
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setMusicResume(game);
        setRuleSplashOn(game, "none");
        game.SOUND_START.play();
        setPhysicsResume(game);
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
        if (getHasGameDurationPassed(player, game.DURATION_GAME_START, game)) {
          setPlayerState____________________(player, "alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
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
          setPlayerState____________________(player, "hurt", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOn(player);
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
          player.char.attackEnergy.state = "released";
          setPhysicsAttackEnergyOn(player);
          setBlinkTrue(player);
          setGravityTrue(player);
          game.SOUND_HIT.play();
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState____________________(player, "dead", game);
          setActiveHurtEmitterOff(player);
          setVisibleHurtEmitterOn(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddShotToMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (getIsScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
          player.char.attackEnergy.state = "released";
          setPhysicsAttackEnergyOn(player);
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
          getHasGameDurationPassed(player, game.DURATION_PLAYER_HURT, game)
        ) {
          setPlayerState____________________(player, "alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState____________________(player, "dead", game);
          setActiveHurtEmitterOff(player);
          setVisibleHurtEmitterOn(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddShotToMatrixFirstBlood(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          if (getIsScreenClear(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            setAddToShotsMatrixScreenClear(player, playerIndex, game);
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
          }
          game.SOUND_DIE.play();
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          setPhysicsAttackEnergyOn(player);
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
        if (getHasGameDurationPassed(player, game.DURATION_PLAYER_DEAD, game)) {
          setPlayerState____________________(player, "alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });
}
