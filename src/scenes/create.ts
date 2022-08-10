import Game from "./Game";

export function create(game: Game) {
    game.platforms = game.physics.add.staticGroup();
    game.platforms.create(300, 300, "platform").setScale(1, 1);
    game.players.forEach((p, i) => {
        p.char.sprite = game.physics.add.sprite(
            200 * i + 100,
            game.INITIAL.POSITION.PLAYER_Y,
            "c" + i.toString()
        );

        p.char.sprite.setScale(1);
        p.char.sprite.setCollideWorldBounds(false);
        game.physics.add.collider(p.char.sprite, game.platforms);
        p.keyboard = game.input.keyboard.addKeys(p.keyboard_static);
        p.char.sprite.body.setBounce(0);
        p.char.sprite.body.setAllowGravity(false);
        // p.char.sprite.body.setAllowGravity(true);
    });
    console.log("SPRITE", game.players[0].char.sprite);
}