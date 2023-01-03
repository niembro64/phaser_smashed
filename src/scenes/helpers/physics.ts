import Game from '../Game';
import { setAnimationsOff, setAnimationsOn } from './sprites';

export function setPhysicsPause(game: Game): void {
  game.physics.pause();
  game.players.forEach((player, playerIndex) => {
    player.emitterPlayer.active = false;
    player.emitterDark.active = false;
  });
  game.chomp.emitterDark.active = false;
  setAnimationsOff(game);
}
export function setPhysicsResume(game: Game): void {
  game.physics.resume();
  game.players.forEach((player, playerIndex) => {
    player.emitterPlayer.active = true;
    player.emitterDark.active = true;
  });
  game.chomp.emitterDark.active = true;
  setAnimationsOn(game);
}
