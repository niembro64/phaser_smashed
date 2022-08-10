import { Gravity } from "matter";
import Game from "./Game";
import { Player } from "./interfaces";

export function updateMovements(game: Game): void {}

export function updatePositionData(player: Player): void {
    // if (player.char.sprite.body.touching.down) {
    //     console.log("TOUCHING");
    //     player.char.pos.x = player.char.pos.x + player.char.vel.x;
    //     player.char.vel.y = 0;
    //     return;
    // }
    if (player.char.pos.y > 300) {
        console.log("TOUCHING");
        player.char.pos.x = player.char.pos.x + player.char.vel.x;
        player.char.vel.y = 0;
        return;
    }
    player.char.pos.y = player.char.pos.y + player.char.vel.y;
}
export function updateSpriteVelocity(player: Player, game: Game): void {
    player.char.sprite.setVelocityX(player.char.vel.x);
    player.char.sprite.setVelocityY(player.char.vel.y + game.GRAVITY);
}

export function addGravity(player: Player, game: Game): void {
    player.char.vel.y += game.GRAVITY;
}

export function addKeyboard(player: Player, game: Game): void {
    // CHECK ANGLED
    if (player.keyboard.left.isDown && player.keyboard.up.isDown) {
        console.log("LEFT UP");
        player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.keyboard.right.isDown && player.keyboard.up.isDown) {
        player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.keyboard.left.isDown && player.keyboard.down.isDown) {
        player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.keyboard.right.isDown && player.keyboard.down.isDown) {
        player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }

    // CHECK OPPOSING COUNTERS
    if (player.keyboard.left.isDown && player.keyboard.right.isDown) {
        player.char.vel.x = 0;
        player.char.vel.y = 0;
        return;
    }
    if (player.keyboard.up.isDown && player.keyboard.down.isDown) {
        player.char.vel.x = 0;
        player.char.vel.y = 0;
        return;
    }
    // CHECK INDIVIDUALS
    if (player.keyboard.up.isDown) {
        player.char.vel.x = 0;
        player.char.vel.y = -game.DEFAULT_SPEED;
        return;
    }
    if (player.keyboard.down.isDown) {
        player.char.vel.x = 0;
        player.char.vel.y = game.DEFAULT_SPEED;
        return;
    }
    if (player.keyboard.left.isDown) {
        player.char.vel.y += 0;
        player.char.vel.x = -game.DEFAULT_SPEED;
        return;
    }
    if (player.keyboard.right.isDown) {
        player.char.vel.y += 0;
        player.char.vel.x = game.DEFAULT_SPEED;
        return;
    }

    // CHECK NONE
    if (!player.keyboard.left.isDown && !player.keyboard.right.isDown) {
        player.char.vel.x = 0;
        // player.char.vel.y = 0;
    }
    if (!player.keyboard.up.isDown && !player.keyboard.down.isDown) {
        player.char.vel.x = 0;
        // player.char.vel.y = 0;
        player.char.vel.y += game.GRAVITY;
    }

    return;
}
export function addPad(player: Player, game: Game): void {
    // CHECK ANGLED
    if (player.pad.left && player.pad.up) {
        console.log("LEFT UP");
        player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.pad.right && player.pad.up) {
        player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.pad.left && player.pad.down) {
        player.char.vel.x = -game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (player.pad.right && player.pad.down) {
        player.char.vel.x = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        player.char.vel.y = game.DEFAULT_SPEED * game.RATIO_ANGLED_MOVEMENT;
        return;
    }

    // CHECK OPPOSING COUNTERS
    if (player.pad.left && player.pad.right) {
        player.char.vel.x = 0;
        player.char.vel.y = 0;
        return;
    }
    if (player.pad.up && player.pad.down) {
        player.char.vel.x = 0;
        player.char.vel.y = 0;
        return;
    }
    // CHECK INDIVIDUALS
    if (player.pad.up) {
        player.char.vel.x = 0;
        player.char.vel.y = -game.DEFAULT_SPEED;
        return;
    }
    if (player.pad.down) {
        player.char.vel.x = 0;
        player.char.vel.y = game.DEFAULT_SPEED;
        return;
    }
    if (player.pad.left) {
        player.char.vel.y += 0;
        player.char.vel.x = -game.DEFAULT_SPEED;
        return;
    }
    if (player.pad.right) {
        player.char.vel.y += 0;
        player.char.vel.x = game.DEFAULT_SPEED;
        return;
    }

    // CHECK NONE
    if (!player.pad.left && !player.pad.right) {
        player.char.vel.x = 0;
        // player.char.vel.y = 0;
    }
    if (!player.pad.up && !player.pad.down) {
        player.char.vel.x = 0;
        // player.char.vel.y = 0;
        player.char.vel.y += game.GRAVITY;
    }

    return;
}

export function updateKeepOnScreen(player: Player, game: Game): void {
    if (player.char.pos.y < 0) {
        player.char.pos.y = game.SCREEN_DIMENSIONS.HEIGHT;
    }
    if (player.char.pos.y > game.SCREEN_DIMENSIONS.HEIGHT) {
        player.char.pos.y = 0;
    }
    if (player.char.pos.x < 0) {
        player.char.pos.x = game.SCREEN_DIMENSIONS.WIDTH;
    }
    if (player.char.pos.x > game.SCREEN_DIMENSIONS.WIDTH) {
        player.char.pos.x = 0;
    }
}

export function charsCollide(game: Game): void {
    game.players.forEach((player, playerIndex) => {
        game.players.forEach((p, pj) => {
            if (pj !== playerIndex) {
                game.physics.add.collider(player.char.sprite, p.char.sprite);
            }
        });
    });
}
