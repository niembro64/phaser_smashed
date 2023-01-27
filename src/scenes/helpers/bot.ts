import Game, { SCREEN_DIMENSIONS } from '../Game';
import { Player, Position, xyVector } from '../interfaces';
import { getNormalizedVector } from './damage';
import {
  getNearestPlayerAliveXY,
  hasPlayerTouchedWallRecently,
} from './movement';

export function getIsBot(player: Player, game: Game): boolean {
  if (player.inputType === 3) {
    return true;
  }
  return false;
}

export function getIsBotNearAnotherPlayerMedium(
  player: Player,
  game: Game,
  amount: number
): boolean {
  let nearestPlayerPosition: Position = {
    x: SCREEN_DIMENSIONS.WIDTH / 2,
    y: SCREEN_DIMENSIONS.HEIGHT / 2,
  };

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  let distance = Math.sqrt(
    Math.pow(player.char.sprite.x - nearestPlayerPosition.x, 2) +
      Math.pow(player.char.sprite.y - nearestPlayerPosition.y, 2)
  );

  if (distance < amount) {
    return true;
  }

  return false;
}

export function getSameHorizontalSlice(player: Player, game: Game): boolean {
  let nearestPlayerPosition: Position = {
    x: SCREEN_DIMENSIONS.WIDTH / 2,
    y: SCREEN_DIMENSIONS.HEIGHT / 2,
  };

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  if (
    player.char.sprite.Y > nearestPlayerPosition.y - 50 &&
    player.char.sprite.Y < nearestPlayerPosition.y + 120
  ) {
    return true;
  }

  return false;
}

export function getSameVerticalSlice(player: Player, game: Game): boolean {
  let nearestPlayerPosition: Position = {
    x: SCREEN_DIMENSIONS.WIDTH / 2,
    y: SCREEN_DIMENSIONS.HEIGHT / 2,
  };

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  if (
    player.char.sprite.X > nearestPlayerPosition.x - 200 &&
    player.char.sprite.X < nearestPlayerPosition.x + 200
  ) {
    return true;
  }

  return false;
}

export function getIsBotFacingAnotherPlayer(
  player: Player,
  game: Game
): boolean {
  let nearestPlayerPosition: Position = {
    x: SCREEN_DIMENSIONS.WIDTH / 2,
    y: SCREEN_DIMENSIONS.HEIGHT / 2,
  };

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  if (
    (player.char.sprite.x > nearestPlayerPosition.x &&
      !player.char.sprite.flipX) ||
    (player.char.sprite.x < nearestPlayerPosition.x && player.char.sprite.flipX)
  ) {
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

  let enemyVector: xyVector = getNormalizedVector(
    player.char.sprite.x,
    player.char.sprite.y,
    nearestPlayerPosition.x,
    nearestPlayerPosition.y
  );

  let v = player.char.sprite.body.velocity;

  let p = player.padCurr;
  let d = player.padDebounced;
  let t = player.char.sprite.body.touching;

  //////////////////////
  // MOVEMENT
  //////////////////////
  if (!getSameVerticalSlice(player, game)) {
  } else {
    if (enemyVector.x > 0) {
      p.right = true;
      p.left = false;
    } else {
      p.left = true;
      p.right = false;
    }
  }

  if (
    //////////////////////
    // WALL JUMPING
    //////////////////////
    (t.left || t.right) &&
    hasPlayerTouchedWallRecently(player)
  ) {
    p.Y = true;
  } else if (
    //////////////////////
    // JUMPING OFF GROUND
    //////////////////////
    v.x < 50 &&
    v.x > -50 &&
    (d.left === 9 || d.right === 9) &&
    t.down
  ) {
    p.Y = true;
  } else if (v.y > 0) {
    p.Y = true;
  } else {
    p.Y = false;
  }
  console.log('padlong', player.padDebounced);

  //////////////////////
  // ENERGY ATTACK
  //////////////////////
  if (
    !getSameHorizontalSlice(player, game) &&
    !getIsBotNearAnotherPlayerMedium(player, game, 200) &&
    getIsBotFacingAnotherPlayer(player, game)
  ) {
    p.X = true;
  } else {
    p.X = false;
  }

  //////////////////////
  // PHYSICAL ATTACK
  //////////////////////
  if (
    getSameHorizontalSlice(player, game) &&
    getIsBotNearAnotherPlayerMedium(player, game, 200) &&
    getIsBotFacingAnotherPlayer(player, game)
  ) {
    p.A = true;
  } else {
    p.A = false;
  }
}
