import { Player } from "./interfaces";

export function setState(
    player: Player,
    state: "start" | "dead" | "air" | "ground" | "wall" | "hurt"
): void {
    player.state = state;
}
