import { Gravity } from "matter";
import { Char, Player, Keyboard_Static } from "./Game";
import Game from "./Game";

export function updateMovements(g: Game): void {
    g.players.forEach((p) => {
        updateKeyboard(p, g);
        updateKeepOnScreen(p, g);
        updatePositionData(p);
        updatePositionSprite(p);
    });
    // console.log(g.players[0].char.pos);
}
export function updatePositionData(p: Player): void {
    // if (p.char.sprite.body.touching.down) {
    //     console.log("TOUCHING");
    //     p.char.pos.x = p.char.pos.x + p.char.vel.x;
    //     p.char.vel.y = 0;
    //     return;
    // }
    if (p.char.pos.y > 300) {
        console.log("TOUCHING");
        p.char.pos.x = p.char.pos.x + p.char.vel.x;
        p.char.vel.y = 0;
        return;
    }
    p.char.pos.y = p.char.pos.y + p.char.vel.y;
}
export function updatePositionSprite(p: Player): void {
    p.char.sprite.x = p.char.pos.x;
    p.char.sprite.y = p.char.pos.y;
}

export function updateKeyboard(p: Player, g: Game): void {
    // CHECK ANGLED
    if (p.keyboard.left.isDown && p.keyboard.up.isDown) {
        console.log("LEFT UP");
        p.char.vel.x = -g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        p.char.vel.y = -g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (p.keyboard.right.isDown && p.keyboard.up.isDown) {
        p.char.vel.x = g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        p.char.vel.y = -g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (p.keyboard.left.isDown && p.keyboard.down.isDown) {
        p.char.vel.x = -g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        p.char.vel.y = g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        return;
    }
    if (p.keyboard.right.isDown && p.keyboard.down.isDown) {
        p.char.vel.x = g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        p.char.vel.y = g.DEFAULT_SPEED * g.RATIO_ANGLED_MOVEMENT;
        return;
    }

    // CHECK COUNTERS
    if (p.keyboard.left.isDown && p.keyboard.right.isDown) {
        p.char.vel.x = 0;
        p.char.vel.y = 0;
        return;
    }
    if (p.keyboard.up.isDown && p.keyboard.down.isDown) {
        p.char.vel.x = 0;
        p.char.vel.y = 0;
        return;
    }
    // CHECK INDIVIDUALS
    if (p.keyboard.up.isDown) {
        p.char.vel.x = 0;
        p.char.vel.y = -g.DEFAULT_SPEED;
        return;
    }
    if (p.keyboard.down.isDown) {
        p.char.vel.x = 0;
        p.char.vel.y = g.DEFAULT_SPEED;
        return;
    }
    if (p.keyboard.left.isDown) {
        p.char.vel.y += g.GRAVITY;
        p.char.vel.x = -g.DEFAULT_SPEED;
        return;
    }
    if (p.keyboard.right.isDown) {
        p.char.vel.y += g.GRAVITY;
        p.char.vel.x = g.DEFAULT_SPEED;
        return;
    }

    // CHECK NONE
    if (!p.keyboard.left.isDown && !p.keyboard.right.isDown) {
        // p.char.vel.x = 0;
        // p.char.vel.y = 0;
    }
    if (!p.keyboard.up.isDown && !p.keyboard.down.isDown) {
        // p.char.vel.x = 0;
        // p.char.vel.y = 0;
        p.char.vel.y += g.GRAVITY;
    }

    return;
}

export function updateKeepOnScreen(p: Player, g: Game): void {
    if (p.char.pos.y < 0) {
        p.char.pos.y = g.SCREEN.HEIGHT;
    }
    if (p.char.pos.y > g.SCREEN.HEIGHT) {
        p.char.pos.y = 0;
    }
    if (p.char.pos.x < 0) {
        p.char.pos.x = g.SCREEN.WIDTH;
    }
    if (p.char.pos.x > g.SCREEN.WIDTH) {
        p.char.pos.x = 0;
    }
}
