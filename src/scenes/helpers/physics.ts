import Game from "../Game";

export function setPhysicsPause(game: Game): void {
  game.physics.pause();
}
export function setPhysicsResume(game: Game): void {
  game.physics.resume();
}


