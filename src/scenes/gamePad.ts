import Game from "./Game";
import { Player } from "./interfaces";

export function assignGamePadsConnected(game: Game): void {
  for (let i = 0; i < game.input.gamepad.total; i++) {
    game.players[i].pad = game.input.gamepad.getPad(i);
  }
}

export function controllerSetFast(player: Player, game: Game): void {
  if (player.pad.X) {
    player.char.fast = 2;
    console.log("FAST", player.char.fast);
    return;
  }
  player.char.fast = 1;
  // console.log("FAST", player.char.fast);
}

export function controllerMovement(player: Player, game: Game): void {
  // if nothing return
  if (
    !player.pad.left &&
    !player.pad.right &&
    !player.pad.up &&
    !player.pad.down
  ) {
    return;
  }

  // CHECK ANGLED
  if (player.pad.left && player.pad.up) {
    player.char.sprite.body.setVelocityX(
      -game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    player.char.sprite.body.setVelocityY(
      -game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    return;
  }
  if (player.pad.right && player.pad.up) {
    player.char.sprite.body.setVelocityX(
      game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    player.char.sprite.body.setVelocityY(
      -game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    return;
  }
  if (player.pad.left && player.pad.down) {
    player.char.sprite.body.setVelocityX(
      -game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    player.char.sprite.body.setVelocityY(
      game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    return;
  }
  if (player.pad.right && player.pad.down) {
    player.char.sprite.body.setVelocityX(
      game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    player.char.sprite.body.setVelocityY(
      game.DEFAULT_SPEED *
        player.char.speed *
        player.char.fast *
        game.RATIO_ANGLED_MOVEMENT
    );
    return;
  }

  // CHECK OPPOSING COUNTERS
  if (player.pad.left && player.pad.right) {
    player.char.sprite.body.setVelocityX(0);
    // player.char.sprite.body.setVelocityY(0);
    return;
  }
  if (player.pad.up && player.pad.down) {
    // player.char.sprite.body.setVelocityX(0);
    player.char.sprite.body.setVelocityY(0);
    return;
  }
  // CHECK INDIVIDUALS
  if (player.pad.up) {
    // player.char.sprite.body.setVelocityX(0);
    player.char.sprite.body.setVelocityY(
      -game.DEFAULT_SPEED * player.char.speed * player.char.fast
    );
    return;
  }
  if (player.pad.down) {
    // player.char.sprite.body.setVelocityX(0);
    player.char.sprite.body.setVelocityY(
      game.DEFAULT_SPEED * player.char.speed * player.char.fast
    );
    return;
  }
  if (player.pad.left) {
    // player.char.sprite.body.setVelocityY(0);
    player.char.sprite.body.setVelocityX(
      -game.DEFAULT_SPEED * player.char.speed * player.char.fast
    );
    return;
  }
  if (player.pad.right) {
    // player.char.sprite.body.setVelocityY(0);
    player.char.sprite.body.setVelocityX(
      game.DEFAULT_SPEED * player.char.speed * player.char.fast
    );
    return;
  }

  // // CHECK NONE
  // if (!player.pad.left && !player.pad.right) {
  //   // player.char.sprite.body.setVelocityX(0);
  //   // player.char.sprite.body.setVelocityY(0);
  // }
  // if (!player.pad.up && !player.pad.down) {
  //   // player.char.sprite.body.setVelocityX(0);
  //   // player.char.sprite.body.setVelocityY(0);
  //   player.char.vel.y += game.GRAVITY;
  // }
  return;
}
// export function addPad(player: Player, game: Game): void {
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
// export function addPad(player: Player, game: Game): void {
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

export function printAllPadsActive(player: Player, game: Game): void {
  // Buttons

  if (player.pad) {
    if (player.pad.B) {
      console.log(player.index, "B");
    }
    if (player.pad.A) {
      console.log(player.index, "A");
    }
    if (player.pad.X) {
      console.log(player.index, "X");
    }
    if (player.pad.Y) {
      console.log(player.index, "Y");
      player.char.fast = 2;
    }

    //  D Pad
    if (player.pad.down) {
      console.log(player.index, "down");
    }
    if (player.pad.up) {
      console.log(player.index, "up");
    }
    if (player.pad.left) {
      console.log(player.index, "left");
    }
    if (player.pad.right) {
      console.log(player.index, "right");
    }

    // L R Buttons
    if (player.pad.L1) {
      console.log(player.index, "L1");
    }
    if (player.pad.R1) {
      console.log(player.index, "R1");
    }
  }
}
