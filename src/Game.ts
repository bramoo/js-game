class Game
{
    game:Phaser.Game;
    player:Player;
    private clicking: boolean = false;

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

        let floor = new Phaser.Graphics(this.game, 0, 0);
        floor.beginFill(0xFFFFFF);
        floor.drawRect(0, 0, 400, 200);
        floor.endFill();

        let floorSprite = this.game.add.sprite(0, 232);
        floorSprite.addChild(floor);

        let ropeGraphics = new Phaser.Graphics(this.game, 0, 0);
        ropeGraphics.beginFill(0xFFFFFF);
        ropeGraphics.drawRect(0, 0, 4, 4);
        ropeGraphics.endFill();

        this.player = new Player(
            this.game,
            this.game.add.sprite(200, 200, 'dude', 6),
            this.game.add.rope(0, 0, ropeGraphics.generateTexture(), null, [new Phaser.Point(0,0), new Phaser.Point(0,0)]),
            400,
            -800,
            new Phaser.Point(0,0),
            2000);

        // one cycle should cover 50px, there are 6 frames
        // fps = velocity * distance-per-frame
        // fps = velocity * (frames / distance) * fudge-factor
        let fps = this.player.speed * (6 / 50) * 0.5;

        this.player.sprite.animations.add('run', [0,1,2,3,4,5], fps, true);
        this.player.sprite.animations.add('stand', [6], 0, true);
        this.player.sprite.animations.add('jump', [7], 0, true);
    }

    update()
    {
        let t = this.game.time.elapsedMS;

        this.player.update(t);

        let pointer = this.game.input.activePointer;

        if (pointer.leftButton.isDown && !this.clicking)
        {
            this.clicking = true;
            this.player.updateRope(pointer.position);
            this.player.rope.exists = true;
        }
        else if(pointer.leftButton.isUp && this.clicking){
            this.clicking = false;
            this.player.rope.exists = false;
        }
    }

    render()
    {

    }
}

window.onload = () => { var game = new Game(); }
