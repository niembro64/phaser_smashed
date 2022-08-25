import { Time } from "phaser";
import { setAttackEnergyCollideWithPlayers } from "../create";
import Game from "../Game";
import { Player } from "../interfaces";
import { hitbackFly } from "./movement";

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
  console.log(game.gameNanoseconds, game.state.gameStamp + duration + 20);
  if (game.gameNanoseconds > game.state.gameStamp + duration + 20) {
    return true;
  }
  return false;
}
export function longEnoughTime(duration: number, game: Game): boolean {
  console.log(game.timeNanoseconds, game.state.timeStamp + duration + 20);
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
