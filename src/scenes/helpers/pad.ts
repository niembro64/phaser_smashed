import Game from "../Game";
import { Player } from "../interfaces";
import {
  isAttackEnergyNearPlayer,
  isAttackEnergyOffscreen,
  turnOffPhysicsAttackEnergy,
  turnOnPhysicsAttackEnergy,
} from "./attacks";

export function updateGamePadsConnected(game: Game): void {
  for (
    let i = 0;
    i < game.input.gamepad.total && i < game.PLAYER_CHOICES.length;
    i++
  ) {
    game.players[game.playerSpawnOrder[i]].gamepad =
      game.input.gamepad.getPad(i);
  }
}

export function getIsAnyPlayerPausing(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (playerPauses(game.players[i], game)) {
      return true;
    }
  }
  return false;
}

export function playerPauses(player: Player, game: Game): boolean {
  return playerPressedBothLR(player, game);
  // return playerAllRightButtonsPressed(player, game);
}

export function playerPressedBothLR(player: Player, game: Game): boolean {
  if (player.gamepad.L1 && player.gamepad.R1) {
    return true;
  }

  return false;
}
export function playerAllRightButtonsPressed(
  player: Player,
  game: Game
): boolean {
  if (
    player.gamepad.A &&
    player.gamepad.B &&
    player.gamepad.X &&
    player.gamepad.Y
  ) {
    return true;
  }

  return false;
}

export function isPlayerReady(player: Player, game: Game): boolean {
  if (
    !player.gamepad.up &&
    !player.gamepad.down &&
    !player.gamepad.left &&
    !player.gamepad.right &&
    !player.gamepad.A &&
    !player.gamepad.B &&
    !player.gamepad.X &&
    !player.gamepad.Y &&
    !player.gamepad.R1 &&
    !player.gamepad.L1
  ) {
    return false;
  }

  return true;
}

export function getIsAllPlayersReady(game: Game): boolean {
  for (let i = 0; i < game.PLAYER_CHOICES.length; i++) {
    if (
      !game.players[i].gamepad.up &&
      !game.players[i].gamepad.down &&
      !game.players[i].gamepad.left &&
      !game.players[i].gamepad.right &&
      !game.players[i].gamepad.A &&
      !game.players[i].gamepad.B &&
      !game.players[i].gamepad.X &&
      !game.players[i].gamepad.Y &&
      !game.players[i].gamepad.R1 &&
      !game.players[i].gamepad.L1
    ) {
      return false;
    }
  }
  return true;
}

export function resetMyHitByMatrix(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (player.state.name === "hurt") {
    return;
  }
  for (let j = 0; j < game.PLAYER_CHOICES.length; j++) {
    game.wasLastHitByMatrix[playerIndex][j] = false;
  }
}

export function updateAttackEnergyFrictionGroundRotation(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.body.touching.down) {
      player.char.attackEnergy.sprite.setAngularVelocity(
        player.char.attackEnergy.sprite.body.angularVelocity *
          player.char.attackEnergy.friction.ground
      );
    }
  });
}

export function updateAttackEnergyFrictionGroundMovement(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.body.touching.down) {
      player.char.attackEnergy.sprite.setVelocityX(
        player.char.attackEnergy.sprite.body.velocity.x *
          player.char.attackEnergy.friction.ground
      );
    }
  });
}

export function updateAttackEnergyFrictionWall(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (
      player.char.attackEnergy.friction.wallInvertRotation &&
      (player.char.attackEnergy.sprite.body.touching.left ||
        player.char.attackEnergy.sprite.body.touching.right)
    ) {
      player.char.attackEnergy.sprite.setAngularVelocity(
        -player.char.attackEnergy.sprite.body.angularVelocity
      );

      if (player.char.attackEnergy.friction.wallInvertSprite) {
        player.char.attackEnergy.sprite.flipX =
          !player.char.attackEnergy.sprite.flipX;
      }
    }
  });
}

export function playerHoldAttackEnergy(player: Player): void {
  player.char.attackEnergy.sprite.body.allowGravity = false;

  // player.char.attackEnergy.sprite.body.setVelocityX(0);
  // player.char.attackEnergy.sprite.body.setVelocityY(0);

  if (player.char.sprite.flipX) {
    player.char.attackEnergy.sprite.x =
      player.char.sprite.x - player.char.attackEnergy.posFromCenter.x;
    player.char.attackEnergy.sprite.y =
      player.char.sprite.y + player.char.attackEnergy.posFromCenter.y;

    player.char.attackEnergy.sprite.flipX = true;
    player.char.attackEnergy.sprite.setRotation(
      (player.char.attackEnergy.rotation.initial * Math.PI) / 2
    );
    player.char.attackEnergy.sprite.setAngularVelocity(0);
  } else {
    player.char.attackEnergy.sprite.x =
      player.char.sprite.x + player.char.attackEnergy.posFromCenter.x;
    player.char.attackEnergy.sprite.y =
      player.char.sprite.y + player.char.attackEnergy.posFromCenter.y;

    player.char.attackEnergy.sprite.flipX = false;
    player.char.attackEnergy.sprite.setRotation(
      player.char.attackEnergy.rotation.initial
    );
    player.char.attackEnergy.sprite.setAngularVelocity(0);
  }
}

export function playerShootAttackEnergy(player: Player, game: Game): void {
  var vX =
    player.char.sprite.body.velocity.x * player.char.attackEnergy.vel.x * 0.5;

  var vY = 0;
  if (player.char.attackEnergy.allowVelocityY) {
    vY = 300 * player.char.attackEnergy.vel.y;
    vY += player.char.sprite.body.velocity.y * 0.5;
  }

  if (player.char.attackEnergy.allowVelocityY) {
    player.char.attackEnergy.sprite.body.allowGravity = true;
  }

  if (player.char.sprite.flipX) {
    player.char.attackEnergy.sprite.x =
      player.char.sprite.x - player.char.attackEnergy.posFromCenter.x;
    player.char.attackEnergy.sprite.y =
      player.char.sprite.y + player.char.attackEnergy.posFromCenter.y;

    player.char.attackEnergy.sprite.body.setVelocityX(
      -1 * game.ATTACK_ENERGY_SPEED_X + vX
    );
    player.char.attackEnergy.sprite.body.setVelocityY(vY);

    player.char.attackEnergy.sprite.flipX = true;
    player.char.attackEnergy.sprite.setRotation(
      (player.char.attackEnergy.rotation.initial * Math.PI) / 2
    );
    player.char.attackEnergy.sprite.setAngularVelocity(
      player.char.attackEnergy.rotation.speed * Math.PI * -1
    );
  } else {
    player.char.attackEnergy.sprite.x =
      player.char.sprite.x + player.char.attackEnergy.posFromCenter.x;
    player.char.attackEnergy.sprite.y =
      player.char.sprite.y + player.char.attackEnergy.posFromCenter.y;

    player.char.attackEnergy.sprite.body.setVelocityX(
      game.ATTACK_ENERGY_SPEED_X + vX
    );
    player.char.attackEnergy.sprite.body.setVelocityY(vY);

    player.char.attackEnergy.sprite.flipX = false;
    player.char.attackEnergy.sprite.setRotation(
      player.char.attackEnergy.rotation.initial
    );
    player.char.attackEnergy.sprite.setAngularVelocity(
      player.char.attackEnergy.rotation.speed * Math.PI
    );
  }
}

export function playerGrabAttackEnergy(player: Player): void {
  player.char.attackEnergy.sprite.body.setVelocityX(0);
  player.char.attackEnergy.sprite.body.setVelocityY(0);
}
export function attackEnergy(player: Player, game: Game): void {
  // if (player.pad?.up && !(player.pad.left || player.pad.right)) {
  //   return;
  // }

  if (
    !isAttackEnergyOffscreen(player.char.attackEnergy, game) &&
    !isAttackEnergyNearPlayer(player)
  ) {
    return;
  }

  // GRAB
  // if (
  //   player.pad?.X &&
  //   !player.padPrev.X &&
  //   game.NanosecondsTime >
  //     player.char.attackEnergy.timestampThrow +
  //       player.char.attackEnergy.durationBetweenThrows
  // ) {
  //   player.char.attackEnergy.state = "held";
  //   turnOffPhysicsAttackEnergy(player);
  //   playerGrabAttackEnergy(player);
  // }

  // SHOOT
  if (
    !player.gamepad?.X &&
    player.padPrev.X &&
    game.gameNanoseconds >
      player.char.attackEnergy.timestampThrow +
        player.char.attackEnergy.durationBetweenThrows &&
    player.char.attackEnergy.state === "held"
  ) {
    game.SOUND_GUN.play();
    player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
    player.char.attackEnergy.state = "released";
    turnOnPhysicsAttackEnergy(player);
    playerShootAttackEnergy(player, game);
    return;
  }
  // HOLD
  if (
    (player.gamepad?.X || player.padPrev.X || player.padDebounced.X) &&
    game.gameNanoseconds >
      player.char.attackEnergy.timestampThrow +
        player.char.attackEnergy.durationBetweenThrows
  ) {
    player.char.attackEnergy.state = "held";
    turnOffPhysicsAttackEnergy(player);
    playerHoldAttackEnergy(player);
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

export function updatePadPreviousAndDebounced(game: Game): void {
  game.players.forEach((player) => {
    player.padPrev.up = player.gamepad.up;
    player.padPrev.down = player.gamepad.down;
    player.padPrev.left = player.gamepad.left;
    player.padPrev.right = player.gamepad.right;
    player.padPrev.A = player.gamepad.A;
    player.padPrev.B = player.gamepad.B;
    player.padPrev.X = player.gamepad.X;
    player.padPrev.Y = player.gamepad.Y;

    player.char.sprite.zoom = 1;

    if (player.gamepad.up) {
      player.padDebounced.up +=
        player.padDebounced.up >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.up += player.padDebounced.up <= 0 ? 0 : -1;
    }
    if (player.gamepad.down) {
      player.padDebounced.down +=
        player.padDebounced.down >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.down += player.padDebounced.down <= 0 ? 0 : -1;
    }
    if (player.gamepad.left) {
      player.padDebounced.left +=
        player.padDebounced.left >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.left += player.padDebounced.left <= 0 ? 0 : -1;
    }
    if (player.gamepad.right) {
      player.padDebounced.right +=
        player.padDebounced.right >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.right += player.padDebounced.right <= 0 ? 0 : -1;
    }

    if (player.gamepad.A) {
      player.padDebounced.A +=
        player.padDebounced.A >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.A += player.padDebounced.A <= 0 ? 0 : -1;
    }
    if (player.gamepad.B) {
      player.padDebounced.B +=
        player.padDebounced.B >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.B += player.padDebounced.B <= 0 ? 0 : -1;
    }
    if (player.gamepad.X) {
      player.padDebounced.X +=
        player.padDebounced.X >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.X += player.padDebounced.X <= 0 ? 0 : -1;
    }
    if (player.gamepad.Y) {
      player.padDebounced.Y +=
        player.padDebounced.Y >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.Y += player.padDebounced.Y <= 0 ? 0 : -1;
    }
  });
}

export function controllerMovement(player: Player, game: Game): void {
  if (player.gamepad) {
    if (
      !player.gamepad.left &&
      !player.gamepad.right &&
      !player.gamepad.up &&
      !player.gamepad.down
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
    if (player.gamepad.up && !player.gamepad.Y) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          -game.DEFAULT_SPEED_Y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
    if (player.gamepad.down) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          game.DEFAULT_SPEED_Y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
    if (player.gamepad.left) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          game.RATIO_ACCELERATION_VELOCITY *
          Math.pow(player.char.friction_air, 3) +
          -game.DEFAULT_SPEED_X *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
    if (player.gamepad.right) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          game.RATIO_ACCELERATION_VELOCITY *
          Math.pow(player.char.friction_air, 4) +
          game.DEFAULT_SPEED_X *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
  }
}

export function printAllPadsActive(player: Player, game: Game): void {
  // Buttons
  console.log("++++++++++++ERIC HERE");
  if (player.gamepad) {
    if (player.gamepad.B) {
      console.log(player.playerNumber, "B");
    }
    if (player.gamepad.A) {
      console.log(player.playerNumber, "A");
    }
    if (player.gamepad.X) {
      console.log(player.playerNumber, "X");
    }
    if (player.gamepad.Y) {
      console.log(player.playerNumber, "Y");
      // player.char.fast = 2;
    }

    //  D Pad
    if (player.gamepad.down) {
      console.log(player.playerNumber, "down");
    }
    if (player.gamepad.up) {
      console.log(player.playerNumber, "up");
    }
    if (player.gamepad.left) {
      console.log(player.playerNumber, "left");
    }
    if (player.gamepad.right) {
      console.log(player.playerNumber, "right");
    }

    // L R Buttons
    if (player.gamepad.L1) {
      console.log(player.playerNumber, "L1");
    }
    if (player.gamepad.R1) {
      console.log(player.playerNumber, "R1");
    }
    // L R Buttons
    if (player.gamepad.L2) {
      console.log(player.playerNumber, "L2");
    }
    if (player.gamepad.R2) {
      console.log(player.playerNumber, "R2");
    }

    // for (let i = 0; i < player.gamepad.pad.buttons.length; i++) {
    //   //   console.log(i);
    //   console.log("ERIC", i, player.gamepad.pad.buttons[i].value);
    // }
    // console.log("ERIC", player.gamepad.pad.buttons[0].value);
    // console.log(player.gamepad.pad.buttons[1].value);
    // console.log(player.pad.gamepad.buttons[0].pressed);
  }
}
