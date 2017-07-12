module Tsgame{
    export class Game extends Phaser.Game{
        constructor(){
            super(800, 400, Phaser.AUTO, 'ts-game', null);

            this.state.add('Level', Level, false);

            this.state.start('Level');
        }
    }
}