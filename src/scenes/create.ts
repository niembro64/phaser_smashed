import Game from './Game';

export function create(game: Game) {
    game.platforms = game.physics.add.staticGroup();
    game.platforms.create(500, 300, 'platformHorizontal');
    game.platforms.create(800, 500, 'platformHorizontal');
    game.platforms.create(1100, 300, 'platformVertical');
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

    game.center_10.helper = game.physics.add
        .sprite(200, 200, 'center')
        .setScale(0.05);
    game.center_10.helper.setImmovable(true);
    game.center_10.helper.body.allowGravity = false;
    game.cameras.main.startFollow(game.center_10.helper);

    game.center_80.helper = game.physics.add
        .sprite(200, 200, 'center')
        .setScale(0.05);
    game.center_80.helper.setImmovable(true);
    game.center_80.helper.body.allowGravity = false;
    // game.cameras.main.startFollow(game.center_80.helper);

    for (let i = 0; i < 30; i++) {
        game.center_10.locations.push({ x: 800, y: 300, zoom: 1 });
    }
    for (let i = 0; i < 100; i++) {
        game.center_80.locations.push({ x: 800, y: 300, zoom: 1 });
    }
    game.cameras.main.setBounds(
        0,
        0,
        game.SCREEN_DIMENSIONS.WIDTH,
        game.SCREEN_DIMENSIONS.HEIGHT
    );
    
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
