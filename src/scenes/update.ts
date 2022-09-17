import Game from "./Game";
import {
  controllerMovement,
  attackEnergy,
  getIsAllPlayersReady,
  printAllPadsActive,
  getIsAnyPlayerPausing,
  updateGamePadsConnected,
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
  ___setGameState,
  ___setPlayerState,
  getHasNumDeadIncrased,
  hasThisDurationPassed,
  isPlayerHit,
  getLongEnoughTimeDuration,
  updateNumCurrentlyDead,
  updateTimeTime,
} from "./helpers/state";
import {
  resetDamage,
  onDeadUpdateMatrix,
  turnOnActiveHurtEmitter,
  turnOffActiveHurtEmitter,
  turnOnVisibleHurtEmitter,
  turnOffVisibleHurtEmitter,
} from "./helpers/damage";
import { turnOnPhysicsAttackEnergy, upB } from "./helpers/attacks";
import {
  addShotToMatrixFirstBlood,
  addToShotsMatrixScreenClear,
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
      ___setGameState("play", game);
      setRuleSplashOn("none", game);
      setMusicPlay(game);
      setPauseWiiMusic(game);
      break;
    case "play":
      updateGameStatePlay(game, time, delta);
      if (getIsAnyPlayerPausing(game)) {
        ___setGameState("paused", game);
        setRuleSplashOn("paused", game);
        setMusicPause(game);
        game.SOUND_START.play();
        setPhysicsPause(game);
      }
      if (
        getIsScreenClear(game) &&
        getHasNumDeadIncrased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        ___setGameState("screen-clear", game);
        setRuleSplashOn("screen-clear", game);
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
        ___setGameState("first-blood", game);
        setRuleSplashOn("first-blood", game);
        setMusicPause(game);

        game.SOUND_INTRO.play();
        game.SOUND_FIRST_BLOOD.play();
        game.SOUND_SQUISH.play();
        setPhysicsPause(game);
      }
      if (game.gameSecondsClock < 1) {
        ___setGameState("end", game);
        setPhysicsPause(game);
        setRuleSplashOn("finished", game);
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
        ___setGameState("play", game);
        setRuleSplashOn("none", game);
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setRuleSplashOn("none", game);
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
        ___setGameState("play", game);
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setMusicResume(game);
        setRuleSplashOn("none", game);
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
        setPauseWiiMusic(game);
        setPauseAllReadySounds(game);
        setMusicResume(game);
        ___setGameState("play", game);
        setRuleSplashOn("none", game);
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
        if (hasThisDurationPassed(player, game.DURATION_GAME_START, game)) {
          ___setPlayerState(player, "alive", game);
          turnOnActiveHurtEmitter(player);
          turnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
      case "alive":
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        printAllPadsActive(player, game);
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
          ___setPlayerState(player, "hurt", game);
          turnOnActiveHurtEmitter(player);
          turnOnVisibleHurtEmitter(player);
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
          ___setPlayerState(player, "dead", game);
          turnOffActiveHurtEmitter(player);
          turnOnVisibleHurtEmitter(player);
          onDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addShotToMatrixFirstBlood(player, playerIndex, game);
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
          ___setPlayerState(player, "alive", game);
          turnOnActiveHurtEmitter(player);
          turnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (isPlayerOffscreen(player, game)) {
          ___setPlayerState(player, "dead", game);
          turnOffActiveHurtEmitter(player);
          turnOnVisibleHurtEmitter(player);
          onDeadUpdateMatrix(playerIndex, game);
          if (getIsFirstBlood(game)) {
            console.log("HIT BY MATRIX", game.wasLastHitByMatrix);
            console.log("SHOTS", game.numberShotsTakenByMeMatrix);
            addShotToMatrixFirstBlood(player, playerIndex, game);
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
          ___setPlayerState(player, "alive", game);
          turnOnActiveHurtEmitter(player);
          turnOffVisibleHurtEmitter(player);
          setGravityTrue(player);
          setBlinkFalse(player);
        }

        break;
    }
  });
}
