import Game from '../Game';
import { Player, Position, Velocity } from '../interfaces';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'laser');
  }

  fire(pos: Position, vel: Velocity) {
    this.body.reset(pos.x, pos.y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(vel.y);
    this.setVelocityX(vel.x);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.y <= 0 || this.y >= 1080 || this.x <= 0 || this.x >= 1920) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(game: Game, player: Player) {
    super(game.physics.world, game);

    this.createMultiple({
      frameQuantity: player.char.attackEnergy.bullets?.NUMBER_BULLETS || 10,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(pos: Position, vel: Velocity) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(pos, vel);
    }
  }
}
