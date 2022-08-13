import Game from './Game';
import { Location, Player } from './interfaces';

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
        player.char.lastDirectionTouched = 'up';
    }
    if (player.char.sprite.body.touching.down) {
        player.char.lastDirectionTouched = 'down';
    }
    if (player.char.sprite.body.touching.left) {
        player.char.lastDirectionTouched = 'left';
    }
    if (player.char.sprite.body.touching.right) {
        player.char.lastDirectionTouched = 'right';
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
            player.char.wallTouchArray[game.allPlayersWallTouchIterator] =
                false;
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
            'JUMP',
            'player.index:',
            player.index,
            'jumpIndex',
            player.char.jumpIndex,
            'jumps[i]',
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
            player.char.lastDirectionTouched === 'left' &&
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
            player.char.lastDirectionTouched === 'right' &&
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

export function setCamera(game: Game): void {
    let i_10: number = getCenterIterator10(game);
    let x_10: number = 0;
    let y_10: number = 0;
    let zoom_10: number = 1;
    let i_80: number = getCenterIterator80(game);
    let x_80: number = 0;
    let y_80: number = 0;
    let zoom_80: number = 1;

    game.center_10.locations[i_10] = getCurrentCamera(game);
    game.center_80.locations[i_80] = getCurrentCamera(game);

    for (let j = 0; j < game.center_10.locations.length; j++) {
        x_10 += game.center_10.locations[j].x;
        y_10 += game.center_10.locations[j].y;
        zoom_10 += game.center_10.locations[j].zoom;
    }
    for (let j = 0; j < game.center_80.locations.length; j++) {
        x_80 += game.center_80.locations[j].x;
        y_80 += game.center_80.locations[j].y;
        zoom_80 += game.center_80.locations[j].zoom;
    }

    game.center_10.helper.x = x_10 / game.center_10.locations.length;
    game.center_10.helper.y = y_10 / game.center_10.locations.length;

    game.center_80.helper.x = x_80 / game.center_80.locations.length;
    game.center_80.helper.y = y_80 / game.center_80.locations.length;

    if (zoom_10 > zoom_80) {
        game.cameras.main.zoom = zoom_80 / game.center_10.locations.length;
    } else {
        game.cameras.main.zoom = zoom_10 / game.center_10.locations.length;
    }

    // game.cameras.main.setRotation(0);
    // game.cameras.main.setBackgroundColor("#ffffff");
    // game.cameras.main.setBounds(
    //     0,
    //     0,
    //     game.SCREEN_DIMENSIONS.WIDTH,
    //     game.SCREEN_DIMENSIONS.HEIGHT
    // );
    // game.cameras.main.zoom =
    //   game.center.helper.zoom > game.center.locations[i].zoom
    //     ? game.center.helper.zoom
    //     : game.center.locations[i].zoom;
}

export function getCameraZoomCurrent10(game: Game): number {
    let curr_x = 0;
    let curr_y = 0;

    game.players.forEach((player, playerIndex) => {
        if (Math.abs(player.char.sprite.x - game.center_10.helper.x) > curr_x) {
            curr_x = Math.abs(player.char.sprite.x - game.center_10.helper.x);
        }
    });
    game.players.forEach((player, playerIndex) => {
        if (Math.abs(player.char.sprite.y - game.center_10.helper.y) > curr_y) {
            curr_y = Math.abs(player.char.sprite.y - game.center_10.helper.y);
        }
    });

    let return_x = 1 / ((curr_x * 2) / game.SCREEN_DIMENSIONS.WIDTH);
    let return_y = 1 / ((curr_y * 2) / game.SCREEN_DIMENSIONS.HEIGHT);

    let r = Math.min(return_x, return_y) * 0.5;

    r = Math.max(r, 1);
    r = Math.min(r, 2);

    // return 1;
    // return r < 1 ? 1 : r;
    return r;
}
export function getCameraZoomCurrent80(game: Game): number {
    let curr_x = 0;
    let curr_y = 0;

    game.players.forEach((player, playerIndex) => {
        if (Math.abs(player.char.sprite.x - game.center_80.helper.x) > curr_x) {
            curr_x = Math.abs(player.char.sprite.x - game.center_80.helper.x);
        }
    });
    game.players.forEach((player, playerIndex) => {
        if (Math.abs(player.char.sprite.y - game.center_80.helper.y) > curr_y) {
            curr_y = Math.abs(player.char.sprite.y - game.center_80.helper.y);
        }
    });

    let return_x = 1 / ((curr_x * 2) / game.SCREEN_DIMENSIONS.WIDTH);
    let return_y = 1 / ((curr_y * 2) / game.SCREEN_DIMENSIONS.HEIGHT);

    let r = Math.min(return_x, return_y) * 0.5;

    r = Math.max(r, 1);
    r = Math.min(r, 2);

    // return 1;
    // return r < 1 ? 1 : r;
    return r;
}

export function getCenterIterator10(game: Game): number {
    if (
        game.center_10.locationsIterator + 1 ===
        game.center_10.locations.length
    ) {
        game.center_10.locationsIterator = 0;
    } else {
        game.center_10.locationsIterator++;
    }
    return game.center_10.locationsIterator;
}
export function getCenterIterator80(game: Game): number {
    if (
        game.center_80.locationsIterator + 1 ===
        game.center_80.locations.length
    ) {
        game.center_80.locationsIterator = 0;
    } else {
        game.center_80.locationsIterator++;
    }
    return game.center_80.locationsIterator;
}

export function getCurrentCamera(game: Game): Location {
    var x_low: number = Infinity;
    var x_high: number = 0;
    var y_low: number = Infinity;
    var y_high: number = 0;

    game.players.forEach((player, playerIndex) => {
        x_low = player.char.sprite.x > x_low ? x_low : player.char.sprite.x;
        x_high = player.char.sprite.x < x_high ? x_high : player.char.sprite.x;
        y_low = player.char.sprite.y > y_low ? y_low : player.char.sprite.y;
        y_high = player.char.sprite.y < y_high ? y_high : player.char.sprite.y;
    });

    // game.center.helper.x = x / game.players.length;
    // game.center.helper.y = y / game.players.length;

    var z_10 = getCameraZoomCurrent10(game);
    var z_80 = getCameraZoomCurrent80(game);

    return {
        // x: x_low / game.players.length,
        // y: y_low / game.players.length,
        x: (x_low + x_high) / 2,
        y: (y_low + y_high) / 2,
        zoom: z_10 > z_80 ? z_80 : z_10,
    };
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
