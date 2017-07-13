module Tsgame.State {
    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {
            let preloadGraphics = new Phaser.Graphics(this.game);
            preloadGraphics.beginFill(0xFFFFFF);
            preloadGraphics.drawRect(0, 0, 600, 20);
            preloadGraphics.endFill();

            this.preloadBar = this.add.sprite(100, 190, preloadGraphics.generateTexture());
            this.load.setPreloadSprite(this.preloadBar);
            
            this.load.spritesheet('dude', 'assets/dude.png', 64, 64);
            this.load.shader('tv', 'assets/tv2.frag');
        }

        create() {
            let tween = this.add.tween(this.preloadBar).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => this.game.state.start('MainMenu', true, false));
        }
    }
}