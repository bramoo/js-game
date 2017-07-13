module Tsgame.State {
    export class Boot extends Phaser.State {

        ready: boolean;

        preload() {

        }

        create() {
            this.input.maxPointers = 1;

            this.stage.disableVisibilityChange = true;

            if ((this.game as Tsgame.Game).fontsLoaded){
                this.game.state.start('Preloader', true, false);
            }
            else{
                this.ready = true;

                console.log("Boot ready, waiting for webfonts ...");
            }

            //this.input.onDown.addOnce(() => this.game.state.start('Preloader', true, false), this);
        }

        webFontsLoaded(){
            (this.game as Tsgame.Game).fontsLoaded = true;

            if (this.ready){
                this.game.state.start('Preloader', true, false);
            }
            else{
                console.log("Webfonts loaded, waiting for boot ...");
            }
        }
    }
}