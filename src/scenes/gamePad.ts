import Game from "./Game";

export function assignGamePadsConnected(game: Game): void {
    for (let i = 0; i < game.input.gamepad.total; i++) {
        game.players[i].pad = game.input.gamepad.getPad(i);
    }
}

export function simpleMotion(game: Game): void {
    game.players.forEach((player, playerIndex) => {
        if (player.pad.left) {
            player.char.sprite.setVelocityX(-100);
        }
    });
}

export function printAllPadsActive(game: Game): void {
    // Buttons

    game.players.forEach((player, playerIndex) => {
        if (player.pad !== 0) {
            // console.log(player.pad);

            if (player.pad.B) {
                console.log(playerIndex, "A");
            }
            if (player.pad.A) {
                console.log(playerIndex, "B");
            }
            if (player.pad.X) {
                console.log(playerIndex, "Y");
            }
            if (player.pad.Y) {
                console.log(playerIndex, "X");
            }

            //  D Pad
            if (player.pad.down) {
                console.log(playerIndex, "down");
            }
            if (player.pad.up) {
                console.log(playerIndex, "up");
            }
            if (player.pad.left) {
                console.log(playerIndex, "left");
            }
            if (player.pad.right) {
                console.log(playerIndex, "right");
            }

            // L R Buttons
            if (player.pad.L1) {
                console.log(playerIndex, "L1");
            }
            if (player.pad.R1) {
                console.log(playerIndex, "R1");
            }
        }
    });
}
