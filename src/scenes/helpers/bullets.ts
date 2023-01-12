import Game from '../Game';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'bullet');
  }

  fire(x: number, y: number) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(-1000);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.y < 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(game: Game) {
    super(game.physics.world, game);

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(x: number, y: number) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y);
    }
  }
}
