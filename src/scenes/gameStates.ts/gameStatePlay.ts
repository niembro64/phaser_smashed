import Game from "../Game";
import { updateCamera } from "../helpers/camera";
import { updateChomp } from "../helpers/chomp";
import { updateDeathsAndKillsMatrices } from "../helpers/damage";
import {
  updateKeepObjectsFromFallingLikeCrazy,
  updateCirclesLocations,
  updateAttackEnergyWrapScreen,
  updateWallTouchArray,
  updateTable,
  updateAttackEnergyFollow,
  updateAttackEnergyFlipX,
} from "../helpers/movement";
import {
  updateAttackEnergyFrictionGroundMovement,
  updateAttackEnergyFrictionGroundRotation,
  updateAttackEnergyFrictionWall,
  updatePadPreviousAndDebounced,
} from "../helpers/pad";
import { updateAllSpriteFilters, updateSpritesFlipX } from "../helpers/sprites";
import { updateResetAllHitboxesAttackEnergy } from "../helpers/state";
import { updatePlayers } from "../update";

export function updateGameStatePlay(
  game: Game,
  time: number,
  delta: number
): void {
  // BEFORE PLAYERS
  updateAttackEnergyFollow(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
  updateSpritesFlipX(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateAttackEnergyWrapScreen(game);
  updateAttackEnergyFlipX(game);
  updateDeathsAndKillsMatrices(game);
  updateKeepObjectsFromFallingLikeCrazy(game);
  updateCirclesLocations(game);
  updateChomp(game);
  updateTable(game);

  // UPDATE PLAYERS
  updatePlayers(game);
  // updatePhysicalAttackFollowPlayers(game);

  // AFTER PLAYERS
  updatePadPreviousAndDebounced(game);
  updateResetAllHitboxesAttackEnergy(game);
}
