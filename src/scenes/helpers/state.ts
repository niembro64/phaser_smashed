import Game from "../Game";
import { Player } from "../interfaces";
import { hitbackFly } from "./movement";

export function goToState(
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
      game.overlappingMatrix[playerIndex][i] = false;
    });
  });
}

export function isPlayerHit(playerIndex: number, game: Game): boolean {
  for (let j = 0; j < game.players.length; j++) {
    if (game.overlappingMatrix[playerIndex][j]) {
      return true;
    }
  }
  return false;
}

export function updateTime(game: Game): void {
  game.NanosecondsTime = game.time.now;
  game.millisecondsTime = Math.floor(game.NanosecondsTime);
  game.secondsTime = Math.floor(game.NanosecondsTime / 1000);

  game.clockTime.minutes = Math.floor(game.secondsTime / 60);
  game.clockTime.seconds = Math.floor(game.secondsTime % 60);
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
