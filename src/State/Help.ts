module Tsgame.State {
    export class Help extends Phaser.State {

        create() {
            let headingStyle = {
                font: "90px Bungee Hairline",
                fill: "#fff",
                boundsAlignH: "center"
            };

            let headingBounds = new Phaser.Rectangle(0, 0, 0, 0);
            headingBounds.width = 400;
            headingBounds.height = 90;
            headingBounds.centerX = this.game.width / 2;
            headingBounds.centerY = 100;

            let heading = this.add.text(0, 0, "How to play", headingStyle);
            heading.setTextBounds(headingBounds.x, headingBounds.y, headingBounds.width, headingBounds.height);
            
        }
    }
}