import Game from "../Game";
import { updateCamera } from "../helpers/camera";
import { updateDeathsAndKillsMatrices } from "../helpers/damage";
import {
  updateKeepObjectsFromFallingLikeCrazy,
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
import { updateResetAllHitboxes, updateGameTime } from "../helpers/state";
import { updatePlayers } from "../update";

export function updateGameStatePlay(game: Game, time: number, delta: number): void {
  // BEFORE PLAYERS
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
  updateSpritesFlipX(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateEnergyAttacksWrapScreen(game);
  updateDeathsAndKillsMatrices(game);
  updateKeepObjectsFromFallingLikeCrazy(game);
  updateCirclesLocations(game);

  // UPDATE PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPreviousAndDebounced(game);
  updateResetAllHitboxes(game);
}
