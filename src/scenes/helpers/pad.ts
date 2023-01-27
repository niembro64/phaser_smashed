import Game, { SCREEN_DIMENSIONS } from '../Game';
import { InputType, Player } from '../interfaces';
import {
  getIsAttackEnergyOffscreen,
  isAttackEnergyNearPlayer,
  setPhysicsAttackEnergyOff,
  setPhysicsAttackEnergyOn,
} from './attacks';
import { getIsBot, updateMoveBot } from './bot';
import { updatePadCurrKeyboard } from './keyboard';
import { getHasBeenGameDurationSinceMoment } from './powers';

export function updateGamePadsMaster(game: Game): void {
  let numPlayers = game.players.length;
  let padIndex = 0;
  let numPads = game.input.gamepad.gamepads.length;

  for (let i = 0; i < numPlayers; i++) {
    if (game.players[i].inputType === 1 && padIndex < numPads) {
      game.players[i].gamepad = game.input.gamepad.getPad(padIndex);
      padIndex++;
    }
  }

  game.players.forEach((player, playerIndex) => {
    let inputType: InputType = player.inputType;

    switch (inputType) {
      case 0:
        break;
      case 1:
        if (player?.gamepad) {
          if (player?.gamepad?.axes?.length === 4) {
            console.log('CONTROLLER TYPE: PRO', player.gamepad);
            updatePadCurrControllerTypePro(player, game);
          } else if (player?.gamepad?.axes?.length) {
            updatePadCurrControllerTypeHat(player, game);
          } else {
            updatePadCurrControllerTypeButtons(player, playerIndex, game);
          }
        }
        break;
      case 2:
        updatePadCurrKeyboard(player, game);
        break;
      case 3:
        updateMoveBot(player, playerIndex, game);
        break;
      default:
        break;
    }
  });
}

export function updatePadCurrControllerTypePro(
  player: Player,
  game: Game
): void {
  player.padCurr.A = player.gamepad.A;
  player.padCurr.B = player.gamepad.B;
  player.padCurr.X = player.gamepad.X;
  player.padCurr.Y = player.gamepad.Y;
  player.padCurr.L = player.gamepad.L1;
  player.padCurr.R = player.gamepad.R1;

  // EMN TODO Not Ideal
  player.padCurr.start = false;
  player.padCurr.select = false;

  // for (let i = 0; i < player?.gamepad?.axes.length; i++) {
  //   console.log(i, player?.gamepad?.axes[i]?.getValue());
  // }
  let stickX = player?.gamepad?.axes[0]?.getValue();
  let stickY = player?.gamepad?.axes[1]?.getValue();
  let tol = 0.3;

  if (stickX !== null || stickY !== null) {
    if (stickX === 0 && stickY === 0) {
      player.padCurr.left = false;
      player.padCurr.right = false;
      player.padCurr.up = false;
      player.padCurr.down = false;
    }
    console.log('stickX', stickX);
    console.log('stickY', stickY);
    // if (stickX === -1 && stickY === -1) {
    //   player.padCurr.left = true;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = true;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX === -1 && stickY === 1) {
    //   player.padCurr.left = true;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = false;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX === 1 && stickY === -1) {
    //   player.padCurr.left = false;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = true;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX === 1 && stickY === 1) {
    //   player.padCurr.left = false;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = false;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // }

    // if (stickX === -1) {
    //   player.padCurr.left = true;
    //   player.padCurr.right = !player.padCurr.left;
    // } else if (stickX === 1) {
    //   player.padCurr.left = false;
    //   player.padCurr.right = !player.padCurr.left;
    // }
    // if (stickY === -1) {
    //   player.padCurr.up = true;
    //   player.padCurr.down = !player.padCurr.up;
    // } else if (stickY === 1) {
    //   player.padCurr.up = false;
    //   player.padCurr.down = !player.padCurr.up;
    // }

    //  non boolean
    // if (stickX < -tol && stickY < -tol) {
    //   player.padCurr.left = true;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = true;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX < -tol && stickY > tol) {
    //   player.padCurr.left = true;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = false;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX > tol && stickY < -tol) {
    //   player.padCurr.left = false;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = true;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // } else if (stickX > tol && stickY > tol) {
    //   player.padCurr.left = false;
    //   player.padCurr.right = !player.padCurr.left;
    //   player.padCurr.up = false;
    //   player.padCurr.down = !player.padCurr.up;
    //   return;
    // }

    if (stickX < -tol) {
      player.padCurr.left = true;
      player.padCurr.right = !player.padCurr.left;
    } else if (stickX > tol) {
      player.padCurr.left = false;
      player.padCurr.right = !player.padCurr.left;
    } else {
      player.padCurr.left = false;
      player.padCurr.right = false;
    }
    if (stickY < -tol) {
      player.padCurr.up = true;
      player.padCurr.down = !player.padCurr.up;
    } else if (stickY > tol) {
      player.padCurr.up = false;
      player.padCurr.down = !player.padCurr.up;
    } else {
      player.padCurr.up = false;
      player.padCurr.down = false;
    }
  }
}

export function updatePadCurrControllerTypeHat(
  player: Player,
  game: Game
): void {
  player.padCurr.A = player.gamepad.A;
  player.padCurr.B = player.gamepad.B;
  player.padCurr.X = player.gamepad.X;
  player.padCurr.Y = player.gamepad.Y;
  player.padCurr.L = player.gamepad.L1;
  player.padCurr.R = player.gamepad.R1;

  // EMN TODO Not Ideal
  player.padCurr.start = false;
  player.padCurr.select = false;

  // NO STICK TRY HAT
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
}

export function updatePadCurrControllerTypeButtons(
  player: Player,
  playerIndex: number,
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
  player.padCurr.L = player.gamepad.L1;
  player.padCurr.R = player.gamepad.R1;

  // EMN TODO Not Ideal
  player.padCurr.start = false;
  player.padCurr.select = false;

  if (
    player?.gamepad?.buttons?.length &&
    player?.gamepad?.buttons[9]?.pressed !== undefined &&
    player?.gamepad?.buttons[9]?.pressed !== null
  ) {
    player.padCurr.start = player.gamepad?.buttons[9]?.pressed ? true : false;
  }
  if (
    player?.gamepad?.buttons?.length &&
    player?.gamepad?.buttons[8]?.pressed !== undefined &&
    player?.gamepad?.buttons[8]?.pressed !== null
  ) {
    player.padCurr.select = player.gamepad?.buttons[8]?.pressed ? true : false;
  }
}

export function getControllerIsRealController(gamepad: Gamepad): boolean {
  if (gamepad.id.includes('Jabra')) {
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
  return (
    getPlayerPressedBothLR(player, game) || getPlayerPressedStart(player, game)
  );
}

export function getPlayerPressedStart(player: Player, game: Game): boolean {
  if (player.padCurr.start) {
    return true;
  }

  return false;
}
export function getPlayerPressedBothLR(player: Player, game: Game): boolean {
  if (player.padCurr.L && player.padCurr.R) {
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
    !player.padCurr.R &&
    !player.padCurr.L
  ) {
    return false;
  }
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
      !game.players[i].padCurr.R &&
      !game.players[i].padCurr.L
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
  if (player.state.name === 'player-state-hurt') {
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

export function updatePlayerHoldAttackEnergy(player: Player): void {
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

// export function playerReturnedAttackEnergy(player: Player): void {
//   if (!player.char.attackEnergy.followOnOffscreen) {
//     return;
//   }

//   player.char.attackEnergy.sprite.body.allowGravity = false;

//   // player.char.attackEnergy.sprite.body.setVelocityX(0);
//   // player.char.attackEnergy.sprite.body.setVelocityY(0);

//   if (player.char.sprite.flipX) {
//     player.char.attackEnergy.sprite.x =
//       player.char.sprite.x - player.char.attackEnergy.followOnOffscreenOffset.x;
//     player.char.attackEnergy.sprite.y =
//       player.char.sprite.y + player.char.attackEnergy.followOnOffscreenOffset.y;

//     player.char.attackEnergy.sprite.flipX = true;
//     player.char.attackEnergy.sprite.setRotation(
//       (player.char.attackEnergy.rotation.initial * Math.PI) / 2
//     );
//     player.char.attackEnergy.sprite.setAngularVelocity(0);
//   } else {
//     player.char.attackEnergy.sprite.x =
//       player.char.sprite.x + player.char.attackEnergy.followOnOffscreenOffset.x;
//     player.char.attackEnergy.sprite.y =
//       player.char.sprite.y + player.char.attackEnergy.followOnOffscreenOffset.y;

//     player.char.attackEnergy.sprite.flipX = false;
//     player.char.attackEnergy.sprite.setRotation(
//       player.char.attackEnergy.rotation.initial
//     );
//     player.char.attackEnergy.sprite.setAngularVelocity(0);
//   }
// }

export function playerShootAttackEnergy(player: Player, game: Game): void {
  var vX =
    player.char.sprite.body.velocity.x * player.char.attackEnergy.VEL.x * 0.5;

  var vY = 0;
  if (player.char.attackEnergy.allowVelocityY) {
    vY = 300 * player.char.attackEnergy.VEL.y;
    vY += player.char.sprite.body.velocity.y * 0.5;
  }

  if (
    player.char.attackEnergy.allowVelocityY &&
    player.char.attackEnergy.gravity
  ) {
    player.char.attackEnergy.sprite.body.allowGravity = true;
  }

  if (player.char.sprite.flipX) {
    player.char.attackEnergy.sprite.x =
      player.char.sprite.x - player.char.attackEnergy.posFromCenter.x;
    player.char.attackEnergy.sprite.y =
      player.char.sprite.y + player.char.attackEnergy.posFromCenter.y;

    player.char.attackEnergy.sprite.body.setVelocityX(
      -1 * game.BASE_PLAYER_ATTACKENERGY.x + vX
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
      game.BASE_PLAYER_ATTACKENERGY.x + vX
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

// export function updateBulletsFloat(game: Game): void {
//   game.players.forEach((player, playerIndex) => {
//     if (
//       player.char.attackEnergy.bullets !== null &&
//       player.char.attackEnergy.bullets.sprite !== null
//     ) {
//       player.char.attackEnergy.bullets.sprite.children.iterate(
//         (child: Phaser.Physics.Arcade.Sprite) => {
//           // @ts-ignore
//           // child.body.setVelocityY(child.body.velocity.y - 50);

//           child.body.velocity.y =
//             child.body.velocity.y - Math.random() * 200 + 60;
//           // child.body.velocity.y = child.body.velocity.y + child.floatVelocityY - Math.random() * 200 + 100;
//         }
//       );
//     }
//   });
// }

export function updateAttackEnergy(player: Player, game: Game): void {
  let ae = player.char.attackEnergy;
  let b = player.char.sprite.body;
  let s = player.char.sprite;
  if (
    game.debug.BulletsAllowGroups &&
    ae.attackBullets !== null &&
    ae.attackBullets.bullets !== null
  ) {
    // if (player.padCurr.X && !player.padPrev.X) {
    if (player.padCurr.X) {
      let ps = player.char.sprite;

      let pos: { x: number; y: number };
      if (s.flipX) {
        pos = { x: ps.x - ae.posFromCenter.x, y: ps.y + ae.posFromCenter.y };
      } else {
        pos = { x: ps.x + ae.posFromCenter.x, y: ps.y + ae.posFromCenter.y };
      }

      let vX = b.velocity.x * ae.VEL.x;

      let vY = 0;
      let vYRandom = Math.random() * 1000 - 250;
      vY = 300 * player.char.attackEnergy.VEL.y + vYRandom;
      vY += b.velocity.y * 0.5;
      vY = vY * 0.8;

      let velX: number = 0;
      let velY: number = 0;

      // y^2 == r^2 - x^2
      // y == sqrt(r^2 - x^2)
      vX = Math.sqrt(Math.pow(750, 2) - Math.pow(vY, 2));

      if (player.char.sprite.flipX) {
        velX = -1 * vX;
        velY = vY;
      } else {
        velX = vX;
        velY = vY;
      }
      let vel: { x: number; y: number } = { x: velX, y: velY };
      let firstFire = !player.padPrev.X;
      ae.attackBullets.bullets.fireBullet(pos, vel, player, firstFire, game);
      // ae.bullets.soundBullets.play();
    }
    return;
  }

  ////////////////////////////////////////////////
  //////////// NORMAL ATTACK ENERGY
  ////////////////////////////////////////////////

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
  // console.log('state', player.char.attackEnergy.state);

  // STATE HOLD
  if (
    player.padCurr.X &&
    getHasBeenGameDurationSinceMoment(
      player.char.attackEnergy.durationCooldown,
      player.char.attackEnergy.timestampThrow,
      game
    )
  ) {
    // console.log('holding');
    player.char.attackEnergy.state = 'holding';
    setPhysicsAttackEnergyOff(player);
    updatePlayerHoldAttackEnergy(player);
  } else if (
    !player.padCurr.X &&
    player.padPrev.X &&
    getHasBeenGameDurationSinceMoment(
      player.char.attackEnergy.durationCooldown,
      player.char.attackEnergy.timestampThrow,
      game
    )
  ) {
    // console.log('released');
    game.SOUND_GUN.play();
    player.char.attackEnergy.timestampThrow = game.gameNanoseconds;
    player.char.attackEnergy.state = 'released';
    setPhysicsAttackEnergyOn(player);
    playerShootAttackEnergy(player, game);
  }

  // STATE RETURNED
  // if (
  //   !player.char.attackEnergy.offscreenCurr &&
  //   player.char.attackEnergy.offscreenPrev &&
  //   game.gameNanoseconds >
  //     player.char.attackEnergy.timestampThrow +
  //       player.char.attackEnergy.durationCooldown
  // ) {
  //   player.char.attackEnergy.state = 'returned';
  //   setPhysicsAttackEnergyOff(player);
  //   // playerReturnedAttackEnergy(player);
  // }
}

export function isSpriteOffscreen(
  sprite: Phaser.GameObjects.Sprite,
  game: Game
): boolean {
  if (
    sprite.x > SCREEN_DIMENSIONS.WIDTH ||
    sprite.x < 0 ||
    sprite.y > SCREEN_DIMENSIONS.HEIGHT ||
    sprite.y < 0
  ) {
    return true;
  }
  return false;
}

export function updatePadPreviousAndDebounced(game: Game): void {
  game.players.forEach((player) => {
    let c = player.padCurr;
    let p = player.padPrev;
    let d = player.padDebounced;
    let k = game.GAMEPAD_DEBOUNCE_NUMBER_CYCLES;

    if (c.up !== p.up) {
      console.log('c.up', c.up, 'p.up', p.up);
    }
    p.up = c.up;
    p.down = c.down;
    p.left = c.left;
    p.right = c.right;
    p.A = c.A;
    p.B = c.B;
    p.X = c.X;
    p.Y = c.Y;
    p.start = c.start;
    p.select = c.select;

    // player.char.sprite.zoom = 1;

    if (c.up) {
      d.up += d.up >= k ? 0 : 1;
    } else {
      d.up += d.up <= 0 ? 0 : -1;
    }
    if (c.down) {
      d.down += d.down >= k ? 0 : 1;
    } else {
      d.down += d.down <= 0 ? 0 : -1;
    }
    if (c.left) {
      d.left += d.left >= k ? 0 : 1;
    } else {
      d.left += d.left <= 0 ? 0 : -1;
    }
    if (c.right) {
      d.right += d.right >= k ? 0 : 1;
    } else {
      d.right += d.right <= 0 ? 0 : -1;
    }

    if (c.A) {
      d.A += d.A >= k ? 0 : 1;
    } else {
      d.A += d.A <= 0 ? 0 : -1;
    }
    if (c.B) {
      d.B += d.B >= k ? 0 : 1;
    } else {
      d.B += d.B <= 0 ? 0 : -1;
    }
    if (c.X) {
      d.X += d.X >= k ? 0 : 1;
    } else {
      d.X += d.X <= 0 ? 0 : -1;
    }
    if (c.Y) {
      d.Y += d.Y >= k ? 0 : 1;
    } else {
      d.Y += d.Y <= 0 ? 0 : -1;
    }

    if (c.start) {
      d.start += d.start >= k ? 0 : 1;
    } else {
      d.start += d.start <= 0 ? 0 : -1;
    }
    if (c.select) {
      d.select += d.select >= k ? 0 : 1;
    } else {
      d.select += d.select <= 0 ? 0 : -1;
    }
  });
}

export function debugUpdateControllersPrintConnected(game: Game): void {
  if (!game.debug.ConsoleLogConnected) {
    return;
  }
  game.players.forEach((player, playerIndex) => {
    console.log('PLAYER', playerIndex, 'CONTROLLER', player?.gamepad);
    console.log('PLAYER', playerIndex, 'CONTROLLER', player?.gamepad.id);
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

    if (player.emitterPlayer.on) {
      return;
    }

    if (player.padCurr.up) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          -game.BASE_PLAYER_SPEED.y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
    }
    if (player.padCurr.down) {
      player.char.sprite.body.setVelocityY(
        player.char.sprite.body.velocity.y +
          game.BASE_PLAYER_SPEED.y *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
    }
    if (player.padCurr.left) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          game.RATIO_ACCELERATION_VELOCITY *
          Math.pow(1 - player.char.friction_air, 3) +
          -game.BASE_PLAYER_SPEED.x *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
    }
    if (player.padCurr.right) {
      player.char.sprite.body.setVelocityX(
        player.char.sprite.body.velocity.x *
          game.RATIO_ACCELERATION_VELOCITY *
          Math.pow(1 - player.char.friction_air, 3) +
          game.BASE_PLAYER_SPEED.x *
            player.char.speed *
            player.char.fast *
            (1 - game.RATIO_ACCELERATION_VELOCITY)
      );
    }
  }
}

export function debugUpdatePrintAllControllerButtonsWhenActive(
  game: Game
): void {
  if (!game.debug.ConsoleLogButtons) {
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
        console.log(player.playerId, 'B');
      }
      if (player.padCurr.A) {
        console.log(player.playerId, 'A');
      }
      if (player.padCurr.X) {
        console.log(player.playerId, 'X');
      }
      if (player.padCurr.Y) {
        console.log(player.playerId, 'Y');
        // player.char.fast = 2;
      }

      //  D Pad
      if (player.padCurr.down) {
        console.log(player.playerId, 'down');
      }
      if (player.padCurr.up) {
        console.log(player.playerId, 'up');
      }
      if (player.padCurr.left) {
        console.log(player.playerId, 'left');
      }
      if (player.padCurr.right) {
        console.log(player.playerId, 'right');
      }

      // L R Buttons
      if (player.padCurr.L) {
        console.log(player.playerId, 'L');
      }
      if (player.padCurr.R) {
        console.log(player.playerId, 'R');
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
      //   console.log(player.playerId, "L");
      // }
      // if (player.gamepad.R1) {
      //   console.log(player.playerId, "R");
      // }
      // // L R Buttons
      // if (player.gamepad.L12) {
      //   console.log(player.playerId, "L2");
      // }
      // if (player.gamepad.R12) {
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
