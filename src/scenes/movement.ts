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

export function jump(player: Player, game: Game): void {
  if (player.char.sprite.body.touching.down) {
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
    if (!player.char.sprite.body.touching.down && player.char.jumpIndex < 1) {
      player.char.jumpIndex = 1;
    }
    if (player.pad.left) {
      if (player.char.sprite.body.touching.left) {
        player.char.sprite.body.setVelocityX(
          game.DEFAULT_SPEED_X * player.char.speed * 50
        );
      } else if (player.char.sprite.body.velocity.x > 0) {
        player.char.sprite.body.setVelocityX(-game.DEFAULT_SPEED_X * 10);
      }
    }
    if (player.pad.right) {
      if (player.char.sprite.body.touching.right) {
        player.char.sprite.body.setVelocityX(
          -game.DEFAULT_SPEED_X * player.char.speed * 50
        );
      } else if (player.char.sprite.body.velocity.x < 0) {
        player.char.sprite.body.setVelocityX(game.DEFAULT_SPEED_X * 10);
      }
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
  }
}

export function frictionWallY(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.left ||
    player.char.sprite.body.touching.right
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
