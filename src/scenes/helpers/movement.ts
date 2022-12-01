import Game from '../Game';
import { Player } from '../interfaces';

export function updateCirclesLocations(game: Game): void {
  if (!game.debug.setPlayerIdVisible) {
    return;
  }

  game.colorCircles.forEach((circle, circleIndex) => {
    if (circleIndex < game.players.length) {
      // circle.graphic.x = game.players[circleIndex].char.sprite.x;
      // circle.graphic.y =
      //   game.players[circleIndex].char.sprite.y - game.circleOffset;

      circle.graphic.setRadius((1 / game.cameras.main.zoom) * 10);
      circle.graphic.setPosition(
        game.players[circleIndex].char.sprite.x,
        game.players[circleIndex].char.sprite.y +
          game.circleOffset +
          game.players[circleIndex].circleOffset
      );
    }
  });
}

export function updateTable(game: Game): void {
  if (game.TABLE.body.touching.down) {
    game.TABLE.body.setVelocityX(game.TABLE.body.velocity.x * 0.95);
  }
  // game.TABLE.velocityY = 0;
}

export function updateEnergyAttacksWrapScreen(game: Game): void {
  if (!game.debug.setAEWrapScreen) {
    return;
  }
  game.players.forEach((player) => {
    if (player.char.attackEnergy.sprite.x < 0) {
      player.char.attackEnergy.sprite.x = game.SCREEN_DIMENSIONS.WIDTH;
    }
    if (player.char.attackEnergy.sprite.x > game.SCREEN_DIMENSIONS.WIDTH) {
      player.char.attackEnergy.sprite.x = 0;
    }
  });
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
export function isAnyPlayerOffscreen(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (getIsPlayerOffscreen(game.players[i], game)) {
      return true;
    }
  }
  return false;
}
export function getIsPlayerOffscreen(player: Player, game: Game): boolean {
  if (
    player.char.sprite.y < 0 ||
    player.char.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT ||
    player.char.sprite.x < 0 ||
    player.char.sprite.x > game.SCREEN_DIMENSIONS.WIDTH
  ) {
    return true;
  }
  return false;
}

export function setRespawn(player: Player, game: Game): void {
  player.char.sprite.x =
    game.SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x;
  player.char.sprite.y = player.char.initializeCharPosition.y;

  player.char.sprite.body.setVelocityX(0);
  player.char.sprite.body.setVelocityY(0);
}

// export function updateEnergyAttacksScreenWrap(game: Game): void {
//   game.players.forEach((player, playerIndex) => {
//     if (player.char.attackEnergy.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT) {
//       // player.char.attackEnergy.sprite.body.setVelocityX(0);
//       // player.char.attackEnergy.sprite.body.setVelocityY(0);
//       player.char.attackEnergy.sprite.x = game.SCREEN_DIMENSIONS.WIDTH / 2;
//       player.char.attackEnergy.sprite.Y = game.SCREEN_DIMENSIONS.HEIGHT / 2;
//       player.char.attackEnergy.sprite.body.allowGravity = false;
//     }
//   });
// }

export function updateLastDirectionTouched(player: Player): void {
  if (player.char.sprite.body.touching.up) {
    player.char.lastDirectionTouched = 'up';
  } else if (player.char.sprite.body.touching.down) {
    player.char.lastDirectionTouched = 'down';
  } else if (player.char.sprite.body.touching.left) {
    player.char.lastDirectionTouched = 'left';
  } else if (player.char.sprite.body.touching.right) {
    player.char.lastDirectionTouched = 'right';
  }
}

export function updateWallTouchArray(game: Game): void {
  game.players.forEach((player) => {
    if (
      !player.char.sprite.body.touching.down &&
      (player.char.sprite.body.touching.left ||
        player.char.sprite.body.touching.right)
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

export function updateJumpPhysicalOnWall(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.down ||
    player.char.sprite.body.touching.left ||
    player.char.sprite.body.touching.right
  ) {
    player.char.jumpIndex = 0;
  }
}

export function updateJumpPhysical(player: Player, game: Game): void {
  if (player.padCurr.Y && !player.padPrev.Y) {
    if (
      !player.char.sprite.body.touching.down &&
      !player.char.sprite.body.touching.left &&
      !player.char.sprite.body.touching.right &&
      !hasPlayerTouchedWallRecently(player) &&
      player.char.jumpIndex < 1
    ) {
      player.char.jumpIndex = 1;
    }

    if (player.char.jumpIndex !== player.char.jumps.length - 1) {
      game.SOUND_JUMP_PHYSICAL.volume =
        player.char.jumps[player.char.jumpIndex];
      game.SOUND_JUMP_PHYSICAL.play();
    }

    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y *
        (1 - player.char.jumps[player.char.jumpIndex]) +
        game.BASE_PLAYER_JUMP_PHYSICAL *
          player.char.jumpPower *
          player.char.jumps[player.char.jumpIndex]
    );

    player.char.jumpIndex +=
      player.char.jumpIndex === player.char.jumps.length - 1 ? 0 : 1;

    // // // horizontal stuff IS TOUCHING
    // if (
    //   game.debug.setWallJumpsActive &&
    //   player.padCurr.left &&
    //   player.char.sprite.body.touching.left
    // ) {
    //   player.char.sprite.body.setVelocityX(
    //     game.BASE_PLAYER_JUMP_WALL *
    //       player.char.speed *
    //       (player.padCurr.left ? 300 : 1)
    //   );
    //   return;
    // }

    // if (
    //   game.debug.setWallJumpsActive &&
    //   player.padCurr.right &&
    //   player.char.sprite.body.touching.right
    // ) {
    //   player.char.sprite.body.setVelocityX(
    //     -game.BASE_PLAYER_JUMP_WALL * player.char.speed * 3000
    //   );
    //   return;
    // }

    // // horizontal stuff WAS TOUCHING
    if (
      game.debug.setWallJumpsActive &&
      player.char.lastDirectionTouched === 'left' &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        game.BASE_PLAYER_JUMP_WALL *
          player.char.speed *
          (player.padCurr.left ? 2 : 1)
      );
      return;
    }

    if (
      game.debug.setWallJumpsActive &&
      player.char.lastDirectionTouched === 'right' &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        -game.BASE_PLAYER_JUMP_WALL *
          player.char.speed *
          (player.padCurr.right ? 2 : 1)
      );
      return;
    }
  }
}

export function updateJumpFloat(player: Player, game: Game): void {
  if (player.emitterPlayer.on) {
    return;
  }
  if (player.padCurr.Y && player.padPrev.Y) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y +
        -game.BASE_PLAYER_SPEED.y * player.char.speed * player.char.fast
    );
  }
}

export function updateFrictionWallY(player: Player, game: Game): void {
  if (!game.debug.setWallJumpsActive) {
    return;
  }

  if (player.char.sprite.body.velocity.y < 0) {
    return;
  }
  if (
    (player.padCurr.left && player.char.sprite.body.touching.left) ||
    (player.padCurr.right && player.char.sprite.body.touching.right)
  ) {
    player.char.sprite.body.setVelocityY(0);
  }
}

export function updateFrictionAirY(player: Player, game: Game): void {
  if (!game.debug.setFrictionAirActive) {
    return;
  }

  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y * (1 - player.char.friction_air)
    );
  }
}

export function updateFrictionAirX(player: Player, game: Game): void {
  if (!game.debug.setFrictionAirActive) {
    return;
  }

  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * (1 - player.char.friction_air)
    );
  }
}

export function updateFrictionGroundX(player: Player, game: Game): void {
  // if (
  //   player.char.sprite.body.touching.down &&
  //   !player.gamepad.left &&
  //   !player.gamepad.right
  // ) {
  //   player.char.sprite.body.setVelocityX(
  //     player.char.sprite.body.velocity.x *
  //       Math.pow(player.char.friction_ground, 4)
  //   );
  // }
  if (
    player.char.sprite.body.touching.down &&
    !player.padCurr.left &&
    !player.padCurr.right
  ) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * (1 - player.char.friction_ground)
    );
  }
}

export function hitbackFly(
  player: Player,
  game: Game,
  hitbackx: number,
  hitbacky: number
): void {
  player.char.sprite.body.setVelocityY(
    hitbacky * game.BASE_PLAYER_HITBACK.y +
      ((hitbacky > 0 ? 1 : -1) *
        (game.BASE_PLAYER_HITBACK.y * player.char.damage)) /
        5
  );
  player.char.sprite.body.setVelocityX(
    hitbackx * game.BASE_PLAYER_HITBACK.x +
      ((hitbackx > 0 ? 1 : -1) *
        (game.BASE_PLAYER_HITBACK.x * player.char.damage)) /
        5
  );
  // if (player.char.sprite.flipX) {
  //   player.char.sprite.body.setVelocityX(
  //     hitbackx * (game.HITBACK_X + (game.HITBACK_X * player.char.damage) / 50)
  //   );
  // } else {
  //   player.char.sprite.body.setVelocityX(
  //     -1 *
  //       hitbacky *
  //       (game.HITBACK_X + (game.HITBACK_X * player.char.damage) / 50)
  //   );
  // }
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

export function setGravityTrue(player: Player): void {
  player.char.sprite.body.allowGravity = true;
}

export function setGravityFalse(player: Player): void {
  player.char.sprite.body.allowGravity = false;
}

export function updateKeepObjectsFromFallingLikeCrazy(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT) {
      player.char.attackEnergy.sprite.y = game.SCREEN_DIMENSIONS.HEIGHT + 200;
      player.char.attackEnergy.sprite.body.setVelocityY(0);
      player.char.attackEnergy.sprite.body.setVelocityX(0);
    }
  });
}

export function updateAttackEnergyFollow(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.findAndFollowAcceleration.x !== 0) {
      let goHereX: number = getNearestPlayerX(player, playerIndex, game);
      player.char.attackEnergy.sprite.body.setVelocityX(
        player.char.attackEnergy.sprite.body.velocity.x * 0.98 +
          (goHereX < player.char.attackEnergy.sprite.x ? -1 : 1) *
            100 *
            player.char.attackEnergy.findAndFollowAcceleration.x
      );
    }
  });
}

export function getNearestPlayerX(
  player: Player,
  pIndex: number,
  game: Game
): number {
  let goToX = Infinity;
  let myX = player.char.attackEnergy.sprite.x;
  let diffX = Math.abs(goToX - myX);
  game.players.forEach((player, playerIndex) => {
    if (pIndex !== playerIndex) {
      let otherPlayerX = player.char.sprite.x;
      let newDiffX = Math.abs(otherPlayerX - myX);
      if (newDiffX < diffX) {
        goToX = otherPlayerX;
        diffX = newDiffX;
      }
    }
  });
  return goToX;
}
