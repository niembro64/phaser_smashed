import { debug } from 'console';
import Game from '../Game';
import { Player } from '../interfaces';

export function getIsScreenClear(game: Game): boolean {
  // is there three people currently dead
  let numPlayersDead: number = 0;
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].state.name === 'player-state-dead') {
      numPlayersDead++;
    }
  }

  if (numPlayersDead === game.players.length - 1) {
    return true;
  }

  return false;
}
export function getIsFirstBlood(game: Game): boolean {
  // is there only one player who has died
  let numPlayersDied = 0;
  let temp = 0;
  for (let i = 0; i < game.players.length; i++) {
    for (let j = 0; j < game.players.length; j++) {
      temp += game.numberKilledByMatrix[i][j];
    }
    if (temp > 0) {
      numPlayersDied++;
    }
    temp = 0;
  }

  if (
    numPlayersDied === 1 &&
    getIsAnyPlayerCurrentlyDead(game)
    // && isAnyPlayerOffscreen(game)
  ) {
    return true;
  }

  return false;
}

export function getIsAnyPlayerCurrentlyDead(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].state.name === 'player-state-dead') {
      return true;
    }
  }
  return false;
}

export function setAddShotToMatrixFirstBlood(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (player.state.name !== 'player-state-dead') {
    return;
  }
  let hit: boolean = false;

  game.players.forEach((pj, j) => {
    if (game.wasLastHitByMatrix[playerIndex][j]) {
      game.numberShotsTakenByMeMatrix[playerIndex][j]++;
      hit = true;
    }
  });
  if (!hit) {
    game.numberShotsTakenByMeMatrix[playerIndex][playerIndex]++;
  }
}

export function setAddToShotsMatrixScreenClear(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  // add shots for each that isn't alive
  // if dead add shot by last touched

  let hit = false;

  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].state.name === 'player-state-dead') {
      for (let j = 0; j < game.players.length; j++) {
        if (game.wasLastHitByMatrix[i][j]) {
          hit = true;
          game.numberShotsTakenByMeMatrix[i][j]++;
        }
      }
      if (!hit) {
        game.numberShotsTakenByMeMatrix[i][i]++;
        hit = false;
      }
    }
  }
}

export function updateNumShotsLeft(game: Game): void {
  if (!game.debug.ModeInfinity) {
    return;
  }

  game.shotsLeftPrev = game.shotsLeftCurr;

  let shots = 0;
  game.players.forEach((player, playerIndex) => {
    for (let i = 0; i < game.players.length; i++) {
      shots += game.numberShotsTakenByMeMatrix[playerIndex][i];
    }
  });
  game.shotsLeftCurr = game.debug.InfinityShots - shots;
}
