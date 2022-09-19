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
} from "./helpers/movement";
import {
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
import {} from "./helpers/damage";
import { updateUpB } from "./helpers/attacks";
import { getIsFirstBlood, getIsScreenClear } from "./helpers/drinking";
import {
  setMusicPlay,
  setPlayWiiMusicWaitShort,
  setPlayWiiMusicWaitLong,
  playWiiMusic,
} from "./helpers/sound";
import { updateGlassesTransparency, updateText } from "./helpers/text";
import { updateGameStatePlay } from "./gameStates.ts/gameStatePlay";

// export function parentContextTester(game: Game): void {
//   game.parentContext.setAdder(game.parentContext.adder++);
//   console.log("game.parentContext.adder", game.parentContext.adder);
//   console.log("game.parentContext.a", game.parentContext.a);
// }

export function setPreUpdate(game: Game): void {
  setMusicPlay(game);
  setGameState(game, "game-state-play");
}

export function update(game: Game, time: number, delta: number): void {
  if (game.debug.numUpdateLoopsToSkip > 0) {
    game.debug.numUpdateLoopsToSkip--;
    return;
  }
  // parentContextTester(game);
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
      }

      ////////////////////////////////
      ///////// time => finished
      ////////////////////////////////
      if (game.gameSecondsClock < 1) {
        setGameState(game, "game-state-finished");
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
          setPlayerState(player, playerIndex, "player-state-alive", game);
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
          setPlayerState(player, playerIndex, "player-state-hurt", game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState(player, playerIndex, "player-state-dead", game);
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
          setPlayerState(player, playerIndex, "player-state-alive", game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState(player, playerIndex, "player-state-dead", game);
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
          setPlayerState(player, playerIndex, "player-state-alive", game);
        }

        break;
    }
  });

  // console.log("game.input.gamepad.total", game.input.gamepad.total);
}
