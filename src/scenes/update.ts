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
  // game.setGameState____________________,
  setPlayerState,
  getHasNumDeadIncrased,
  getHasGameDurationPassed,
  getIsPlayerHit,
  getLongEnoughTimeDuration,
  updateNumCurrentlyDead,
  updateTimeTime,
  updateGameTime,
  setGameState,
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
  setSoundStartPlay,
  setSoundEnerjaPlay,
  setSoundSquishPlay,
  setSoundProfoundPlay,
  setSoundFirstBloodPlay,
  setSoundFinishPlay,
  setSoundDiePlay,
} from "./helpers/sound";
import {
  setRuleSplashOn,
  setSplashDataOn,
  updateGlassesTransparency,
  updateText,
} from "./helpers/text";
import { updateGameStatePlay } from "./gameStates.ts/gameStatePlay";
import { setPhysicsPause } from "./helpers/physics";

export function setPreUpdate(game: Game): void {
  setMusicPlay(game);
  setGameState(game, "game-state-play");
}

export function update(game: Game, time: number, delta: number): void {
  if (game.debug.numUpdateLoopsToSkip > 0) {
    // if (game.debug.numUpdateLoopsToSkip === 1) {
    // game.players.pop();
    // game.players.pop();
    // }

    game.debug.numUpdateLoopsToSkip--;
    return;
  }

  updateTimeTime(game, time, delta);
  updateGameTime(game, time, delta);
  updateText(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  updateGamePadsConnected(game);
  updatePrintAllPadsActive(game);

  switch (game.gameState.name) {
    case "game-state-start":
      break;
    case "game-state-play":
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      updateGameStatePlay(game, time, delta);

      ////////////////////////////////
      ///////// pausing => pause
      ////////////////////////////////
      if (getIsAnyPlayerPausing(game)) {
        setGameState(game, "game-state-paused");
        // setRuleSplashOn(game, "splash-paused");
        // setMusicPause(game);
        // setSoundStartPlay(game);
        // setPhysicsPause(game);
        // setSplashDataOn(game);
      }

      ////////////////////////////////
      ///////// screenclear & deads++ => play
      ////////////////////////////////
      if (
        getIsScreenClear(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState(game, "game-state-screen-clear");
        setRuleSplashOn(game, "splash-screen-clear");
        setMusicPause(game);
        setSoundEnerjaPlay(game);
        setSoundSquishPlay(game);
        setPhysicsPause(game);
        setSplashDataOn(game);
      }

      ////////////////////////////////
      ///////// firstblood & deads++ => play
      ////////////////////////////////
      if (
        getIsFirstBlood(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState(game, "game-state-first-blood");
        setRuleSplashOn(game, "splash-first-blood");
        setMusicPause(game);
        setSoundProfoundPlay(game);
        setSoundFirstBloodPlay(game);
        setSoundSquishPlay(game);
        setPhysicsPause(game);
        setSplashDataOn(game);
      }

      ////////////////////////////////
      ///////// time => finished
      ////////////////////////////////
      if (game.gameSecondsClock < 1) {
        setGameState(game, "game-state-finished");
        setPhysicsPause(game);
        setRuleSplashOn(game, "splash-finished");
        setMusicPause(game);
        setSoundFinishPlay(game);
        setSplashDataOn(game);
      }
      break;
    case "game-state-first-blood":
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      setPlayWiiMusicWaitLong(game);

      ////////////////////////////////
      ///////// ready & duration => play
      ////////////////////////////////
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState(game, "game-state-play");
        // setRuleSplashOn(game, "splash-none");
        // setPauseWiiMusic(game);
        // setPauseAllReadySounds(game);
        // setMusicResume(game);
        // setSoundStartPlay(game);
        // setPhysicsResume(game);
        // setSplashDataOff(game);
      }

      break;
    case "game-state-screen-clear":
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      setPlayWiiMusicWaitLong(game);

      ////////////////////////////////
      ///////// ready & duration => play
      ////////////////////////////////
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState(game, "game-state-play");
        // setPauseWiiMusic(game);
        // setPauseAllReadySounds(game);
        // setMusicResume(game);
        // setRuleSplashOn(game, "splash-none");
        // setSoundStartPlay(game);
        // setPhysicsResume(game);
        // setSplashDataOff(game);
      }
      break;
    case "game-state-finished":
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      setPlayWiiMusicWaitShort(game);
      break;
    case "game-state-paused":
      playWiiMusic(game);

      ////////////////////////////////
      ///////// ready & duration => play
      ////////////////////////////////
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState(game, "game-state-play");
        // setPauseWiiMusic(game);
        // setPauseAllReadySounds(game);
        // setMusicResume(game);
        // setRuleSplashOn(game, "splash-none");
        // setSoundStartPlay(game);
        // setPhysicsResume(game);
        // setSplashDataOff(game);
      }
      break;
    default:
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////

      break;
  }
}

export function updatePlayers(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    switch (player.state.name) {
      case "player-state-start":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (getHasGameDurationPassed(player, game.DURATION_GAME_START, game)) {
          setPlayerState(player, "player-state-alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
      case "player-state-alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

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
          setPlayerState(player, "player-state-hurt", game);
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
          setPlayerState(player, "player-state-dead", game);
          setActiveHurtEmitterOff(player);
          setVisibleHurtEmitterOn(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            setAddShotToMatrixFirstBlood(player, playerIndex, game);
          }
          if (getIsScreenClear(game)) {
            setAddToShotsMatrixScreenClear(player, playerIndex, game);
          }
          setSoundDiePlay(game);
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
      case "player-state-hurt":
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
          setPlayerState(player, "player-state-alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState(player, "player-state-dead", game);
          setActiveHurtEmitterOff(player);
          setVisibleHurtEmitterOn(player);
          setOnDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            setAddShotToMatrixFirstBlood(player, playerIndex, game);
          }
          if (getIsScreenClear(game)) {
            setAddToShotsMatrixScreenClear(player, playerIndex, game);
          }
          setSoundDiePlay(game);
          player.char.attackEnergy.timestampThrow = game.time.now;
          player.char.attackEnergy.state = "released";
          setPhysicsAttackEnergyOn(player);
          setGravityFalse(player);
          setBlinkTrue(player);
          setResetDamage(player);
          setRespawn(player, game);
        }

        break;
      case "player-state-dead":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        setRespawn(player, game);

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (getHasGameDurationPassed(player, game.DURATION_PLAYER_DEAD, game)) {
          setPlayerState(player, "player-state-alive", game);
          setActiveHurtEmitterOn(player);
          setVisibleHurtEmitterOff(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });

  // console.log("game.input.gamepad.total", game.input.gamepad.total);
}
