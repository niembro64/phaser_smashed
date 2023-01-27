import Game, { SCREEN_DIMENSIONS } from '../Game';
import { Player } from '../interfaces';
import { getIsAttackEnergyOffscreen } from './attacks';
import { getIsBot } from './bot';
import { getNormalizedVector } from './damage';

export function updateCirclesLocations(game: Game): void {
  if (!game.debug.PlayerIdVisible) {
    return;
  }

  game.colorCircles.forEach((circle, circleIndex) => {
    if (circleIndex < game.players.length) {
      // circle.graphic.x = game.players[circleIndex].char.sprite.x;
      // circle.graphic.y =
      //   game.players[circleIndex].char.sprite.y - game.circleOffset;

      circle.graphic.setRadius((1 / game.cameras.main.zoom) * 10);
      circle.graphic.setPosition(
        game.players[circleIndex].char.sprite.x,
        game.players[circleIndex].char.sprite.y +
          game.circleOffset +
          game.players[circleIndex].circleOffset
      );
    }
  });
}

export function updateTable(game: Game): void {
  if (game.TABLE.body.touching.down) {
    game.TABLE.body.setVelocityX(game.TABLE.body.velocity.x * 0.95);
  }
  // game.TABLE.velocityY = 0;
}

export function updateAttackEnergyWrapScreen(game: Game): void {
  if (!game.debug.AEWrapScreen) {
    return;
  }
  game.players.forEach((player) => {
    if (player.char.attackEnergy.sprite.x < 0) {
      player.char.attackEnergy.sprite.x = SCREEN_DIMENSIONS.WIDTH;
    }
    if (player.char.attackEnergy.sprite.x > SCREEN_DIMENSIONS.WIDTH) {
      player.char.attackEnergy.sprite.x = 0;
    }
  });
}

export function updateKeepOnScreenPlayer(game: Game): void {
  game.players.forEach((player) => {
    if (player.char.sprite.y < 0) {
      player.char.sprite.y = SCREEN_DIMENSIONS.HEIGHT;
    }
    if (player.char.sprite.y > SCREEN_DIMENSIONS.HEIGHT) {
      player.char.sprite.y = 0;
    }
    if (player.char.sprite.x < 0) {
      player.char.sprite.x = SCREEN_DIMENSIONS.WIDTH;
    }
    if (player.char.sprite.x > SCREEN_DIMENSIONS.WIDTH) {
      player.char.sprite.x = 0;
    }
  });
}
export function isAnyPlayerOffscreen(game: Game): boolean {
  for (let i = 0; i < game.players.length; i++) {
    if (getIsPlayerOffscreen(game.players[i], game)) {
      return true;
    }
  }
  return false;
}
export function getIsPlayerOffscreen(player: Player, game: Game): boolean {
  if (
    player.char.sprite.y < 0 ||
    player.char.sprite.y > SCREEN_DIMENSIONS.HEIGHT ||
    player.char.sprite.x < 0 ||
    player.char.sprite.x > SCREEN_DIMENSIONS.WIDTH
  ) {
    return true;
  }
  return false;
}

export function setRespawn(player: Player, game: Game): void {
  player.char.sprite.x =
    SCREEN_DIMENSIONS.WIDTH / 2 + player.char.initializeCharPosition.x;
  player.char.sprite.y = player.char.initializeCharPosition.y;

  player.char.sprite.body.setVelocityX(0);
  player.char.sprite.body.setVelocityY(0);
}

// export function updateEnergyAttacksScreenWrap(game: Game): void {
//   game.players.forEach((player, playerIndex) => {
//     if (player.char.attackEnergy.sprite.y > SCREEN_DIMENSIONS.HEIGHT) {
//       // player.char.attackEnergy.sprite.body.setVelocityX(0);
//       // player.char.attackEnergy.sprite.body.setVelocityY(0);
//       player.char.attackEnergy.sprite.x = SCREEN_DIMENSIONS.WIDTH / 2;
//       player.char.attackEnergy.sprite.Y = SCREEN_DIMENSIONS.HEIGHT / 2;
//       player.char.attackEnergy.sprite.body.allowGravity = false;
//     }
//   });
// }

export function updateLastDirectionTouched(player: Player): void {
  if (player.char.sprite.body.touching.up) {
    player.char.lastDirectionTouched = 'up';
  } else if (player.char.sprite.body.touching.down) {
    player.char.lastDirectionTouched = 'down';
  } else if (player.char.sprite.body.touching.left) {
    player.char.lastDirectionTouched = 'left';
  } else if (player.char.sprite.body.touching.right) {
    player.char.lastDirectionTouched = 'right';
  }
}

export function updateWallTouchArray(game: Game): void {
  game.players.forEach((player) => {
    let t = player.char.sprite.body.touching;
    let i = game.allPlayersWallTouchIterator;
    let w = player.char.wallTouchArray;

    if (!t.down && (t.left || t.right)) {
      w[i] = true;
    } else {
      w[i] = false;
    }
  });

  game.allPlayersWallTouchIterator =
    (game.allPlayersWallTouchIterator + 1) %
    game.players[0].char.wallTouchArray.length;
}

export function hasPlayerTouchedWallRecently(player: Player): boolean {
  return !player.char.wallTouchArray.every((b) => b === false);
}

export function updateJumpPhysicalOnWall(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.down ||
    player.char.sprite.body.touching.left ||
    player.char.sprite.body.touching.right
  ) {
    player.char.jumpIndex = 0;
  }
}

export function updateJumpPhysical(player: Player, game: Game): void {
  if (player.padCurr.Y && !player.padPrev.Y) {
    if (
      !player.char.sprite.body.touching.down &&
      !player.char.sprite.body.touching.left &&
      !player.char.sprite.body.touching.right &&
      !hasPlayerTouchedWallRecently(player) &&
      player.char.jumpIndex < 1
    ) {
      player.char.jumpIndex = 1;
    }

    if (player.char.jumpIndex !== player.char.jumps.length - 1) {
      game.SOUND_JUMP_PHYSICAL.volume =
        player.char.jumps[player.char.jumpIndex];
      game.SOUND_JUMP_PHYSICAL.play();
    }

    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y *
        (1 - player.char.jumps[player.char.jumpIndex]) +
        game.BASE_PLAYER_JUMP_PHYSICAL *
          player.char.jumpPower *
          player.char.jumps[player.char.jumpIndex]
    );

    player.char.jumpIndex +=
      player.char.jumpIndex === player.char.jumps.length - 1 ? 0 : 1;

    // // horizontal stuff WAS TOUCHING
    if (
      game.debug.WallJumpsActive &&
      player.char.lastDirectionTouched === 'left' &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        game.BASE_PLAYER_JUMP_WALL *
          player.char.speed *
          (player.padCurr.left ? 2 : 1)
      );
      return;
    }

    if (
      game.debug.WallJumpsActive &&
      player.char.lastDirectionTouched === 'right' &&
      hasPlayerTouchedWallRecently(player)
    ) {
      player.char.sprite.body.setVelocityX(
        -game.BASE_PLAYER_JUMP_WALL *
          player.char.speed *
          (player.padCurr.right ? 2 : 1)
      );
      return;
    }
  }
}

export function updateJumpFloat(player: Player, game: Game): void {
  if (player.emitterPlayer.on) {
    return;
  }
  if (player.padCurr.Y && player.padPrev.Y) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y +
        -game.BASE_PLAYER_SPEED.y *
          player.char.speed *
          player.char.fast *
          player.char.jumpFloat
    );
  }
}

export function updateFrictionWallY(player: Player, game: Game): void {
  if (!game.debug.WallJumpsActive) {
    return;
  }

  if (player.char.sprite.body.velocity.y < 0) {
    return;
  }
  if (
    (player.padCurr.left && player.char.sprite.body.touching.left) ||
    (player.padCurr.right && player.char.sprite.body.touching.right)
  ) {
    player.char.sprite.body.setVelocityY(0);
  }
}

export function updateFrictionAirY(player: Player, game: Game): void {
  if (!game.debug.FrictionAirActive) {
    return;
  }

  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityY(
      player.char.sprite.body.velocity.y * (1 - player.char.friction_air)
    );
  }
}

export function updateFrictionAirX(player: Player, game: Game): void {
  if (!game.debug.FrictionAirActive) {
    return;
  }

  if (!player.char.sprite.body.touching.down) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * (1 - player.char.friction_air)
    );
  }
}

export function updateFrictionGroundX(player: Player, game: Game): void {
  if (
    player.char.sprite.body.touching.down &&
    !player.padCurr.left &&
    !player.padCurr.right
  ) {
    player.char.sprite.body.setVelocityX(
      player.char.sprite.body.velocity.x * (1 - player.char.friction_ground)
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
    hitbacky * game.BASE_PLAYER_HITBACK.y +
      ((hitbacky > 0 ? 1 : -1) *
        (game.BASE_PLAYER_HITBACK.y * player.char.damage)) /
        5
  );
  player.char.sprite.body.setVelocityX(
    hitbackx * game.BASE_PLAYER_HITBACK.x +
      ((hitbackx > 0 ? 1 : -1) *
        (game.BASE_PLAYER_HITBACK.x * player.char.damage)) /
        5
  );
}

export function setGravityTrue(player: Player): void {
  player.char.sprite.body.allowGravity = true;
}

export function setGravityFalse(player: Player): void {
  player.char.sprite.body.allowGravity = false;
}

export function updateKeepObjectsFromFallingLikeCrazy(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    if (player.char.attackEnergy.sprite.y > SCREEN_DIMENSIONS.HEIGHT) {
      player.char.attackEnergy.sprite.y = SCREEN_DIMENSIONS.HEIGHT + 200;
      player.char.attackEnergy.sprite.body.setVelocityY(0);
      player.char.attackEnergy.sprite.body.setVelocityX(0);
    }
  });
}

export function updateAttackEnergyFollow(game: Game): void {
  game.players.forEach((player, playerIndex) => {
    let ae = player.char.attackEnergy;
    if (!getIsAttackEnergyOffscreen(ae, game)) {
      if (
        ae.findAndFollowAcceleration.x !== 0 &&
        ae.findAndFollowAcceleration.y === 0
      ) {
        let goHere: { x: number; y: number } = getNearestPlayerAliveXY(
          player,
          playerIndex,
          game
        );

        if (goHere.x !== Infinity) {
          ae.sprite.body.setVelocityX(
            ae.sprite.body.velocity.x * 0.98 +
              (goHere.x < ae.sprite.x ? -1 : 1) *
                100 *
                ae.findAndFollowAcceleration.x
          );
        }
      } else if (
        ae.findAndFollowAcceleration.x !== 0 &&
        ae.findAndFollowAcceleration.y !== 0
      ) {
        let goHere: { x: number; y: number } = getNearestPlayerAliveXY(
          player,
          playerIndex,
          game
        );

        if (goHere.x !== Infinity && goHere.y !== Infinity) {
          let goHereMultiplier: { x: number; y: number } = getNormalizedVector(
            ae.sprite.x,
            ae.sprite.y,
            goHere.x,
            goHere.y
          );
          ae.sprite.body.setVelocityX(
            ae.sprite.body.velocity.x * 0.98 +
              goHereMultiplier.x * 100 * ae.findAndFollowAcceleration.x
          );
          ae.sprite.body.setVelocityY(
            ae.sprite.body.velocity.y * 0.98 +
              goHereMultiplier.y * 100 * ae.findAndFollowAcceleration.y
          );
        }
      }
    }
  });
}

export function getNearestPlayerX(
  player: Player,
  pIndex: number,
  game: Game
): number {
  let goToX = Infinity;
  let myX = player.char.attackEnergy.sprite.x;
  let diffX = Math.abs(goToX - myX);
  game.players.forEach((player, playerIndex) => {
    if (pIndex !== playerIndex) {
      let otherPlayerX = player.char.sprite.x;
      let newDiffX = Math.abs(otherPlayerX - myX);
      if (newDiffX < diffX) {
        goToX = otherPlayerX;
        diffX = newDiffX;
      }
    }
  });
  return goToX;
}

export function getNearestPlayerY(
  player: Player,
  pIndex: number,
  game: Game
): number {
  let goToY = Infinity;
  let myY = player.char.attackEnergy.sprite.y;
  let diffY = Math.abs(goToY - myY);
  game.players.forEach((player, playerIndex) => {
    if (pIndex !== playerIndex) {
      let otherPlayerY = player.char.sprite.y;
      let newDiffY = Math.abs(otherPlayerY - myY);
      if (newDiffY < diffY) {
        goToY = otherPlayerY;
        diffY = newDiffY;
      }
    }
  });
  return goToY;
}

export function getNearestPlayerAliveXY(
  player: Player,
  pIndex: number,
  game: Game
): { x: number; y: number } {
  let goToX = Infinity;
  let goToY = Infinity;
  let ae = player.char.attackEnergy;

  game.players.forEach((player, playerIndex) => {
    if (pIndex !== playerIndex && player.state.name === 'player-state-alive') {
      let otherPlayerX = player.char.sprite.x;
      let otherPlayerY = player.char.sprite.y;
      let myX = ae.sprite.x;
      let myY = ae.sprite.y;
      if (
        getDistance(myX, myY, otherPlayerX, otherPlayerY) <
        getDistance(myX, myY, goToX, goToY)
      ) {
        goToX = otherPlayerX;
        goToY = otherPlayerY;
      }
    }
  });

  if (goToX === Infinity) {
    goToX = SCREEN_DIMENSIONS.WIDTH / 2;
  }
  if (goToY === Infinity) {
    goToY = SCREEN_DIMENSIONS.HEIGHT / 2;
  }

  return { x: goToX, y: goToY };
}

export function getDistance(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): number {
  return Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
}

export function updateAttackEnergyFlipXVel(game: Game): void {
  for (let i = 0; i < game.players.length; i++) {
    let ae = game.players[i].char.attackEnergy;
    // console.log(ae.accX);
    if (ae.sprite.body.velocity.x > 0) {
      ae.sprite.flipX = false;
    }
    if (ae.sprite.body.velocity.x < 0) {
      ae.sprite.flipX = true;
    }
  }
}
export function updateAttackEnergyFlipXAcc(game: Game): void {
  for (let i = 0; i < game.players.length; i++) {
    let ae = game.players[i].char.attackEnergy;
    // console.log(ae.accX);
    if (ae.accX > 0) {
      ae.sprite.flipX = false;
    }
    if (ae.accX < 0) {
      ae.sprite.flipX = true;
    }
  }
}

export function updateAttackEnergyVelPrev(game: Game): void {
  for (let i = 0; i < game.players.length; i++) {
    game.players[i].char.attackEnergy.accX =
      game.players[i].char.attackEnergy.sprite.body.velocity.x -
      game.players[i].char.attackEnergy.velPrevX;
    game.players[i].char.attackEnergy.accY =
      game.players[i].char.attackEnergy.sprite.body.velocity.y -
      game.players[i].char.attackEnergy.velPrevY;

    game.players[i].char.attackEnergy.velPrevX =
      game.players[i].char.attackEnergy.sprite.body.velocity.x;
    game.players[i].char.attackEnergy.velPrevY =
      game.players[i].char.attackEnergy.sprite.body.velocity.y;
  }
  // console.log(game.players[0].char.attackEnergy.accX);
}
