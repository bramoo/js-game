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

            this.player = new Player( this.game, 200,  200);

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
