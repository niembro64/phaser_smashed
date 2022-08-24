import Game from "../Game";
import { updateCamera } from "../helpers/camera";
import { updateDeathsAndKillsMatrices } from "../helpers/damage";
import { keepObjectsFromFallingLikeCrazy, updateCirclesLocations, updateEnergyAttacksWrapScreen, updateWallTouchArray } from "../helpers/movement";
import { assignGamePadsConnected, updateAttackEnergyFrictionGroundMovement, updateAttackEnergyFrictionGroundRotation, updateAttackEnergyFrictionWall, updatePadPrevious } from "../helpers/pad";
import { updateAllSpriteFilters, updateSpritesFlipX } from "../helpers/sprites";
import { resetAllHitboxes, updateTime } from "../helpers/state";
import { updateText } from "../helpers/text";
import { updatePlayers } from "../update";

export function gameStatePlay(game: Game): void {
  // BEFORE PLAYERS
  updateTime(game);
  assignGamePadsConnected(game);
  updateWallTouchArray(game);
  updateCamera(game);
  updateAllSpriteFilters(game);
  updateSpritesFlipX(game);
  updateText(game);
  updateAttackEnergyFrictionGroundRotation(game);
  updateAttackEnergyFrictionGroundMovement(game);
  updateAttackEnergyFrictionWall(game);
  updateEnergyAttacksWrapScreen(game);
  updateDeathsAndKillsMatrices(game);
  keepObjectsFromFallingLikeCrazy(game);
  updateCirclesLocations(game);

  // PLAYERS
  updatePlayers(game);

  // AFTER PLAYERS
  updatePadPrevious(game);
  resetAllHitboxes(game);
}
