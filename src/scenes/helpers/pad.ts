import Game from "../Game";
import { Player } from "../interfaces";
import {
  isAttackEnergyNearPlayer,
  getIsAttackEnergyOffscreen,
  setPhysicsAttackEnergyOff,
  setPhysicsAttackEnergyOn,
} from "./attacks";

export function updatePadCurrHatController(player: Player, game: Game): void {
  player.padCurr.A = player.gamepad.A;
  player.padCurr.B = player.gamepad.B;
  player.padCurr.X = player.gamepad.X;
  player.padCurr.Y = player.gamepad.Y;
  player.padCurr.L1 = player.gamepad.L1;
  player.padCurr.R1 = player.gamepad.R1;

  // player.padCurr.up = false;
  // player.padCurr.down = false;
  // player.padCurr.left = false;
  // player.padCurr.right = false;

  let hatVal = player?.gamepad?.axes[9]?.getValue();
  let vals = game.GAMEPAD_HAT_VALUES;
  if (hatVal < vals[0]) {
    player.padCurr.up = true;
    player.padCurr.down = false;
    player.padCurr.left = false;
    player.padCurr.right = false;
  } else if (hatVal < vals[1]) {
    player.padCurr.up = true;
    player.padCurr.down = false;
    player.padCurr.left = false;
    player.padCurr.right = true;
  } else if (hatVal < vals[2]) {
    player.padCurr.up = false;
    player.padCurr.down = false;
    player.padCurr.left = false;
    player.padCurr.right = true;
  } else if (hatVal < vals[3]) {
    player.padCurr.up = false;
    player.padCurr.down = true;
    player.padCurr.left = false;
    player.padCurr.right = true;
  } else if (hatVal < vals[4]) {
    player.padCurr.up = false;
    player.padCurr.down = true;
    player.padCurr.left = false;
    player.padCurr.right = false;
  } else if (hatVal < vals[5]) {
    player.padCurr.up = false;
    player.padCurr.down = true;
    player.padCurr.left = true;
    player.padCurr.right = false;
  } else if (hatVal < vals[6]) {
    player.padCurr.up = false;
    player.padCurr.down = false;
    player.padCurr.left = true;
    player.padCurr.right = false;
  } else if (hatVal < vals[7]) {
    player.padCurr.up = true;
    player.padCurr.down = false;
    player.padCurr.left = true;
    player.padCurr.right = false;
  } else {
    player.padCurr.up = false;
    player.padCurr.down = false;
    player.padCurr.left = false;
    player.padCurr.right = false;
  }
  // player.padCurr.up = true;
  // player.padCurr.down = true;
  // player.padCurr.left = true;
  // player.padCurr.right = true;
  // player.padCurr.up = player.gamepad.up;
  // player.padCurr.down = player.gamepad.down;
  // player.padCurr.left = player.gamepad.left;
  // player.padCurr.right = player.gamepad.right;
}
export function updatePadCurrButtonsController(
  player: Player,
  game: Game
): void {
  player.padCurr.up = player.gamepad.up;
  player.padCurr.down = player.gamepad.down;
  player.padCurr.left = player.gamepad.left;
  player.padCurr.right = player.gamepad.right;
  player.padCurr.A = player.gamepad.A;
  player.padCurr.B = player.gamepad.B;
  player.padCurr.X = player.gamepad.X;
  player.padCurr.Y = player.gamepad.Y;
  player.padCurr.L1 = player.gamepad.L1;
  player.padCurr.R1 = player.gamepad.R1;
}

export function updateGamePadsConnected(game: Game): void {
  let playerIndex = 0;

  console.log("NUM GAMEPADS", game.input.gamepad.gamepads.length);
  console.log("NUM GAMEPADS", game.input.gamepad.total);

  game.input.gamepad.gamepads.forEach((gamepad, gamepadIndex) => {
    // gamepad?.axes.forEach((axis, axisIndex) => {
    //   console.log(
    //     "#PADS",
    //     game.input.gamepad.gamepads.length,
    //     "PAD",
    //     gamepadIndex,
    //     "AXIS",
    //     axisIndex,
    //     Math.round(axis.getValue())
    //   );
    // });
    // console.log(gamepadIndex, "ID", gamepad.id);

    if (!gamepad?.id.includes("Jabra") && playerIndex < game.players.length) {
      game.players[playerIndex].gamepad =
        game.input.gamepad.getPad(gamepadIndex);
      playerIndex++;
    }
  });

  game.players.forEach((player, playerIndex) => {
    if (player.gamepad) {
      if (player?.gamepad?.axes) {
        updatePadCurrHatController(player, game);
      } else {
        updatePadCurrButtonsController(player, game);
      }
    }
  });

  // for (let i = 0; i < game.input.gamepad.gamepads.length; i++) {
  //   for (let j = 0; j < game.input.gamepad.gamepads[i].axes.length; j++) {
  //     console.log(
  //       "#PADS",
  //       game.input.gamepad.gamepads.length,
  //       "PAD",
  //       i,
  //       "AXIS",
  //       j,
  //       Math.round(game.input.gamepad.gamepads[i].axes[j].getValue())
  //     );
  //   }
  //   if (
  //     !game.input.gamepad.gamepads[i]?.id.includes("Jabra") &&
  //     playerIndex < game.players.length
  //   ) {
  //     game.players[playerIndex].gamepad = game.input.gamepad.getPad(i);
  //     playerIndex++;
  //   }
  // }
}

export function getControllerIsRealController(gamepad: Gamepad): boolean {
  if (gamepad.id.includes("Jabra")) {
    return false;
  }
  return true;
}

export function getIsAnyPlayerPausing(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (getPlayerPauses(game.players[i], game)) {
      return true;
    }
  }
  return false;
}

export function getPlayerPauses(player: Player, game: Game): boolean {
  return getPlayerPressedBothLR(player, game);
  // return playerAllRightButtonsPressed(player, game);
}

export function getPlayerPressedBothLR(player: Player, game: Game): boolean {
  // if (player.gamepad.L1 && player.gamepad.R1) {
  //   return true;
  // }
  if (player.padCurr.L1 && player.padCurr.R1) {
    return true;
  }

  return false;
}

export function getIsPlayerReady(player: Player, game: Game): boolean {
  if (
    !player.padCurr.up &&
    !player.padCurr.down &&
    !player.padCurr.left &&
    !player.padCurr.right &&
    !player.padCurr.A &&
    !player.padCurr.B &&
    !player.padCurr.X &&
    !player.padCurr.Y &&
    !player.padCurr.R1 &&
    !player.padCurr.L1
  ) {
    return false;
  }
  // if (
  //   !player.gamepad.up &&
  //   !player.gamepad.down &&
  //   !player.gamepad.left &&
  //   !player.gamepad.right &&
  //   !player.gamepad.A &&
  //   !player.gamepad.B &&
  //   !player.gamepad.X &&
  //   !player.gamepad.Y &&
  //   !player.gamepad.R1 &&
  //   !player.gamepad.L1
  // ) {
  //   return false;
  // }

  return true;
}

export function getIsAllPlayersReady(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (
      !game.players[i].padCurr.up &&
      !game.players[i].padCurr.down &&
      !game.players[i].padCurr.left &&
      !game.players[i].padCurr.right &&
      !game.players[i].padCurr.A &&
      !game.players[i].padCurr.B &&
      !game.players[i].padCurr.X &&
      !game.players[i].padCurr.Y &&
      !game.players[i].padCurr.R1 &&
      !game.players[i].padCurr.L1
    ) {
      return false;
    }
  }
  // for (let i = 0; i < game.players.length; i++) {
  //   if (
  //     !game.players[i].gamepad.up &&
  //     !game.players[i].gamepad.down &&
  //     !game.players[i].gamepad.left &&
  //     !game.players[i].gamepad.right &&
  //     !game.players[i].gamepad.A &&
  //     !game.players[i].gamepad.B &&
  //     !game.players[i].gamepad.X &&
  //     !game.players[i].gamepad.Y &&
  //     !game.players[i].gamepad.R1 &&
  //     !game.players[i].gamepad.L1
  //   ) {
  //     return false;
  //   }
  // }
  return true;
}

export function resetMyHitByMatrix(
  player: Player,
  playerIndex: number,
  game: Game
): void {
  if (player.state.name === "player-state-hurt") {
    return;
  }
  for (let j = 0; j < game.players.length; j++) {
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
export function updateAttackEnergy(player: Player, game: Game): void {
  // if (player.pad?.up && !(player.pad.left || player.pad.right)) {
  //   return;
  // }

  if (
    !getIsAttackEnergyOffscreen(player.char.attackEnergy, game) &&
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
        player.char.attackEnergy.durationCooldown &&
    player.char.attackEnergy.state === "held"
  ) {
    game.SOUND_GUN.play();
    player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
    player.char.attackEnergy.state = "released";
    setPhysicsAttackEnergyOn(player);
    playerShootAttackEnergy(player, game);
    return;
  }
  // HOLD
  if (
    (player.gamepad?.X || player.padPrev.X || player.padDebounced.X) &&
    game.gameNanoseconds >
      player.char.attackEnergy.timestampThrow +
        player.char.attackEnergy.durationCooldown
  ) {
    player.char.attackEnergy.state = "held";
    setPhysicsAttackEnergyOff(player);
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
  // game.players.forEach((player) => {
  //   player.padPrev.up = player.gamepad.up;
  //   player.padPrev.down = player.gamepad.down;
  //   player.padPrev.left = player.gamepad.left;
  //   player.padPrev.right = player.gamepad.right;
  //   player.padPrev.A = player.gamepad.A;
  //   player.padPrev.B = player.gamepad.B;
  //   player.padPrev.X = player.gamepad.X;
  //   player.padPrev.Y = player.gamepad.Y;

  //   player.char.sprite.zoom = 1;

  //   if (player.gamepad.up) {
  //     player.padDebounced.up +=
  //       player.padDebounced.up >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.up += player.padDebounced.up <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.down) {
  //     player.padDebounced.down +=
  //       player.padDebounced.down >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.down += player.padDebounced.down <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.left) {
  //     player.padDebounced.left +=
  //       player.padDebounced.left >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.left += player.padDebounced.left <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.right) {
  //     player.padDebounced.right +=
  //       player.padDebounced.right >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.right += player.padDebounced.right <= 0 ? 0 : -1;
  //   }

  //   if (player.gamepad.A) {
  //     player.padDebounced.A +=
  //       player.padDebounced.A >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.A += player.padDebounced.A <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.B) {
  //     player.padDebounced.B +=
  //       player.padDebounced.B >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.B += player.padDebounced.B <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.X) {
  //     player.padDebounced.X +=
  //       player.padDebounced.X >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.X += player.padDebounced.X <= 0 ? 0 : -1;
  //   }
  //   if (player.gamepad.Y) {
  //     player.padDebounced.Y +=
  //       player.padDebounced.Y >= game.DEBOUNCE_NUMBER ? 0 : 1;
  //   } else {
  //     player.padDebounced.Y += player.padDebounced.Y <= 0 ? 0 : -1;
  //   }
  // });
  game.players.forEach((player) => {
    player.padPrev.up = player.padCurr.up;
    player.padPrev.down = player.padCurr.down;
    player.padPrev.left = player.padCurr.left;
    player.padPrev.right = player.padCurr.right;
    player.padPrev.A = player.padCurr.A;
    player.padPrev.B = player.padCurr.B;
    player.padPrev.X = player.padCurr.X;
    player.padPrev.Y = player.padCurr.Y;

    player.char.sprite.zoom = 1;

    if (player.padCurr.up) {
      player.padDebounced.up +=
        player.padDebounced.up >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.up += player.padDebounced.up <= 0 ? 0 : -1;
    }
    if (player.padCurr.down) {
      player.padDebounced.down +=
        player.padDebounced.down >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.down += player.padDebounced.down <= 0 ? 0 : -1;
    }
    if (player.padCurr.left) {
      player.padDebounced.left +=
        player.padDebounced.left >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.left += player.padDebounced.left <= 0 ? 0 : -1;
    }
    if (player.padCurr.right) {
      player.padDebounced.right +=
        player.padDebounced.right >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.right += player.padDebounced.right <= 0 ? 0 : -1;
    }

    if (player.padCurr.A) {
      player.padDebounced.A +=
        player.padDebounced.A >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.A += player.padDebounced.A <= 0 ? 0 : -1;
    }
    if (player.padCurr.B) {
      player.padDebounced.B +=
        player.padDebounced.B >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.B += player.padDebounced.B <= 0 ? 0 : -1;
    }
    if (player.padCurr.X) {
      player.padDebounced.X +=
        player.padDebounced.X >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.X += player.padDebounced.X <= 0 ? 0 : -1;
    }
    if (player.padCurr.Y) {
      player.padDebounced.Y +=
        player.padDebounced.Y >= game.DEBOUNCE_NUMBER ? 0 : 1;
    } else {
      player.padDebounced.Y += player.padDebounced.Y <= 0 ? 0 : -1;
    }
  });
}

export function debugUpdateControllersPrintConnected(game: Game): void {
  if (!game.debug.setPrintControllerConnectedConsole) {
    return;
  }
  game.players.forEach((player, playerIndex) => {
    // console.log("PLAYER", playerIndex, "CONTROLLER", player.gamepad);
    console.log("PLAYER", playerIndex, "CONTROLLER", player.gamepad.id);
  });
}

export function updateControllerMovement(player: Player, game: Game): void {
  if (player.gamepad) {
    if (
      !player.padCurr.left &&
      !player.padCurr.right &&
      !player.padCurr.up &&
      !player.padCurr.down
    ) {
      return;
    }
    // if (player.gamepad) {
    //   if (
    //     !player.gamepad.left &&
    //     !player.gamepad.right &&
    //     !player.gamepad.up &&
    //     !player.gamepad.down
    //   ) {
    //     return;
    //   }

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
    if (player.padCurr.up && !player.padCurr.Y) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          -game.DEFAULT_SPEED_Y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
    if (player.padCurr.down) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          game.DEFAULT_SPEED_Y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // return;
    }
    if (player.padCurr.left) {
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
    if (player.padCurr.right) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          game.RATIO_ACCELERATION_VELOCITY *
          Math.pow(player.char.friction_air, 4) +
          game.DEFAULT_SPEED_X *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
      // // CHECK INDIVIDUALS
      // if (player.gamepad.up && !player.gamepad.Y) {
      //   player.char.sprite.body.setVelocityY(
      //     player.char.sprite.body.velocity.y +
      //       -game.DEFAULT_SPEED_Y *
      //         player.char.speed *
      //         player.char.fast *
      //         (1 - game.RATIO_ACCELERATION_VELOCITY)
      //   );
      //   // return;
      // }
      // if (player.gamepad.down) {
      //   player.char.sprite.body.setVelocityY(
      //     player.char.sprite.body.velocity.y +
      //       game.DEFAULT_SPEED_Y *
      //         player.char.speed *
      //         player.char.fast *
      //         (1 - game.RATIO_ACCELERATION_VELOCITY)
      //   );
      //   // return;
      // }
      // if (player.gamepad.left) {
      //   player.char.sprite.body.setVelocityX(
      //     player.char.sprite.body.velocity.x *
      //       game.RATIO_ACCELERATION_VELOCITY *
      //       Math.pow(player.char.friction_air, 3) +
      //       -game.DEFAULT_SPEED_X *
      //         player.char.speed *
      //         player.char.fast *
      //         (1 - game.RATIO_ACCELERATION_VELOCITY)
      //   );
      //   // return;
      // }
      // if (player.gamepad.right) {
      //   player.char.sprite.body.setVelocityX(
      //     player.char.sprite.body.velocity.x *
      //       game.RATIO_ACCELERATION_VELOCITY *
      //       Math.pow(player.char.friction_air, 4) +
      //       game.DEFAULT_SPEED_X *
      //         player.char.speed *
      //         player.char.fast *
      //         (1 - game.RATIO_ACCELERATION_VELOCITY)
      //   );
      // return;
    }
  }
}

export function debugUpdatePrintAllControllerButtonsWhenActive(
  game: Game
): void {
  if (!game.debug.setPrintControllerButtonsConsole) {
    return;
  }
  // Buttons
  game.players.forEach((player, playerIndex) => {
    if (player.gamepad) {
      if (playerIndex === 0) {
        // console.log(playerIndex, player.gamepad);
        // console.log(playerIndex, player.gamepad.axes);
        // console.log(playerIndex, player.gamepad.buttons[0].pressed);
        //
        // console.log(
        //   playerIndex,
        //   "player.gamepad._RCTop",
        //   player.gamepad._RCTop
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._RCBottom",
        //   player.gamepad._RCBottom
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._RCLeft",
        //   player.gamepad._RCLeft
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._RCRight",
        //   player.gamepad._RCRight
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._LCTop",
        //   player.gamepad._LCTop
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._LCBottom",
        //   player.gamepad._LCBottom
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._LCLeft",
        //   player.gamepad._LCLeft
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._LCRight",
        //   player.gamepad._LCRight
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._FBLeftBottom",
        //   player.gamepad._FBLeftBottom
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._FBLeftTop",
        //   player.gamepad._FBLeftTop
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._FBRightBottom",
        //   player.gamepad._FBRightBottom
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._FBRightTop",
        //   player.gamepad._FBRightTop
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._HAxisLeft",
        //   player.gamepad._HAxisLeft
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._VAxisLeft",
        //   player.gamepad._VAxisLeft
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._HAxisRight",
        //   player.gamepad._HAxisRight
        // );
        // console.log(
        //   playerIndex,
        //   "player.gamepad._VAxisRight",
        //   player.gamepad._VAxisRight
        // );
      }
      if (player.padCurr.B) {
        console.log(player.playerId, "B");
      }
      if (player.padCurr.A) {
        console.log(player.playerId, "A");
      }
      if (player.padCurr.X) {
        console.log(player.playerId, "X");
      }
      if (player.padCurr.Y) {
        console.log(player.playerId, "Y");
        // player.char.fast = 2;
      }

      //  D Pad
      if (player.padCurr.down) {
        console.log(player.playerId, "down");
      }
      if (player.padCurr.up) {
        console.log(player.playerId, "up");
      }
      if (player.padCurr.left) {
        console.log(player.playerId, "left");
      }
      if (player.padCurr.right) {
        console.log(player.playerId, "right");
      }

      // L R Buttons
      if (player.padCurr.L1) {
        console.log(player.playerId, "L1");
      }
      if (player.padCurr.R1) {
        console.log(player.playerId, "R1");
      }

      // if (player.gamepad.B) {
      //   console.log(player.playerId, "B");
      // }
      // if (player.gamepad.A) {
      //   console.log(player.playerId, "A");
      // }
      // if (player.gamepad.X) {
      //   console.log(player.playerId, "X");
      // }
      // if (player.gamepad.Y) {
      //   console.log(player.playerId, "Y");
      //   // player.char.fast = 2;
      // }

      // //  D Pad
      // if (player.gamepad.down) {
      //   console.log(player.playerId, "down");
      // }
      // if (player.gamepad.up) {
      //   console.log(player.playerId, "up");
      // }
      // if (player.gamepad.left) {
      //   console.log(player.playerId, "left");
      // }
      // if (player.gamepad.right) {
      //   console.log(player.playerId, "right");
      // }

      // // L R Buttons
      // if (player.gamepad.L1) {
      //   console.log(player.playerId, "L1");
      // }
      // if (player.gamepad.R1) {
      //   console.log(player.playerId, "R1");
      // }
      // // L R Buttons
      // if (player.gamepad.L2) {
      //   console.log(player.playerId, "L2");
      // }
      // if (player.gamepad.R2) {
      //   console.log(player.playerId, "R2");
      // }

      // for (let i = 0; i < player.gamepad.pad.buttons.length; i++) {
      //   //   console.log(i);
      //   console.log("ERIC", i, player.gamepad.pad.buttons[i].value);
      // }
      // console.log("ERIC", player.gamepad.pad.buttons[0].value);
      // console.log(player.gamepad.pad.buttons[1].value);
      // console.log(player.pad.gamepad.buttons[0].pressed);
    }
  });
}
