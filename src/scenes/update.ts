import Game from "./Game";
import {
  updateControllerMovement,
  updateAttackEnergy,
  getIsAllPlayersReady,
  getIsAnyPlayerPausing,
  updateGamePadsConnected,
  debugUpdatePrintAllControllerButtonsWhenActive,
  debugUpdateControllersPrintConnected,
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
  getHasNumDeadIncreased,
  getHasGameDurationPassedPlayer,
  getIsPlayerHitAttackEnergy,
  getLongEnoughTimeDuration,
  updateNumCurrentlyDead,
  updateTimeTime,
  updateGameTime,
  setGameState,
} from "./helpers/state";
import { updateAttackPhysicalSwitch } from "./helpers/damage";
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

export function setPreUpdate(game: Game): void {
  setMusicPlay(game);
  setGameState(game, "game-state-play");
  game.loaded = true;
}

export function update(game: Game, time: number, delta: number): void {
  if (game.debug.setUpdateLoopsNumSkip > 0) {
    game.debug.setUpdateLoopsNumSkip--;
    return;
  }

  updateTimeTime(game, time, delta);
  updateGameTime(game, time, delta);
  updateText(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  updateGamePadsConnected(game);
  debugUpdatePrintAllControllerButtonsWhenActive(game);
  debugUpdateControllersPrintConnected(game);

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
        getHasNumDeadIncreased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState(game, "game-state-screen-clear");
      }

      ////////////////////////////////
      ///////// firstblood & deads++ => play
      ////////////////////////////////
      if (
        getIsFirstBlood(game) &&
        getHasNumDeadIncreased(game)
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
        if (
          getHasGameDurationPassedPlayer(player, game.DURATION_GAME_START, game)
        ) {
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

        // UPDATE ATTACK PHYSICAL
        updateAttackPhysicalSwitch(player, playerIndex, game);

        ////////////////////////////////
        ///////// attackPhysical hit => hurt
        ///////// NOTE: handled in onHitHandlerAttackPhysical()
        ////////////////////////////////

        ////////////////////////////////
        ///////// attackEnergy hit => hurt
        ////////////////////////////////
        if (getIsPlayerHitAttackEnergy(playerIndex, game)) {
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
          getHasGameDurationPassedPlayer(
            player,
            game.DURATION_PLAYER_HURT,
            game
          )
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
        if (
          getHasGameDurationPassedPlayer(
            player,
            game.DURATION_PLAYER_DEAD,
            game
          )
        ) {
          setPlayerState(player, playerIndex, "player-state-alive", game);
        }

        break;
    }
  });

  // console.log("game.input.gamepad.total", game.input.gamepad.total);
  // game.loaded = true;
}
