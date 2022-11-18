import Game from '../Game';
import { Player } from '../interfaces';

export function printKeyboard(game: Game) {
  game.players.forEach((player, playerIndex) => {
    if (player.keyboard) {
      console.log('player.keyboard.up.isDown', player.keyboard.up.isDown);
      console.log('player.keyboard.down.isDown', player.keyboard.down.isDown);
      console.log('player.keyboard.left.isDown', player.keyboard.left.isDown);
      console.log('player.keyboard.right.isDown', player.keyboard.right.isDown);

      console.log('player.keyboard.A.isDown', player.keyboard.A.isDown);
      console.log('player.keyboard.B.isDown', player.keyboard.B.isDown);
      console.log('player.keyboard.X.isDown', player.keyboard.X.isDown);
      console.log('player.keyboard.Y.isDown', player.keyboard.Y.isDown);

      console.log('player.keyboard.L.isDown', player.keyboard.L.isDown);
      console.log('player.keyboard.R.isDown', player.keyboard.R.isDown);
    }
  });
}

export function updatePadCurrKeyboard(player: Player, game: Game): void {
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
  }
}
