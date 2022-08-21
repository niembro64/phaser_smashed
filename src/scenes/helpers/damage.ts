import Game from "../Game";
import { Player } from "../interfaces";
import { hitbackFly } from "./movement";

export function onHitHandler(
  player: Player,
  damage: number,
  hitbackx: number,
  hitbacky: number,
  game: Game
): void {
  if (player.state.name === "alive") {
    player.char.damage += damage;

    hitbackFly(player, game, hitbackx, hitbacky);
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

// export function addHit(player: Player, game: Game): void {
// }
