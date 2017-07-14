module Tsgame {
    export class MenuItem {

        constructor(public text: Phaser.Text, public action: () => void) {}
    }
}