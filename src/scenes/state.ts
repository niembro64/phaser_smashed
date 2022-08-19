import { Player } from "./interfaces";

export function goToState(
  player: Player,
  state: "start" | "alive" | "dead" | "hurt"
): void {
  player.state = state;
}
