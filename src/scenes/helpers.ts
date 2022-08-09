import { Gravity } from "matter";
import { Char, Player, Keyboard_Static } from "./Game";
import Game from "./Game";

export function updateMovements(game: Game): void {}

export function setState(
    player: Player,
    state: "start" | "dead" | "air" | "ground" | "wall" | "x"
): void {
    player.state = state;
}

export function updatePositionData(player: Player): void {
    // if (p.char.sprite.body.touching.down) {
    //     console.log("TOUCHING");
    //     p.char.pos.x = p.char.pos.x + p.char.vel.x;
    //     p.char.vel.y = 0;
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
export function updatePositionSprite(player: Player): void {
    player.char.sprite.x = player.char.pos.x;
    player.char.sprite.y = player.char.pos.y;
}

export function updateKeyboard(player: Player, game: Game): void {
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

    // CHECK COUNTERS
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
        player.char.vel.y += game.GRAVITY;
        player.char.vel.x = -game.DEFAULT_SPEED;
        return;
    }
    if (player.keyboard.right.isDown) {
        player.char.vel.y += game.GRAVITY;
        player.char.vel.x = game.DEFAULT_SPEED;
        return;
    }

    // CHECK NONE
    if (!player.keyboard.left.isDown && !player.keyboard.right.isDown) {
        // p.char.vel.x = 0;
        // p.char.vel.y = 0;
    }
    if (!player.keyboard.up.isDown && !player.keyboard.down.isDown) {
        // p.char.vel.x = 0;
        // p.char.vel.y = 0;
        player.char.vel.y += game.GRAVITY;
    }

    return;
}

export function updateKeepOnScreen(player: Player, game: Game): void {
    if (player.char.pos.y < 0) {
        player.char.pos.y = game.SCREEN.HEIGHT;
    }
    if (player.char.pos.y > game.SCREEN.HEIGHT) {
        player.char.pos.y = 0;
    }
    if (player.char.pos.x < 0) {
        player.char.pos.x = game.SCREEN.WIDTH;
    }
    if (player.char.pos.x > game.SCREEN.WIDTH) {
        player.char.pos.x = 0;
    }
}
