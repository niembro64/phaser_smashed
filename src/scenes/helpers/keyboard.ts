import Game from '../Game';
import { Player } from '../interfaces';

export function printKeyboard(game: Game) {
  game.players.forEach((player, playerIndex) => {
    if (playerIndex === 0) {
      if (player.keyboard) {
        // console.log('k.up.isDown', player.keyboard.up.isDown);
        // console.log('k.down.isDown', player.keyboard.down.isDown);
        // console.log('k.left.isDown', player.keyboard.left.isDown);
        // console.log('k.right.isDown', player.keyboard.right.isDown);
        // console.log('k.A.isDown', player.keyboard.A.isDown);
        // console.log('k.B.isDown', player.keyboard.B.isDown);
        // console.log('k.X.isDown', player.keyboard.X.isDown);
        // console.log('k.Y.isDown', player.keyboard.Y.isDown);
        // console.log('k.L.isDown', player.keyboard.L.isDown);
        // console.log('k.R.isDown', player.keyboard.R.isDown);
        // console.log('k.start.isDown', player.keyboard.start.isDown);
        // console.log('k.select.isDown', player.keyboard.select.isDown);
        // // print all padCurr to console
        // console.log('curr', player.padCurr.up);
        // console.log('c.down', player.padCurr.down);
        // console.log('c.left', player.padCurr.left);
        // console.log('c.right', player.padCurr.right);
        // console.log('c.A', player.padCurr.A);
        // console.log('c.B', player.padCurr.B);
        // console.log('c.X', player.padCurr.X);
        // console.log('c.Y', player.padCurr.Y);
        // console.log('c.L', player.padCurr.L);
        // console.log('c.R', player.padCurr.R);
        // console.log('c.start', player.padCurr.start);
        // console.log('c.select', player.padCurr.select);
      }
    }
  });
}

export function updatePadCurrKeyboard(player: Player, game: Game): void {
  if (player.keyboard) {
    // player.padCurr.up = player.keyboard.up

    let c = player.padCurr;
    let k = player.keyboard;

    // set all to isDown

    c.up = k.up.isDown;
    c.down = k.down.isDown;
    c.left = k.left.isDown;
    c.right = k.right.isDown;

    c.A = k.A.isDown;
    c.B = k.B.isDown;
    c.X = k.X.isDown;
    c.Y = k.Y.isDown;

    c.L = k.L.isDown;
    c.R = k.R.isDown;

    c.start = k.start.isDown;
    c.select = k.select.isDown;

    // set all to !isUp

    // c.up = !k.up.isUp;
    // c.down = !k.down.isUp;
    // c.left = !k.left.isUp;
    // c.right = !k.right.isUp;

    // c.A = !k.A.isUp;
    // c.B = !k.B.isUp;
    // c.X = !k.X.isUp;
    // c.Y = !k.Y.isUp;

    // c.L = !k.L.isUp;
    // c.R = !k.R.isUp;

    // c.start = !k.start.isUp;
    // c.select = !k.select.isUp;
  }
}

export function updatePadCurrKeyboardSubordinate(
  player: Player,
  game: Game
): void {
  if (player.keyboard) {
    player.padCurr.up = player.padCurr.up ? true : player.keyboard.up.isDown;
    player.padCurr.down = player.padCurr.down
      ? true
      : player.keyboard.down.isDown;
    player.padCurr.left = player.padCurr.left
      ? true
      : player.keyboard.left.isDown;
    player.padCurr.right = player.padCurr.right
      ? true
      : player.keyboard.right.isDown;

    player.padCurr.A = player.padCurr.A ? true : player.keyboard.A.isDown;
    player.padCurr.B = player.padCurr.B ? true : player.keyboard.B.isDown;
    player.padCurr.X = player.padCurr.X ? true : player.keyboard.X.isDown;
    player.padCurr.Y = player.padCurr.Y ? true : player.keyboard.Y.isDown;

    player.padCurr.L = player.padCurr.L ? true : player.keyboard.L.isDown;
    player.padCurr.R = player.padCurr.R ? true : player.keyboard.R.isDown;

    player.padCurr.start = player.padCurr.start
      ? true
      : player.keyboard.start.isDown;
    player.padCurr.select = player.padCurr.select
      ? true
      : player.keyboard.select.isDown;
  }
}
