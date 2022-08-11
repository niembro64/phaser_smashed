import Game from "./Game";
import { Player } from "./interfaces";

export function assignGamePadsConnected(game: Game): void {
  for (let i = 0; i < game.input.gamepad.total; i++) {
    game.players[i].pad = game.input.gamepad.getPad(i);
  }
}

export function updatePadPrevious(player: Player, game: Game): void {
  player.padPrev.up = player.pad.up;
  player.padPrev.down = player.pad.down;
  player.padPrev.left = player.pad.left;
  player.padPrev.right = player.pad.right;
  player.padPrev.A = player.pad.A;
  player.padPrev.B = player.pad.B;
  player.padPrev.X = player.pad.X;
  player.padPrev.Y = player.pad.Y;
}

export function controllerSetFast(player: Player, game: Game): void {
  if (player.pad.X) {
    player.char.fast = 2;
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

  // // CHECK ANGLED
  // if (player.pad.left && player.pad.up) {
  //   player.char.sprite.body.setVelocityX(
  //     player.char.sprite.body.velocity.x +
  //       -game.DEFAULT_SPEED_X *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   player.char.sprite.body.setVelocityY(
  //     player.char.sprite.body.velocity.y +
  //       -game.DEFAULT_SPEED_Y *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   return;
  // }
  // if (player.pad.right && player.pad.up) {
  //   player.char.sprite.body.setVelocityX(
  //     player.char.sprite.body.velocity.x +
  //       game.DEFAULT_SPEED_X *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   player.char.sprite.body.setVelocityY(
  //     player.char.sprite.body.velocity.y +
  //       -game.DEFAULT_SPEED_Y *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   return;
  // }
  // if (player.pad.left && player.pad.down) {
  //   player.char.sprite.body.setVelocityX(
  //     player.char.sprite.body.velocity.x +
  //       -game.DEFAULT_SPEED_X *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   player.char.sprite.body.setVelocityY(
  //     player.char.sprite.body.velocity.y +
  //       game.DEFAULT_SPEED_Y *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   return;
  // }
  // if (player.pad.right && player.pad.down) {
  //   player.char.sprite.body.setVelocityX(
  //     player.char.sprite.body.velocity.x +
  //       game.DEFAULT_SPEED_X *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   player.char.sprite.body.setVelocityY(
  //     player.char.sprite.body.velocity.y +
  //       game.DEFAULT_SPEED_Y *
  //         player.char.speed *
  //         player.char.fast *
  //         game.RATIO_ANGLED_MOVEMENT
  //   );
  //   return;
  // }

  // CHECK INDIVIDUALS
  if (player.pad.up) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y +
        -game.DEFAULT_SPEED_Y * player.char.speed * player.char.fast
    );
    // return;
  }
  if (player.pad.down) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y +
        game.DEFAULT_SPEED_Y * player.char.speed * player.char.fast
    );
    // return;
  }
  if (player.pad.left) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * 0.9 +
        -game.DEFAULT_SPEED_X * player.char.speed * player.char.fast
    );
    // return;
  }
  if (player.pad.right) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * 0.9 +
        game.DEFAULT_SPEED_X * player.char.speed * player.char.fast
    );
    // return;
  }

  return;
}

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