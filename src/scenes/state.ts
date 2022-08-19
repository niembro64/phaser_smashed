import Game from "./Game";
import { Player } from "./interfaces";
import { hitThenFly } from "./movement";

export function goToState(
  player: Player,
  state: "start" | "alive" | "dead" | "hurt"
): void {
  player.state = state;
}

export function hitboxOverlapReset(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    game.players.forEach((p, i) => {
      game.hitboxOverlap[playerIndex][i] = false;
    });
  });
}

export function checkHitboxes(pi: Player, i: number, game: Game): void {
  game.players.forEach((pj, j) => {
    if (game.hitboxOverlap[i][j]) {
      pi.char.sprite.body.allowGravity = false;
      hitThenFly(pi);
      goToState(pi, "hurt");
    }
  });
}
