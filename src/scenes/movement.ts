import Game from "./Game";
import { Player } from "./interfaces";

export function updateKeepOnScreen(player: Player, game: Game): void {
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
  if (player.pad.A && !player.padPrev.A) {
    console.log(
      "JUMP",
      "player.index:",
      player.index,
      "jumpIndex",
      player.char.jumpIndex,
      "jumps[i]",
      player.char.jumps[player.char.jumpIndex]
    );
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
      player.char.jumpIndex == player.char.jumps.length - 1 ? 0 : 1;

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

// export function addKeyboard(player: Player, game: Game): void {
//   // CHECK ANGLED
//   if (player.keyboard.left.isDown && player.keyboard.up.isDown) {
//     console.log("LEFT UP");
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
