import { Cameras } from 'phaser';
import Game from './Game';

export function create(game: Game) {
    game.platforms = game.physics.add.staticGroup();
    game.platforms.create(300, 300, 'platformHorizontal');
    game.platforms.create(600, 500, 'platformHorizontal');
    game.platforms.create(900, 300, 'platformVertical');
    game.players.forEach((player, playerIndex) => {
        for (let i = 0; i < 15; i++) {
            player.char.wallTouchArray.push(false);
        }

        player.char.sprite = game.physics.add.sprite(
            150 * playerIndex + 450,
            game.INITIAL.POSITION.PLAYER_Y,
            player.char.name
        );

        player.char.sprite.setScale(1);
        player.char.sprite.setCollideWorldBounds(false);
        game.physics.add.collider(player.char.sprite, game.platforms);
        player.keyboard = game.input.keyboard.addKeys(player.keyboard_static);
    });

    charsCollide(game);
    // game.cameras.main.setBounds(0, 0, 800, 300);
    // game.cameras.main.startFollow(game.players[0].char.sprite);
    // game.camera = game.cameras.main;
    game.cameras.main.startFollow(game.players[0].char.sprite);
    // game.camera.setFollowOffset(-20, 30);
}

export function charsCollide(game: Game): void {
    game.players.forEach((player, playerIndex) => {
        game.players.forEach((p, pj) => {
            if (pj !== playerIndex) {
                game.physics.add.collider(player.char.sprite, p.char.sprite);
            }
        });
    });
}
