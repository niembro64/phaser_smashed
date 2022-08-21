import Game from "../Game";
import { Player } from "../interfaces";
import { hitbackFly } from "./movement";

export function addDamage(
  player: Player,
  damage: number,
  hitback: number,
  game: Game
): void {
  if (player.state.name === "alive") {
    player.char.damage += damage;

    hitbackFly(player, game, hitback);
  }
}

export function removeDamage(player: Player, damage: number): void {
  if (player.state.name === "alive") {
    player.char.damage -= damage;
  }
}

export function resetDamage(player: Player): void {
  player.char.damage = 0;
}
