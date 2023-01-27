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

  let bot = player.char.sprite;

  if (
    nearestPlayerPosition.y > bot.Y + 120 &&
    nearestPlayerPosition.y < bot.Y - 50
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

  let bot = player.char.sprite;

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  if (
    nearestPlayerPosition.x > bot.x - 200 &&
    nearestPlayerPosition.x < bot.x + 200
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

  let bot = player.char.sprite;

  game.players.forEach((player, playerIndex) => {
    nearestPlayerPosition = getNearestPlayerAliveXY(player, playerIndex, game);
  });

  if (
    (bot.x > nearestPlayerPosition.x && bot.flipX) ||
    (bot.x < nearestPlayerPosition.x && !bot.flipX)
  ) {
    return true;
  }

  return false;
}

export function getIsBotTooFarLeft(player: Player, game: Game): boolean {
  let bot = player.char.sprite;
  let left = SCREEN_DIMENSIONS.WIDTH * 0.18;
  if (bot.x < left) {
    return true;
  }
  return false;
}
export function getIsBotTooFarRight(player: Player, game: Game): boolean {
  let bot = player.char.sprite;
  let right = SCREEN_DIMENSIONS.WIDTH * 0.93;
  if (bot.x > right) {
    return true;
  }
  return false;
}
export function getIsBotTooFarUp(player: Player, game: Game): boolean {
  let bot = player.char.sprite;
  let up = SCREEN_DIMENSIONS.HEIGHT * 0.2;
  if (bot.y < up) {
    return true;
  }
  return false;
}
export function getIsBotTooFarDown(player: Player, game: Game): boolean {
  let bot = player.char.sprite;
  let down = SCREEN_DIMENSIONS.HEIGHT * 0.9;
  if (bot.y > down) {
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

  let bot = player.char.sprite;

  let enemyVector: xyVector = getNormalizedVector(
    nearestPlayerPosition.x,
    nearestPlayerPosition.y,
    bot.x,
    bot.y
  );

  let v = player.char.sprite.body.velocity;

  let p = player.padCurr;
  let d = player.padDebounced;
  let t = player.char.sprite.body.touching;

  //////////////////////
  // MOVEMENT
  //////////////////////
  if (getSameVerticalSlice(player, game)) {
  } else {
    if (enemyVector.x < 0) {
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
  } else if (
    //////////////////////
    // AIR JUMPING
    //////////////////////
    enemyVector.y > 0 &&
    v.y > 0
  ) {
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
    getIsBotNearAnotherPlayerMedium(player, game, 200) &&
    getIsBotFacingAnotherPlayer(player, game)
  ) {
    p.A = true;
  } else {
    p.A = false;
  }

  //////////////////////
  // TOO FAR LEFT RIGHT
  //////////////////////
  if (getIsBotTooFarLeft(player, game)) {
    p.right = true;
    p.left = false;
  } else if (getIsBotTooFarRight(player, game)) {
    p.left = true;
    p.right = false;
  }

  //////////////////////
  // TOO FAR UP DOWN
  //////////////////////
  if (getIsBotTooFarUp(player, game)) {
    p.Y = false;
  } else if (getIsBotTooFarDown(player, game)) {
    p.Y = true;
  }
}
