import Game from "../Game";
import { Player } from "../interfaces";

export function goToStateGame(
  state: "start" | "play" | "first-blood" | "screen-clear",
  game: Game
): void {
  game.state.name = state;
  game.state.gameStamp = game.gameNanoseconds;
  game.state.timeStamp = game.timeNanoseconds;
}

export function goToStatePlayer(
  player: Player,
  state: "start" | "alive" | "dead" | "hurt",
  game: Game
): void {
  player.gameState.name = state;
  player.gameState.gameStamp = game.gameNanoseconds;
  player.gameState.timeStamp = game.timeNanoseconds;
}

export function hasNumDeadIncrased(game: Game): boolean {
  if (game.numDead > game.numDeadPrev) {
    return true;
  }
  return false;
}
export function hasNumDeadChanged(game: Game): boolean {
  if (game.numDead === game.numDeadPrev) {
    return false;
  }
  return true;
}
export function updateNumCurrentlyDead(game: Game): void {
  game.numDeadPrev = game.numDead;
  game.numDead = 0;
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    game.numDead += game.players[i].gameState.name === "dead" ? 1 : 0;
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
  for (let j = 0; j < game.players.length; j++) {
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
    game.gameSecondsClock++;
  }

  game.gameClock.gameMinutes = Math.floor(game.gameSecondsClock / 60);
  game.gameClock.gameSeconds = Math.floor(game.gameSecondsClock % 60);
}

export function updateTimeTime(game: Game, time: number, delta: number): void {
  game.timeNanoseconds = time;
}

export function hasThisDurationPassed(
  player: Player,
  duration: number,
  game: Game
): boolean {
  if (game.gameNanoseconds > player.gameState.gameStamp + duration) {
    return true;
  }
  return false;
}
