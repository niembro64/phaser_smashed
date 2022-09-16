import Game from "../Game";
import { updateCamera } from "../helpers/camera";
import { updateDeathsAndKillsMatrices } from "../helpers/damage";
import {
  keepObjectsFromFallingLikeCrazy,
  updateCirclesLocations,
  updateEnergyAttacksWrapScreen,
  updateWallTouchArray,
} from "../helpers/movement";
import {
  updateAttackEnergyFrictionGroundMovement,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updatePadPreviousAndDebounced,
} from "../helpers/pad";
import { updateAllSpriteFilters, updateSpritesFlipX } from "../helpers/sprites";
import { resetAllHitboxes, updateGameTime } from "../helpers/state";
import { updatePlayers } from "../update";

export function gameStatePlay(game: Game, time: number, delta: number): void {
  // BEFORE PLAYERS
  updateGameTime(game, time, delta);
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
  updateSpritesFlipX(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateEnergyAttacksWrapScreen(game);
  updateDeathsAndKillsMatrices(game);
  keepObjectsFromFallingLikeCrazy(game);
  updateCirclesLocations(game);

  // UPDATE PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPreviousAndDebounced(game);
  resetAllHitboxes(game);
}
