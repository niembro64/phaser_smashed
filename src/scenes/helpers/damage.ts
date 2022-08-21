import Game from "../Game";
import { Player } from "../interfaces";

export function addDamage(player: Player, damage: number): void {
  if (player.state.name === "alive") {
    player.char.damage += damage;
  }
}
