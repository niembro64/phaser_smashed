import { GameObjects } from "phaser";
import Game from "./Game";
import { AttackEnergy, Location, Player } from "./interfaces";

export function updateKeepOnScreenLREnergyAttack(
  energyAttack: AttackEnergy,
  game: Game
): void {
  if (energyAttack.sprite.x < 0) {
    energyAttack.sprite.x = game.SCREEN_DIMENSIONS.WIDTH;
  }
  if (energyAttack.sprite.x > game.SCREEN_DIMENSIONS.WIDTH) {
    energyAttack.sprite.x = 0;
  }
}
export function updateKeepOnScreenPlayer(game: Game): void {
  game.players.forEach((player) => {
    if (player.char.sprite.y < 0) {
      player.char.sprite.y = game.SCREEN_DIMENSIONS.HEIGHT;
    }
    if (player.char.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT) {
      player.char.sprite.y = 0;
    }
    if (player.char.sprite.x < 0) {
      player.char.sprite.x = game.SCREEN_DIMENSIONS.WIDTH;
    }
    if (player.char.sprite.x > game.SCREEN_DIMENSIONS.WIDTH) {
      player.char.sprite.x = 0;
    }
  });
}
export function updateKeepOnScreenPlayerDead(player: Player, game: Game): void {
  if (
    player.char.sprite.y < 0 ||
    player.char.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT ||
    player.char.sprite.x < 0 ||
    player.char.sprite.x > game.SCREEN_DIMENSIONS.WIDTH
  ) {
    player.char.sprite.x =
      game.SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x;
    player.char.sprite.y = player.char.initializeCharPosition.y;

    player.char.sprite.setVelocityX(0);
    player.char.sprite.setVelocityY(0);
  }
}
export function updateLastDirectionTouched(player: Player): void {
  if (player.char.sprite.body.touching.up) {
    player.char.lastDirectionTouched = "up";
  }
  if (player.char.sprite.body.touching.down) {
    player.char.lastDirectionTouched = "down";
  }
  if (player.char.sprite.body.touching.left) {
    player.char.lastDirectionTouched = "left";
  }
  if (player.char.sprite.body.touching.right) {
    player.char.lastDirectionTouched = "right";
  }
}

export function updateWallTouchArray(game: Game): void {
  game.players.forEach((player) => {
    if (
      player.char.sprite.body.touching.left ||
      player.char.sprite.body.touching.right
    ) {
      player.char.wallTouchArray[game.allPlayersWallTouchIterator] = true;
    } else {
      player.char.wallTouchArray[game.allPlayersWallTouchIterator] = false;
    }
  });
  game.allPlayersWallTouchIterator =
    (game.allPlayersWallTouchIterator + 1) %
    game.players[0].char.wallTouchArray.length;
}

export function hasPlayerTouchedWallRecently(player: Player): boolean {
  return !player.char.wallTouchArray.every((b) => b === false);
}

export function jump(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.down ||
    player.char.sprite.body.touching.left ||
    player.char.sprite.body.touching.right
  ) {
    player.char.jumpIndex = 0;
  }
  if (player.pad.Y && !player.padPrev.Y) {
    if (
      !(
        player.char.sprite.body.touching.down ||
        player.char.sprite.body.touching.left ||
        player.char.sprite.body.touching.right
      ) &&
      player.char.jumpIndex < 1
    ) {
      player.char.jumpIndex = 1;
    }
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y *
        (1 - player.char.jumps[player.char.jumpIndex]) -
        game.DEFAULT_JUMP *
          player.char.jumpPower *
          player.char.jumps[player.char.jumpIndex]
    );
    player.char.jumpIndex +=
      player.char.jumpIndex === player.char.jumps.length - 1 ? 0 : 1;

    // horizontal stuff
    if (
      player.char.lastDirectionTouched === "left" &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        game.DEFAULT_SPEED_X * player.char.speed * 30
      );
      return;
    }
    if (player.pad.left && player.char.sprite.body.velocity.x > 0) {
      player.char.sprite.body.setVelocityX(-game.DEFAULT_SPEED_X * 10);
      return;
    }
    if (
      player.char.lastDirectionTouched === "right" &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        -game.DEFAULT_SPEED_X * player.char.speed * 30
      );
      return;
    }
    if (player.pad.right && player.char.sprite.body.velocity.x < 0) {
      player.char.sprite.body.setVelocityX(game.DEFAULT_SPEED_X * 10);
      return;
    }
  }

  // holding jump
  if (player.pad.Y) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y +
        -game.DEFAULT_SPEED_Y * player.char.speed * player.char.fast
    );
    // return;
  }
}

export function frictionWallY(player: Player, game: Game): void {
  if (
    (player.pad.left || player.pad.right) &&
    (player.char.sprite.body.touching.left ||
      player.char.sprite.body.touching.right)
  ) {
    player.char.sprite.body.setVelocityY(0);
  }
}

export function frictionAirY(player: Player, game: Game): void {
  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y *
        Math.pow(player.char.friction_air, 1 / player.char.friction_air)
    );
  }
}
export function frictionAirX(player: Player, game: Game): void {
  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x *
        Math.pow(player.char.friction_air, 1.2)
    );
  }
}
export function frictionGroundX(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.down &&
    !player.pad.left &&
    !player.pad.right
  ) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x *
        Math.pow(player.char.friction_ground, 4)
    );
  }
}

export function isXinsideBox(game: Game): boolean {
  var sprite = game.cameraPlayers.char.sprite;
  var left = game.SCREEN_DIMENSIONS.WIDTH / 4;
  var right = (game.SCREEN_DIMENSIONS.WIDTH / 4) * 3;
  var top = game.SCREEN_DIMENSIONS.HEIGHT / 4;
  var bottom = (game.SCREEN_DIMENSIONS.HEIGHT / 4) * 3;

  if (
    sprite.x > right ||
    sprite.x < left ||
    sprite.y > bottom ||
    sprite.y < top
  ) {
    return false;
  }
  return true;
}

export function setCamera(game: Game): void {
  var cPlayer = getCameraPlayerStatus(game);
  var cMover = getCameraMoverStatus(game);
  var cBorder = getCameraBorderStatus(game);
  var cBox = getCameraBoxStatus(game);

  game.cameraPlayers.char.sprite.x = cPlayer.x;
  game.cameraPlayers.char.sprite.y = cPlayer.y;
  game.cameraPlayers.char.zoom = game.cameraPlayers.char.zoom = cPlayer.zoom;

  game.cameraMover.char.sprite.x =
    game.cameraMover.char.sprite.x * game.zoomRatioFast +
    cMover.x * (1 - game.zoomRatioFast);
  game.cameraMover.char.sprite.y =
    game.cameraMover.char.sprite.y * game.zoomRatioFast +
    (cMover.y + game.CAMERA_OFFSET_Y) * (1 - game.zoomRatioFast);
  game.cameraMover.char.zoom = game.cameraMover.char.zoom = cMover.zoom;

  game.cameraPlayersHalfway.char.sprite.x = cBorder.x;
  game.cameraPlayersHalfway.char.sprite.y = cBorder.y;
  game.cameraPlayersHalfway.char.zoom = game.cameraPlayersHalfway.char.zoom =
    cBorder.zoom;

  game.cameraBox.char.sprite.x = cBox.x;
  game.cameraBox.char.sprite.y = cBox.y;
  game.cameraBox.char.zoom = game.cameraBox.char.zoom = cBox.zoom;

  var newZoom = Math.max(game.cameraPlayers.char.zoom, 1);

  game.cameras.main.startFollow(game.cameraMover.char.sprite);

  if (game.cameras.main.zoom < newZoom) {
    game.cameras.main.zoom =
      game.cameras.main.zoom * game.zoomRatioSlow +
      newZoom * (1 - game.zoomRatioSlow);
  } else {
    game.cameras.main.zoom =
      game.cameras.main.zoom * game.zoomRatioFast +
      newZoom * (1 - game.zoomRatioFast);
  }
  // var newZoom = game.cameraPlayers.char.zoom;

  // if (game.cameras.main.zoom < newZoom) {
  //   game.cameras.main.zoom =
  //     game.cameras.main.zoom * game.zoomRatioSlow + newZoom * (1 - game.zoomRatioSlow);
  // } else {
  //   game.cameras.main.zoom =
  //     game.cameras.main.zoom * game.zoomRatioFast + newZoom * (1 - game.zoomRatioFast);
  // }
}

export function getBorderZoom(game: Game): number {
  var curr_x: number = 0;
  var curr_y: number = 0;

  if (game.cameraPlayers.char.sprite.x < game.SCREEN_DIMENSIONS.WIDTH / 2) {
    curr_x = game.BORDER_PADDING_X + game.cameraPlayers.char.sprite.x;
  } else {
    curr_x =
      game.BORDER_PADDING_X +
      game.SCREEN_DIMENSIONS.WIDTH -
      game.cameraPlayers.char.sprite.x;
  }

  if (game.cameraPlayers.char.sprite.y < game.SCREEN_DIMENSIONS.HEIGHT / 2) {
    curr_y = game.BORDER_PADDING_Y + game.cameraPlayers.char.sprite.y;
  } else {
    curr_y =
      game.BORDER_PADDING_Y +
      game.SCREEN_DIMENSIONS.HEIGHT -
      game.cameraPlayers.char.sprite.y;
  }

  let return_x = 1 / ((curr_x * 2) / game.SCREEN_DIMENSIONS.WIDTH);
  let return_y = 1 / ((curr_y * 2) / game.SCREEN_DIMENSIONS.HEIGHT);

  return Math.max(return_x, return_y);
}

export function getPlayerZoom(game: Game): number {
  let curr_x = 0;
  let curr_y = 0;

  game.players.forEach((player, playerIndex) => {
    if (
      Math.abs(
        game.BORDER_PADDING_X +
          player.char.sprite.x -
          game.cameraPlayers.char.sprite.x
      ) > curr_x
    ) {
      curr_x = Math.abs(
        game.BORDER_PADDING_X +
          player.char.sprite.x -
          game.cameraPlayers.char.sprite.x
      );
    }
  });
  game.players.forEach((player, playerIndex) => {
    if (
      Math.abs(
        game.BORDER_PADDING_Y +
          player.char.sprite.y -
          game.cameraPlayers.char.sprite.y
      ) > curr_y
    ) {
      curr_y = Math.abs(
        game.BORDER_PADDING_Y +
          player.char.sprite.y -
          game.cameraPlayers.char.sprite.y
      );
    }
  });

  let return_x = 1 / ((curr_x * 2) / game.SCREEN_DIMENSIONS.WIDTH);
  let return_y = 1 / ((curr_y * 2) / game.SCREEN_DIMENSIONS.HEIGHT);

  return Math.min(return_x, return_y);
}

export function getCameraBorderStatus(game: Game): Location {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  return {
    x: ((x_low + x_high) / 2 + game.SCREEN_DIMENSIONS.WIDTH / 2) / 2,
    y: ((y_low + y_high) / 2 + game.SCREEN_DIMENSIONS.HEIGHT / 2) / 2,
    zoom: getBorderZoom(game),
  };
}

export function getCameraPlayerStatus(game: Game): Location {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  return {
    x: (x_low + x_high) / 2,
    y: (y_low + y_high) / 2,
    zoom: getPlayerZoom(game),
  };
}

export function getCameraMoverStatus(game: Game): Location {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  var spritePlayer = game.cameraPlayers.char.sprite;
  var spriteMover = game.cameraMover.char.sprite;
  var spriteCenter = game.cameraCenter.char.sprite;

  game.playerZoomKeeper =
    game.playerZoomKeeper * game.zoomRatioSlow +
    Math.max(getPlayerZoom(game), 1) * (1 - game.zoomRatioSlow);

  var percentCloseToCenter = Math.pow(1 / game.playerZoomKeeper, 3);

  let x =
    spritePlayer.x * (1 - percentCloseToCenter) +
    spriteCenter.x * percentCloseToCenter;
  let y =
    spritePlayer.y * (1 - percentCloseToCenter) +
    spriteCenter.y * percentCloseToCenter;

  return {
    x: x,
    y: y,
    zoom: getPlayerZoom(game),
  };
}

export function getCameraBoxStatus(game: Game): Location {
  var x_low: number = Infinity;
  var x_high: number = 0;
  var y_low: number = Infinity;
  var y_high: number = 0;

  game.players.forEach((player, playerIndex) => {
    x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
    x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
    y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
    y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
  });

  var x = Math.max(game.SCREEN_DIMENSIONS.WIDTH / 4, (x_low + x_high) / 2);
  var y = Math.max(game.SCREEN_DIMENSIONS.HEIGHT / 4, (y_low + y_high) / 2);

  x = Math.min((game.SCREEN_DIMENSIONS.WIDTH / 4) * 3, x);
  y = Math.min((game.SCREEN_DIMENSIONS.HEIGHT / 4) * 3, y);

  return {
    x: x,
    y: y,
    zoom: 2,
  };
}

// export function addKeyboard(player: Player, game: Game): void {
//   // CHECK ANGLED
//   if (player.keyboard.left.isDown && player.keyboard.up.isDown) {
//     player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     return;
//   }
//   if (player.keyboard.right.isDown && player.keyboard.up.isDown) {
//     player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     return;
//   }
//   if (player.keyboard.left.isDown && player.keyboard.down.isDown) {
//     player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     return;
//   }
//   if (player.keyboard.right.isDown && player.keyboard.down.isDown) {
//     player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//     return;
//   }

//   // CHECK OPPOSING COUNTERS
//   if (player.keyboard.left.isDown && player.keyboard.right.isDown) {
//     player.char.vel.x = 0;
//     player.char.vel.y = 0;
//     return;
//   }
//   if (player.keyboard.up.isDown && player.keyboard.down.isDown) {
//     player.char.vel.x = 0;
//     player.char.vel.y = 0;
//     return;
//   }
//   // CHECK INDIVIDUALS
//   if (player.keyboard.up.isDown) {
//     player.char.vel.x = 0;
//     player.char.vel.y = -game.DEFAULT_SPEED;
//     return;
//   }
//   if (player.keyboard.down.isDown) {
//     player.char.vel.x = 0;
//     player.char.vel.y = game.DEFAULT_SPEED;
//     return;
//   }
//   if (player.keyboard.left.isDown) {
//     player.char.vel.y += 0;
//     player.char.vel.x = -game.DEFAULT_SPEED;
//     return;
//   }
//   if (player.keyboard.right.isDown) {
//     player.char.vel.y += 0;
//     player.char.vel.x = game.DEFAULT_SPEED;
//     return;
//   }
// // CHECK NONE
//   if (!player.keyboard.left.isDown && !player.keyboard.right.isDown) {
//     player.char.vel.x = 0;
//     // player.char.vel.y = 0;
//   }
//   if (!player.keyboard.up.isDown && !player.keyboard.down.isDown) {
//     player.char.vel.x = 0;
//     // player.char.vel.y = 0;
//     player.char.vel.y += game.GRAVITY;
//   }

//   return;
// }
