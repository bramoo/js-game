class Game
{
    game:Phaser.Game;
    player:Player;

    constructor(){
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, 'ts-game', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }

    preload()
    {
        this.game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
    }

    create()
    {
        this.game.stage.backgroundColor = '#221122';
        this.game.stage.disableVisibilityChange = true;

        this.player = new Player();
        this.player.sprite = this.game.add.sprite(200, 200, 'dude', 6);
        this.player.sprite.anchor.setTo(0.5, 0.5);

        this.player.speed = 400; // px/s
        this.player.jumpspeed = -800;
        this.player.gravity = 2000; // px/s^2
        this.player.vel = new Phaser.Point(0, 0);


        // one cycle should cover 50px, there are 6 frames
        // fps = velocity * distance-per-frame
        // fps = velocity * (frames / distance) * fudge-factor
        var fps = this.player.speed * (6 / 50) * 0.5;

        this.player.sprite.animations.add('run', [0,1,2,3,4,5], fps, true);
        this.player.sprite.animations.add('stand', [6], 0, true);
        this.player.sprite.animations.add('jump', [7], 0, true);
    }

    update()
    {
        var t = this.game.time.elapsedMS;
        var p = this.player;

        if (p.sprite.x < 400 && p.sprite.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            p.vel.y = p.jumpspeed;

        p.vel.y += p.gravity * t / 1000;
        p.sprite.y += p.vel.y * t / 1000;

        if (p.sprite.x < 400 && p.sprite.y > 200){
            p.sprite.y = 200;
            p.vel.y = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){

            p.vel.x = -p.speed * t / 1000;
            p.sprite.x += p.vel.x;
            p.sprite.scale.x = 1;

            if (p.sprite.x < 400 && p.sprite.y == 200)
                p.sprite.play('run');
            else
                p.sprite.play('jump');
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                    && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

            p.vel.x = p.speed * t / 1000;
            p.sprite.x += p.vel.x;
            p.sprite.scale.x = -1;

            if (p.sprite.x < 400 && p.sprite.y == 200)
                p.sprite.play('run');
            else
                p.sprite.play('jump');
        }
        else{
            p.sprite.play('stand');
        }
    }

    render()
    {

    }
}

window.onload = () => { var game = new Game(); }
