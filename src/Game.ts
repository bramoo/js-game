module Tsgame{

    export class Game extends Phaser.Game{

        public fontsLoaded: boolean;

        constructor(){
            super(800, 400, Phaser.AUTO, 'ts-game', null);

            this.state.add('Boot', State.Boot, false);
            this.state.add('Preloader', State.Preloader, false);
            this.state.add('MainMenu', State.MainMenu, false);
            this.state.add('Help', State.Help, false);
            this.state.add('Level', State.Level, false);

            this.fontsLoaded = false;
            
            this.state.start('Boot');
        }
    }
}