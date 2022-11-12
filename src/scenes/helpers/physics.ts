import Game from '../Game';

export function setPhysicsPause(game: Game): void {
  game.physics.pause();
  game.players.forEach((player, playerIndex) => {
    player.emitterPlayer.active = false;
  });
}
export function setPhysicsResume(game: Game): void {
  game.physics.resume();
  game.players.forEach((player, playerIndex) => {
    player.emitterPlayer.active = true;
  });
}
