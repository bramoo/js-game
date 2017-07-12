module Tsgame {
    export class Level extends Phaser.State {

        game:Phaser.Game;
        player:Player;
        filter:Phaser.Filter;
        private clicking: boolean = false;

        preload()
        {
            this.game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
            this.game.load.shader('tv', 'assets/tv2.frag');
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
                200, // x
                200, // y
                this.game.add.rope(0, 0, ropeGraphics.generateTexture(), null, [new Phaser.Point(0,0), new Phaser.Point(0,0)]),
                400, // speed
                -800, // jumpspeed
                new Phaser.Point(0,0),
                10, // mass
                2000); // gravity

            // one cycle should cover 50px, there are 6 frames
            // fps = velocity * distance-per-frame
            // fps = velocity * (frames / distance) * fudge-factor
            let fps = this.player.speed * (6 / 50) * 0.5;

            this.player.animations.add('run', [0,1,2,3,4,5], fps, true);
            this.player.animations.add('stand', [6], 0, true);
            this.player.animations.add('jump', [7], 0, true);

            this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
            this.filter.uniforms.resolution = { type: '3f', value: {x: this.game.width, y: this.game.height, z: 0.0}};
            
            this.game.stage.filters = [this.filter];
        }

        update()
        {
            this.player.update();

            let pointer = this.game.input.activePointer;

            if (pointer.leftButton.isDown && !this.clicking)
            {
                this.clicking = true;
                this.player.updateAnchor(pointer.position);
                this.player.rope.exists = true;
            }
            else if(pointer.leftButton.isUp && this.clicking){
                this.clicking = false;
                this.player.rope.exists = false;
            }

            this.filter.update();
        }

        render()
        {

        }
    }
}
