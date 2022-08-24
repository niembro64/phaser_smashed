import Game from "../Game";

export function pausePhysics(game: Game): void {
  game.physics.pause();
}
export function resumePhysics(game: Game): void {
  game.physics.resume();
}
