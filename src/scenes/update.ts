import Game from './Game';
import {
  updateControllerMovement,
  updateAttackEnergy,
  getIsAllPlayersReady,
  getIsAnyPlayerPausing,
  updateGamePadsMaster,
  debugUpdatePrintAllControllerButtonsWhenActive,
  debugUpdateControllersPrintConnected,
} from './helpers/pad';
import {
  updateJumpPhysical,
  updateFrictionGroundX,
  updateFrictionAirX,
  updateFrictionAirY,
  updateFrictionWallY,
  updateLastDirectionTouched,
  setRespawn,
  getIsPlayerOffscreen,
  updateJumpPhysicalOnWall,
  updateJumpFloat,
} from './helpers/movement';
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
  getHasGameDurationPassedAttack,
  setAttackPhysicalState,
} from './helpers/state';
import {
  updatePhysicalAttackFollowsPlayer,
  updateJumpEnergy,
} from './helpers/attacks';
import {
  getIsFirstBlood,
  getIsScreenClear,
  updateNumShotsLeft,
} from './helpers/drinking';
import {
  setMusicPlay,
  setPlayWiiMusicWaitShort,
  setPlayWiiMusicWaitLong,
  playWiiMusic,
} from './helpers/sound';
import { updateGlassesTransparency, updateText } from './helpers/text';
import { updateGameStatePlay } from './gameStates.ts/gameStatePlay';
import { Player } from './interfaces';
import { updatePlayerDarknessEvents } from './helpers/powers';
import { printKeyboard } from './helpers/keyboard';

export function setPreUpdate(game: Game): void {
  setMusicPlay(game);
  setGameState(game, 'game-state-play');
  game.loaded = true;
  console.log('players', game.players);
}

export function update(game: Game, time: number, delta: number): void {
  if (game.debug.UpdateLoopsNumSkip > 0) {
    game.debug.UpdateLoopsNumSkip--;
    return;
  }

  printKeyboard(game);

  updateTimeTime(game, time, delta);
  updateGameTime(game, time, delta);
  updateText(game);
  updateNumShotsLeft(game);
  updateNumCurrentlyDead(game);
  updateGlassesTransparency(game);
  updateGamePadsMaster(game);
  debugUpdatePrintAllControllerButtonsWhenActive(game);
  debugUpdateControllersPrintConnected(game);

  switch (game.gameState.name) {
    case 'game-state-start':
      break;
    case 'game-state-play':
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      updateGameStatePlay(game, time, delta);

      ////////////////////////////////
      ///////// pausing => pause
      ////////////////////////////////
      if (getIsAnyPlayerPausing(game)) {
        setGameState(game, 'game-state-paused');
      }

      ////////////////////////////////
      ///////// screenclear & deads++ => play
      ////////////////////////////////
      if (
        getIsScreenClear(game) &&
        getHasNumDeadIncreased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState(game, 'game-state-screen-clear');
      }

      ////////////////////////////////
      ///////// firstblood & deads++ => play
      ////////////////////////////////
      if (
        getIsFirstBlood(game) &&
        getHasNumDeadIncreased(game)
        // longEnoughGame(game.DURATION_PLAYER_DEAD, game)
      ) {
        setGameState(game, 'game-state-first-blood');
      }

      ////////////////////////////////
      ///////// GAME ENDING CONDITIONS
      ////////////////////////////////
      ///////// done shots => finished
      ///////// time => finished
      ////////////////////////////////
      if (game.debug.ModeInfinity && game.shotsLeftCurr < 1) {
        setGameState(game, 'game-state-finished');
      }
      if (!game.debug.ModeInfinity && game.gameSecondsClock < 1) {
        setGameState(game, 'game-state-finished');
      }

      break;
    case 'game-state-first-blood':
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
        setGameState(game, 'game-state-play');
      }

      break;
    case 'game-state-screen-clear':
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
        setGameState(game, 'game-state-play');
      }
      break;
    case 'game-state-finished':
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      setPlayWiiMusicWaitShort(game);
      break;
    case 'game-state-paused':
      playWiiMusic(game);

      ////////////////////////////////
      ///////// ready & duration => play
      ////////////////////////////////
      if (
        getLongEnoughTimeDuration(game.DURATION_GAME_SHOT, game) &&
        getIsAllPlayersReady(game)
      ) {
        setGameState(game, 'game-state-play');
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
      case 'player-state-start':
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////

        ////////////////////////////////
        ///////// duration => alive
        ////////////////////////////////
        if (
          getHasGameDurationPassedPlayer(player, game.DURATION_GAME_START, game)
        ) {
          setPlayerState(player, playerIndex, 'player-state-alive', game);
        }

        break;
      case 'player-state-alive':
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        updateAttackEnergy(player, game);
        updateLastDirectionTouched(player);
        updateFrictionGroundX(player, game);
        updateFrictionAirX(player, game);
        updateFrictionWallY(player, game);
        updateFrictionAirY(player, game);
        updateJumpPhysicalOnWall(player, game);
        updateJumpPhysical(player, game);
        updateJumpFloat(player, game);
        updateControllerMovement(player, game);
        updateJumpEnergy(player, game);
        updatePlayerDarknessEvents(game);

        // UPDATE ATTACK PHYSICAL
        updateAttackPhysicals(player, playerIndex, game);

        ////////////////////////////////
        ///////// attackPhysical hit => hurt
        ///////// NOTE: handled in onHitHandlerAttackPhysical()
        ////////////////////////////////

        ////////////////////////////////
        ///////// attackEnergy hit => hurt
        ////////////////////////////////
        if (getIsPlayerHitAttackEnergy(playerIndex, game)) {
          setPlayerState(player, playerIndex, 'player-state-hurt', game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState(player, playerIndex, 'player-state-dead', game);
        }

        // resetMyHitByMatrix(player, playerIndex, game);
        break;
      case 'player-state-hurt':
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        updateLastDirectionTouched(player);
        updateFrictionGroundX(player, game);
        updateFrictionWallY(player, game);
        updateFrictionAirX(player, game);
        updateFrictionAirY(player, game);
        updateJumpPhysical(player, game);
        updateControllerMovement(player, game);
        updateJumpEnergy(player, game);

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
          setPlayerState(player, playerIndex, 'player-state-alive', game);
        }

        ////////////////////////////////
        ///////// offscreen => dead
        ////////////////////////////////
        if (getIsPlayerOffscreen(player, game)) {
          setPlayerState(player, playerIndex, 'player-state-dead', game);
        }

        break;
      case 'player-state-dead':
        ////////////////////////////////
        ///////// WHILE IN LOOP
        ////////////////////////////////
        setRespawn(player, game);
        updateJumpEnergy(player, game);

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
          setPlayerState(player, playerIndex, 'player-state-alive', game);
        }

        break;
    }
  });

  // console.log("game.input.gamepad.total", game.input.gamepad.total);
  // game.loaded = true;
}

export function updateAttackPhysicals(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  let ap = player.char.attackPhysical;

  switch (ap.state.name) {
    case 'attackphysical-state-on':
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////
      updatePhysicalAttackFollowsPlayer(player, game);

      ////////////////////////////////
      ///////// duration => cooldown
      ////////////////////////////////
      if (
        getHasGameDurationPassedAttack(
          ap,
          ap.durationAttack,
          game
        )
      ) {
        setAttackPhysicalState(
          ap,
          player,
          playerIndex,
          'attackphysical-state-cooldown',
          game
        );
      }
      break;
    case 'attackphysical-state-cooldown':
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////

      ////////////////////////////////
      ///////// duration => off
      ////////////////////////////////
      if (
        getHasGameDurationPassedAttack(
          ap,
          ap.durationCooldown,
          game
        )
      ) {
        setAttackPhysicalState(
          ap,
          player,
          playerIndex,
          'attackphysical-state-off',
          game
        );
      }
      break;
    case 'attackphysical-state-off':
      ////////////////////////////////
      ///////// WHILE IN LOOP
      ////////////////////////////////

      ////////////////////////////////
      ///////// button => on
      ////////////////////////////////
      // if (player.gamepad.A && !player.padPrev.A) {
      //   setAttackPhysicalState(
      //     attackPhysical,
      //     player,
      //     playerIndex,
      //     "attackphysical-state-on",
      //     game
      //   );
      // }
      if (player.padCurr.A && !player.padPrev.A) {
        setAttackPhysicalState(
          ap,
          player,
          playerIndex,
          'attackphysical-state-on',
          game
        );
      }
  }
}
