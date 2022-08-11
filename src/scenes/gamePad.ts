import Game from "./Game";
import { Player } from "./interfaces";

export function assignGamePadsConnected(game: Game): void {
  for (let i = 0; i < game.input.gamepad.total; i++) {
    game.players[i].pad = game.input.gamepad.getPad(i);
  }
}

export function simpleMotion(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.pad.left) {
      player.char.sprite.body.setVelocityX(
        -1 * player.multipliers_static.speed * game.DEFAULT_SPEED
      );
      // console.log(player.pad);
    } else {
      player.char.sprite.body.setVelocityX(0);
    }
    if (player.pad.right) {
      player.char.sprite.body.setVelocityX(
        player.multipliers_static.speed * game.DEFAULT_SPEED
      );
      console.log(player.pad);
    } else {
      player.char.sprite.body.setVelocityX(0);
    }
  });
}

export function controllerMovement(game: Game): void {
  // CHECK ANGLED
  game.players.forEach((player, playerIndex) => {
    if (player.pad.left && player.pad.up) {
      player.char.sprite.body.setVelocityX(
        -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      player.char.sprite.body.setVelocityY(
        -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      return;
    }
    if (player.pad.right && player.pad.up) {
      player.char.sprite.body.setVelocityX(
        game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      player.char.sprite.body.setVelocityY(
        -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      return;
    }
    if (player.pad.left && player.pad.down) {
      player.char.sprite.body.setVelocityX(
        -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      player.char.sprite.body.setVelocityY(
        game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      return;
    }
    if (player.pad.right && player.pad.down) {
      player.char.sprite.body.setVelocityX(
        game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      player.char.sprite.body.setVelocityY(
        game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
      );
      return;
    }

    // CHECK OPPOSING COUNTERS
    if (player.pad.left && player.pad.right) {
      player.char.sprite.body.setVelocityX(0);
      player.char.sprite.body.setVelocityY(0);
      return;
    }
    if (player.pad.up && player.pad.down) {
      player.char.sprite.body.setVelocityX(0);
      player.char.sprite.body.setVelocityY(0);
      return;
    }
    // CHECK INDIVIDUALS
    if (player.pad.up) {
      player.char.sprite.body.setVelocityX(0);
      player.char.sprite.body.setVelocityY(-game.DEFAULT_SPEED);
      return;
    }
    if (player.pad.down) {
      player.char.sprite.body.setVelocityX(0);
      player.char.sprite.body.setVelocityY(game.DEFAULT_SPEED);
      return;
    }
    if (player.pad.left) {
      player.char.sprite.body.setVelocityY(0);
      player.char.sprite.body.setVelocityX(-game.DEFAULT_SPEED);
      return;
    }
    if (player.pad.right) {
      player.char.sprite.body.setVelocityY(0);
      player.char.sprite.body.setVelocityX(game.DEFAULT_SPEED);
      return;
    }

    // CHECK NONE
    if (!player.pad.left && !player.pad.right) {
      player.char.sprite.body.setVelocityX(0);
      // player.char.sprite.body.setVelocityY(0);
    }
    if (!player.pad.up && !player.pad.down) {
      player.char.sprite.body.setVelocityX(0);
      // player.char.sprite.body.setVelocityY(0);
      player.char.vel.y += game.GRAVITY;
    }
  });
  return;
}
// export function addPad(game: Game): void {
//   // CHECK ANGLED
//   game.players.forEach((player, playerIndex) => {
//     if (player.pad.left && player.pad.up) {
//       player.char.sprite.body.setVelocityX(
//         -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       player.char.sprite.body.setVelocityY(
//         -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       return;
//     }
//     if (player.pad.right && player.pad.up) {
//       player.char.sprite.body.setVelocityX(
//         game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       player.char.sprite.body.setVelocityY(
//         -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       return;
//     }
//     if (player.pad.left && player.pad.down) {
//       player.char.sprite.body.setVelocityX(
//         -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       player.char.sprite.body.setVelocityY(
//         game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       return;
//     }
//     if (player.pad.right && player.pad.down) {
//       player.char.sprite.body.setVelocityX(
//         game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       player.char.sprite.body.setVelocityY(
//         game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT
//       );
//       return;
//     }

//     // CHECK OPPOSING COUNTERS
//     if (player.pad.left && player.pad.right) {
//       player.char.sprite.body.setVelocityX(0);
//       player.char.sprite.body.setVelocityY(0);
//       return;
//     }
//     if (player.pad.up && player.pad.down) {
//       player.char.sprite.body.setVelocityX(0);
//       player.char.sprite.body.setVelocityY(0);
//       return;
//     }
//     // CHECK INDIVIDUALS
//     if (player.pad.up) {
//       player.char.sprite.body.setVelocityX(0);
//       player.char.sprite.body.setVelocityY(-game.DEFAULT_SPEED);
//       return;
//     }
//     if (player.pad.down) {
//       player.char.sprite.body.setVelocityX(0);
//       player.char.sprite.body.setVelocityY(game.DEFAULT_SPEED);
//       return;
//     }
//     if (player.pad.left) {
//       player.char.sprite.body.setVelocityY(0);
//       player.char.sprite.body.setVelocityX(-game.DEFAULT_SPEED);
//       return;
//     }
//     if (player.pad.right) {
//       player.char.sprite.body.setVelocityY(0);
//       player.char.sprite.body.setVelocityX(game.DEFAULT_SPEED);
//       return;
//     }

//     // CHECK NONE
//     if (!player.pad.left && !player.pad.right) {
//       player.char.sprite.body.setVelocityX(0);
//       // player.char.sprite.body.setVelocityY(0);
//     }
//     if (!player.pad.up && !player.pad.down) {
//       player.char.sprite.body.setVelocityX(0);
//       // player.char.sprite.body.setVelocityY(0);
//       player.char.vel.y += game.GRAVITY;
//     }
//   });
//   return;
// }
// export function addPad(game: Game): void {
//   // CHECK ANGLED
//   game.players.forEach((player, playerIndex) => {
//     if (player.pad.left && player.pad.up) {
//       player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       return;
//     }
//     if (player.pad.right && player.pad.up) {
//       player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       return;
//     }
//     if (player.pad.left && player.pad.down) {
//       player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       return;
//     }
//     if (player.pad.right && player.pad.down) {
//       player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
//       return;
//     }

//     // CHECK OPPOSING COUNTERS
//     if (player.pad.left && player.pad.right) {
//       player.char.vel.x = 0;
//       player.char.vel.y = 0;
//       return;
//     }
//     if (player.pad.up && player.pad.down) {
//       player.char.vel.x = 0;
//       player.char.vel.y = 0;
//       return;
//     }
//     // CHECK INDIVIDUALS
//     if (player.pad.up) {
//       player.char.vel.x = 0;
//       player.char.vel.y = -game.DEFAULT_SPEED;
//       return;
//     }
//     if (player.pad.down) {
//       player.char.vel.x = 0;
//       player.char.vel.y = game.DEFAULT_SPEED;
//       return;
//     }
//     if (player.pad.left) {
//       player.char.vel.y += 0;
//       player.char.vel.x = -game.DEFAULT_SPEED;
//       return;
//     }
//     if (player.pad.right) {
//       player.char.vel.y += 0;
//       player.char.vel.x = game.DEFAULT_SPEED;
//       return;
//     }

//     // CHECK NONE
//     if (!player.pad.left && !player.pad.right) {
//       player.char.vel.x = 0;
//       // player.char.vel.y = 0;
//     }
//     if (!player.pad.up && !player.pad.down) {
//       player.char.vel.x = 0;
//       // player.char.vel.y = 0;
//       player.char.vel.y += game.GRAVITY;
//     }
//   });
//   return;
// }

export function printAllPadsActive(game: Game): void {
  // Buttons

  game.players.forEach((player, playerIndex) => {
    if (player.pad) {
      if (player.pad.B) {
        console.log(playerIndex, "A");
      }
      if (player.pad.A) {
        console.log(playerIndex, "B");
      }
      if (player.pad.X) {
        console.log(playerIndex, "Y");
      }
      if (player.pad.Y) {
        console.log(playerIndex, "X");
      }

      //  D Pad
      if (player.pad.down) {
        console.log(playerIndex, "down");
      }
      if (player.pad.up) {
        console.log(playerIndex, "up");
      }
      if (player.pad.left) {
        console.log(playerIndex, "left");
      }
      if (player.pad.right) {
        console.log(playerIndex, "right");
      }

      // L R Buttons
      if (player.pad.L1) {
        console.log(playerIndex, "L1");
      }
      if (player.pad.R1) {
        console.log(playerIndex, "R1");
      }
    }
  });
}
