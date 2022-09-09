import Game from "../Game";
import { Player } from "../interfaces";

export function updateCirclesLocations(game: Game): void {
  if (!game.debug.seePlayerCircles) {
    return;
  }

  game.circles.forEach((circle, circleIndex) => {
    if (circleIndex < game.PLAYER_CHOICES.length) {
      // circle.graphic.x = game.players[circleIndex].char.sprite.x;
      // circle.graphic.y =
      //   game.players[circleIndex].char.sprite.y - game.circleOffset;

      circle.graphic.setRadius((1 / game.cameras.main.zoom) * 10);
      circle.graphic.setPosition(
        game.players[circleIndex].char.sprite.x,
        game.players[circleIndex].char.sprite.y - game.circleOffset
      );
    }
  });
}

export function updateEnergyAttacksWrapScreen(game: Game): void {
  if (!game.debug.energyAttackWrapScreen) {
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
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    if (isPlayerOffscreen(game.players[i], game)) {
      return true;
    }
  }
  return false;
}
export function isPlayerOffscreen(player: Player, game: Game): boolean {
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

export function updateEnergyAttacksScreenWrap(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT) {
      // player.char.attackEnergy.sprite.body.setVelocityX(0);
      // player.char.attackEnergy.sprite.body.setVelocityY(0);
      player.char.attackEnergy.sprite.x = game.SCREEN_DIMENSIONS.WIDTH / 2;
      player.char.attackEnergy.sprite.Y = game.SCREEN_DIMENSIONS.HEIGHT / 2;
      player.char.attackEnergy.sprite.body.allowGravity = false;
    }
  });
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

    game.SOUND_JUMP.volume = player.char.jumps[player.char.jumpIndex];
    game.SOUND_JUMP.play();

    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y *
        (1 - player.char.jumps[player.char.jumpIndex]) +
        game.DEFAULT_JUMP *
          player.char.jumpPower *
          player.char.jumps[player.char.jumpIndex]
    );
    player.char.jumpIndex +=
      player.char.jumpIndex === player.char.jumps.length - 1 ? 0 : 1;

    // horizontal stuff
    if (
      game.debug.wallJumps &&
      player.char.lastDirectionTouched === "left" &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        game.DEFAULT_WALL_JUMP * player.char.speed * 0.5
      );
      return;
    }
    // if (player.pad.left && player.char.sprite.body.velocity.x > 0) {
    //   player.char.sprite.body.setVelocityX(-game.DEFAULT_SPEED_X * 10);
    //   return;
    // }
    if (
      game.debug.wallJumps &&
      player.char.lastDirectionTouched === "right" &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        -game.DEFAULT_WALL_JUMP * player.char.speed * 0.5
      );
      return;
    }
    // if (player.pad.right && player.char.sprite.body.velocity.x < 0) {
    //   player.char.sprite.body.setVelocityX(game.DEFAULT_SPEED_X * 10);
    //   return;
    // }
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
  if (!game.debug.wallJumps) {
    return;
  }

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

export function hitbackFly(
  player: Player,
  game: Game,
  hitbackx: number,
  hitbacky: number
): void {
  player.char.sprite.body.setVelocityY(
    hitbacky * game.HITBACK_Y +
      ((hitbacky > 0 ? 1 : -1) * (game.HITBACK_Y * player.char.damage)) / 5
  );
  player.char.sprite.body.setVelocityX(
    hitbackx * game.HITBACK_X +
      ((hitbackx > 0 ? 1 : -1) * (game.HITBACK_X * player.char.damage)) / 5
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

export function keepObjectsFromFallingLikeCrazy(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.y > game.SCREEN_DIMENSIONS.HEIGHT) {
      player.char.attackEnergy.sprite.y = game.SCREEN_DIMENSIONS.HEIGHT + 200;
      player.char.attackEnergy.sprite.body.setVelocityY(0);
      player.char.attackEnergy.sprite.body.setVelocityX(0);
    }
  });
}
