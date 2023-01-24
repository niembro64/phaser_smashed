import Game from "../Game";
import { Player, Position, xyVector } from "../interfaces";
import { getNormalizedVector } from "./damage";
import { getNearestPlayerAliveXY } from "./movement";

export function getIsBot(player: Player, game: Game): boolean {
  if ((player.inputType = 1)) {
    return true;
  }
  return false;
}

export function updateMoveBot(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  let nearestPlayerPosition: Position = getNearestPlayerAliveXY(
    player,
    playerIndex,
    game
  );

  let movementVector: xyVector = getNormalizedVector(
    player.char.sprite.x,
    player.char.sprite.y,
    nearestPlayerPosition.x,
    nearestPlayerPosition.y
  );

  console.log(nearestPlayerPosition);

  if (movementVector.x > 0) {
    player.padCurr.right = true;
    player.padCurr.left = false;
  } else {
    player.padCurr.left = true;
    player.padCurr.right = false;
  }
}
