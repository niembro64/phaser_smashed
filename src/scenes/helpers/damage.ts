import { SignPrivateKeyInput } from "crypto";
import { isMainThread } from "worker_threads";
import Game from "../Game";
import { AttackEnergy, NormalizedVector, Player } from "../interfaces";
import { hitbackFly } from "./movement";
import { attackEnergy } from "./pad";

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

export function getNormalizedVector(
  attack: AttackEnergy,
  player: Player
): NormalizedVector {
  let newX = player.char.sprite.x - attack.sprite.x;
  let newY = player.char.sprite.y - attack.sprite.y;
  let newRatio = Math.sqrt(newX * newX + newY * newY);

  return { x: newX / newRatio, y: newY / newRatio };
}
