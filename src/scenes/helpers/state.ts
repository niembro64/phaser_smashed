import { setAttackEnergyCollideWithPlayers } from "../create";
import Game from "../Game";
import { Player } from "../interfaces";
import { hitbackFly } from "./movement";

export function goToStateGame(
  state: "start" | "play" | "first-blood" | "screen-clear",
  game: Game
): void {
  game.gameState.name = state;
  game.gameState.timestamp = game.millisecondsTime;
}

export function goToStatePlayer(
  player: Player,
  state: "start" | "alive" | "dead" | "hurt",
  game: Game
): void {
  player.state.name = state;
  player.state.timestamp = game.millisecondsTime;
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

export function updateTime(game: Game): void {
  game.NanosecondsTime = game.time.now;
  game.millisecondsTime = Math.floor(game.NanosecondsTime);
  game.secondsTimePrev = game.secondsTime;
  game.secondsTime = Math.floor(game.NanosecondsTime / 1000);
  if (game.secondsTime !== game.secondsTimePrev) {
    game.secondsTimeClock++;
  }

  game.clockTime.minutes = Math.floor(game.secondsTimeClock / 60);
  game.clockTime.seconds = Math.floor(game.secondsTimeClock % 60);
}

export function hasThisDurationPassed(
  player: Player,
  duration: number,
  game: Game
): boolean {
  if (game.millisecondsTime > player.state.timestamp + duration) {
    return true;
  }
  return false;
}
