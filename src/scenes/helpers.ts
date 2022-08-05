import { Gravity } from "matter";
import { Char, Player, Keyboard_Static } from "./Game";
import Game from "./Game";

export function updateMovements(g: Game): void {
    g.players.forEach((p) => {
        updateKeyboard(p, g);
        updatePosition(p);
        addGravity(p, g);
        updateKeepOnScreen(p, g);
    });
    console.log(g.players[0].char.vel);
}
export function updatePosition(p: Player): void {
    p.char.pos.x = p.char.pos.x + p.char.vel.x;
    p.char.pos.y = p.char.pos.y + p.char.vel.y;
    p.char.sprite.x = p.char.pos.x;
    p.char.sprite.y = p.char.pos.y;
}

export function addGravity(p: Player, g: Game): void {
    if (p.char.sprite.body.touching.down) {
        p.char.vel.y = 0;
        return;
    }
    p.char.vel.y -= g.GRAVITY;
}

export function updateKeyboard(p: Player, g: Game): void {
    if (p.keyboard.left.isDown && p.keyboard.right.isDown) {
        // do nothing
    } else if (p.keyboard.left.isDown) {
        p.char.vel.x = -g.DEFAULT_SPEED;
    } else if (p.keyboard.right.isDown) {
        p.char.vel.x = g.DEFAULT_SPEED;
    } else {
        p.char.vel.x = 0;
    }

    if (p.keyboard.up.isDown && p.keyboard.down.isDown) {
        // do nothing
    } else if (p.keyboard.up.isDown) {
        p.char.vel.y = -g.DEFAULT_SPEED;
    } else if (p.keyboard.down.isDown) {
        p.char.vel.y = g.DEFAULT_SPEED;
    } else {
        p.char.vel.y = 0;
        // do nothing
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
