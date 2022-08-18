import Game from "./Game";
import { Player } from "./interfaces";

export function assignGamePadsConnected(game: Game): void {
  for (let i = 0; i < game.input.gamepad.total; i++) {
    game.players[game.playersOrder[i]].pad = game.input.gamepad.getPad(i);
  }
}

export function attackEnergy(player: Player, game: Game): void {
  var vX =
    player.char.sprite.body.velocity.x * 2 * player.char.attackEnergy.vel.x;
  var vY = 10 * player.char.attackEnergy.vel.y;
  vY +=
    player.char.attackEnergy.vel.y === 0
      ? 0
      : player.char.sprite.body.velocity.y;
  var laserSpeed = 600;
  if (
    player.pad?.X &&
    !player.padPrev.X
    // isSpriteOffscreen(player.char.attack.sprite, game)
  ) {
    if (player.char.sprite.flipX) {
      player.char.attackEnergy.sprite.x =
        player.char.sprite.x - player.char.sprite.width;
      player.char.attackEnergy.sprite.y =
        player.char.sprite.y - player.char.attackEnergy.sprite.height;
      player.char.attackEnergy.sprite.body.setVelocityX(-1 * laserSpeed + vX);
      player.char.attackEnergy.sprite.body.setVelocityY(vY);
    } else {
      player.char.attackEnergy.sprite.x =
        player.char.sprite.x + player.char.sprite.width;
      player.char.attackEnergy.sprite.y =
        player.char.sprite.y - player.char.attackEnergy.sprite.height;
      player.char.attackEnergy.sprite.body.setVelocityX(laserSpeed + vX);
      player.char.attackEnergy.sprite.body.setVelocityY(vY);
    }
  }
}
export function isSpriteOffscreen(
  sprite: Phaser.GameObjects.Sprite,
  game: Game
): boolean {
  if (
    sprite.x > game.SCREEN_DIMENSIONS.WIDTH ||
    sprite.x < 0 ||
    sprite.y > game.SCREEN_DIMENSIONS.HEIGHT ||
    sprite.y < 0
  ) {
    return true;
  }
  return false;
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

  player.char.sprite.zoom = 1;
}

export function controllerSetFast(player: Player, game: Game): void {
  // if (player.pad.B) {
  //   player.char.fast = 2;
  //   return;
  // }
  player.char.fast = 2;
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

  if (player.pad) {
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
    if (player.pad.up && !player.pad.Y) {
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
        player.char.sprite.body.velocity.x *
          Math.pow(player.char.friction_air, 3) +
          -game.DEFAULT_SPEED_X * player.char.speed * player.char.fast
      );
      // return;
    }
    if (player.pad.right) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          Math.pow(player.char.friction_air, 4) +
          game.DEFAULT_SPEED_X * player.char.speed * player.char.fast
      );
      // return;
    }

    return;
  }
}

export function printAllPadsActive(player: Player, game: Game): void {
  // Buttons

  if (player.pad) {
    if (player.pad.B) {
      console.log(player.playerNumber, "B");
    }
    if (player.pad.A) {
      console.log(player.playerNumber, "A");
    }
    if (player.pad.X) {
      console.log(player.playerNumber, "X");
    }
    if (player.pad.Y) {
      console.log(player.playerNumber, "Y");
      player.char.fast = 2;
    }

    //  D Pad
    if (player.pad.down) {
      console.log(player.playerNumber, "down");
    }
    if (player.pad.up) {
      console.log(player.playerNumber, "up");
    }
    if (player.pad.left) {
      console.log(player.playerNumber, "left");
    }
    if (player.pad.right) {
      console.log(player.playerNumber, "right");
    }

    // L R Buttons
    if (player.pad.L1) {
      console.log(player.playerNumber, "L1");
    }
    if (player.pad.R1) {
      console.log(player.playerNumber, "R1");
    }
  }
}
