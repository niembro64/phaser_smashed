import Game from "./game";

export function create(game: Game) {
    game.platforms = game.physics.add.staticGroup();
    game.platforms.create(300, 300, "platform").setScale(1, 1);
    game.players.forEach((player, playerIndex) => {
        player.char.sprite = game.physics.add.sprite(
            200 * playerIndex + 100,
            game.INITIAL.POSITION.PLAYER_Y,
            player.char.name
        );

        player.char.sprite.setScale(1);
        player.char.sprite.setCollideWorldBounds(false);
        game.physics.add.collider(player.char.sprite, game.platforms);
        player.keyboard = game.input.keyboard.addKeys(player.keyboard_static);
        player.char.sprite.body.setBounce(0);
        // player.char.sprite.body.setAllowGravity(false);
        // p.char.sprite.body.setAllowGravity(true);
    });
    console.log("SPRITE", game.players[0].char.sprite);
}