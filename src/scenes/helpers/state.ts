import Game from '../Game';
import { Player } from '../interfaces';

export function goToStateGame(
  state: 'start' | 'play' | 'pause' | 'first-blood' | 'screen-clear' | 'end',
  game: Game
): void {
  game.state.name = state;
  game.state.gameStamp = game.gameNanoseconds;
  game.state.timeStamp = game.timeNanoseconds;
}

export function goToStatePlayer(
  player: Player,
  state: 'start' | 'alive' | 'dead' | 'hurt',
  game: Game
): void {
  player.state.name = state;
  player.state.gameStamp = game.gameNanoseconds;
  player.state.timeStamp = game.timeNanoseconds;
}

export function hasNumDeadIncrased(game: Game): boolean {
  if (game.numDead === game.numDeadPrev) {
    return false;
  }
  return true;
}
export function hasNumDead(game: Game): boolean {
  if (game.numDead === game.numDeadPrev) {
    return false;
  }
  return true;
}
export function updateNumCurrentlyDead(game: Game): void {
  game.numDeadPrev = game.numDead;
  game.numDead = 0;
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    game.numDead += game.players[i].state.name === 'dead' ? 1 : 0;
  }
}

export function resetAllHitboxes(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((p, i) => {
      game.currentlyOverlappingSpritesMatrix[playerIndex][i] = false;
    });
  });
}

export function isPlayerHit(playerIndex: number, game: Game): boolean {
  for (let j = 0; j < game.PLAYER_CHOICES.length; j++) {
    if (game.currentlyOverlappingSpritesMatrix[playerIndex][j]) {
      return true;
    }
  }
  return false;
}

export function longEnoughGame(duration: number, game: Game): boolean {
  if (game.gameNanoseconds > game.state.gameStamp + duration + 20) {
    return true;
  }
  return false;
}
export function longEnoughTime(duration: number, game: Game): boolean {
  // console.log(
  //   "HERE",
  //   game.timeNanoseconds,
  //   game.state.timeStamp + duration + 20
  // );
  if (game.timeNanoseconds > game.state.timeStamp + duration + 20) {
    return true;
  }
  return false;
}

export function updateGameTime(game: Game, time: number, delta: number): void {
  game.gameNanoseconds += delta;
  game.gameSecondsPrev = game.gameSeconds;
  game.gameSeconds = Math.floor(game.gameNanoseconds / 1000);
  if (game.gameSeconds !== game.gameSecondsPrev) {
    game.gameSecondsClock--;
  }

  game.gameClock.minutes = Math.floor(game.gameSecondsClock / 60);
  game.gameClock.seconds = Math.floor(game.gameSecondsClock % 60);
}

export function updateTimeTime(game: Game, time: number, delta: number): void {
  game.timeNanoseconds += delta;
  game.timeSecondsPrev = game.timeSeconds;
  game.timeSeconds = Math.floor(game.timeNanoseconds / 1000);
  if (game.timeSeconds !== game.timeSecondsPrev) {
    game.timeSecondsClock++;
  }

  game.timeClock.minutes = Math.floor(game.timeSecondsClock / 60);
  game.timeClock.seconds = Math.floor(game.timeSecondsClock % 60);
}

export function hasThisDurationPassed(
  player: Player,
  duration: number,
  game: Game
): boolean {
  if (game.gameNanoseconds > player.state.gameStamp + duration) {
    return true;
  }
  return false;
}
