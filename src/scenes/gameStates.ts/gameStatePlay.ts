import Game from "../Game";
import { updateCamera } from "../helpers/camera";
import { updateDeathsAndKillsMatrices } from "../helpers/damage";
import {
  updateKeepObjectsFromFallingLikeCrazy,
  updateCirclesLocations,
  updateEnergyAttacksWrapScreen,
  updateWallTouchArray,
  updateTable,
} from "../helpers/movement";
import {
  updateAttackEnergyFrictionGroundMovement,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updatePadPreviousAndDebounced,
} from "../helpers/pad";
import { updateAllSpriteFilters, updateSpritesFlipX } from "../helpers/sprites";
import { updateResetAllHitboxesAttackEnergy, updateGameTime } from "../helpers/state";
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
  updateTable(game);

  // UPDATE PLAYERS
  updatePlayers(game);
  // updatePhysicalAttackFollowPlayers(game);

  // AFTER PLAYERS
  updatePadPreviousAndDebounced(game);
  updateResetAllHitboxesAttackEnergy(game);
}
