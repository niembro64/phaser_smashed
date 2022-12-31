import Game from "../Game";
import { Player } from "../interfaces";

export function powerDarkToPlayer(player: Player, game: Game): void {
  player.emitterDark.active = true;
  player.emitterDark.on = true;
}
