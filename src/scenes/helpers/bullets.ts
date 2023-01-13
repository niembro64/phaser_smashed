import Game, { sd } from '../Game';
import { Player, Position, Velocity } from '../interfaces';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'laser');

    game.physics.add.collider(this, game.PLATFORMS);

    for (let i = 0; i < game.players.length; i++) {
      // game.physics.add.collider(this, game.players[i].char.sprite);
      game.physics.add.collider(this, game.players[i].char.attackEnergy.sprite);
      game.physics.add.collider(
        this,
        game.players[i].char.attackPhysical.sprite
      );
    }

    // game.players.forEach((p, pIndex) => {
    //   game.physics.add.collider(this, p.char.sprite);
    //   game.physics.add.collider(this, p.char.attackEnergy.sprite);
    //   game.physics.add.collider(this, p.char.attackPhysical.sprite);
    // });

    game.physics.add.collider(this, game.chomp.sprite);
    game.physics.add.collider(this, game.TABLE);
  }

  Y_RANDOM: number = -50;
  Y_ADDER: number = -10;
  floatVelocityY: number = 0;

  fire(pos: Position, vel: Velocity): void {
    this.body.bounce.set(1);
    this.body.reset(pos.x, pos.y);
    this.floatVelocityY = this.Y_ADDER + this.Y_RANDOM * Math.random();
    // this.floatVelocityY = this.FLOAT_VELOCITY_Y * normalRandom(0.5, 0.2);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityY(vel.y);
    this.setVelocityX(vel.x);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (
      this.y <= 0 ||
      this.y >= sd.HEIGHT ||
      this.x <= 0 ||
      this.x >= sd.WIDTH
    ) {
      this.body.bounce.set(0);
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

  fireBullet(pos: Position, vel: Velocity): void {
    let bullet = this.getFirstDead(false);
    if (bullet) {
      // bullet.bouncePlatforms = true;
      // bullet.bounceWorldBounds = false;
      // bullet.bounceX = 1;
      // bullet.bounceY = 1;

      bullet.fire(pos, vel);
    }
  }
}
