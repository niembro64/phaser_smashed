import Game from "../Game";
import { Player } from "../interfaces";
import { hitThenFly } from "./movement";

export function goToState(
  player: Player,
  state: "start" | "alive" | "dead" | "hurt"
): void {
  player.state = state;
}

export function resetAllHitboxes(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((p, i) => {
      game.hitboxOverlap[playerIndex][i] = false;
    });
  });
}

export function isPlayerHit(playerIndex: number, game: Game): boolean {
  for (let j = 0; j < game.players.length; j++) {
    if (game.hitboxOverlap[playerIndex][j]) {
      return true;
    }
  }
  return false;
}

export function updateTime(game: Game): void {
  game.timeNanoseconds = game.time.now;
  game.timeMilliseconds = Math.floor(game.timeNanoseconds);
  game.timeSeconds = Math.floor(game.timeNanoseconds / 1000);
}
