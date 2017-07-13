module Tsgame.State {
    export class MainMenu extends Phaser.State {

        filter: Phaser.Filter;
        items: Phaser.Text[];
        selection: number;
        highlight: Phaser.Sprite;
        lastMoved: number;

        create() {
            let titleStyle = {
                font: "180px Bungee Outline",
                fill: "#fff",
                boundsAlignH: "center"
            };

            let titleBounds = new Phaser.Rectangle(0, 0, 0, 0);
            titleBounds.width = 400;
            titleBounds.height = 185;
            titleBounds.centerX = this.game.width / 2;
            titleBounds.centerY = 70;

            let title = this.add.text(0, 0, "TS-GAME", titleStyle);
            title.setTextBounds(titleBounds.x, titleBounds.y, titleBounds.width, titleBounds.height);

            //this.game.debug.rectangle(titleBounds, "#0f0", false);

            let itemStyle = {
                font: "90px Bungee Hairline",
                fill: "#fff",
                boundsAlignH: "center"
            };

            let itemBounds = new Phaser.Rectangle(0, 0, 0, 0);
            itemBounds.width = 400;
            itemBounds.height = 90;
            itemBounds.centerX = this.game.width / 2;
            itemBounds.centerY = 200;

            let play = this.add.text(0, 0, "Play", itemStyle);
            play.setTextBounds(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);

            // this.game.debug.rectangle(itemBounds, "#0f0", false);

            itemBounds.centerY = 300;

            let how = this.add.text(0, 0, "How?", itemStyle);
            how.setTextBounds(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);

            // this.game.debug.rectangle(itemBounds, "#0f0", false);

            this.items = [play, how];
            this.selection = 0;

            let highlightGraphics = new Phaser.Graphics(this.game, 0, 0);
            highlightGraphics.lineStyle(5, 0xFFFFFF);
            highlightGraphics.moveTo(5, 5);
            highlightGraphics.lineTo(95, 5);
            highlightGraphics.moveTo(405, 5);
            highlightGraphics.lineTo(495, 5);

            this.highlight = this.add.sprite(0, 0, highlightGraphics.generateTexture());
            this.highlight.width = 500;
            this.highlight.height = 10;
            this.highlight.anchor.setTo(0.5, 0.5);
            this.highlight.centerX = this.game.width / 2;
            this.highlight.centerY = play.textBounds.centerY;

            this.lastMoved = this.game.time.now - 100;

            this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
            this.filter.uniforms.resolution = { type: '3f', value: {x: this.game.width, y: this.game.height, z: 0.0}};
            
            this.stage.filters = [this.filter];
        }

        update(){
            let elapsed = this.game.time.now - this.lastMoved;

            if (elapsed > 200){
                if (this.input.keyboard.isDown(Phaser.KeyCode.DOWN)){
                    this.selection = this.mod(this.selection + 1, this.items.length);
                    this.lastMoved = this.game.time.now;
                }

                if (this.input.keyboard.isDown(Phaser.KeyCode.UP)){
                    this.selection = this.mod(this.selection - 1, this.items.length);
                    this.lastMoved = this.game.time.now;
                }
            }

            this.highlight.centerY = this.items[this.selection].textBounds.centerY;

            this.filter.update();
        }


        mod(i, n){
            return ((i%n)+n)%n;
        }
    }
}