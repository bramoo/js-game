module Tsgame.State {
    export class MainMenu extends Phaser.State {

        filter: Phaser.Filter;
        items: Phaser.Text[];
        selection: number;
        highlight: Phaser.Sprite;
        lastMoved: number;

        menu: Menu;

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


            this.menu = new Menu(this.highlight, 
                new MenuItem(play, () => this.game.state.start("Level")),
                new MenuItem(how, () => this.game.state.start("Help"))
            );

            this.lastMoved = this.game.time.now - 100;

            this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
            this.filter.uniforms.resolution = { type: '3f', value: {x: this.game.width, y: this.game.height, z: 0.0}};
            
            this.stage.filters = [this.filter];
        }

        update(){
            let elapsed = this.game.time.now - this.lastMoved;

            let action = this.input.keyboard.isDown(Phaser.KeyCode.ENTER)
                || this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR);
            let down = this.input.keyboard.isDown(Phaser.KeyCode.DOWN);
            let up = this.input.keyboard.isDown(Phaser.KeyCode.UP);

            if (action){
                this.menu.doAction();
            }

            if (elapsed > 300){
                if (down){
                    this.menu.selectNext();
                    this.lastMoved = this.game.time.now;
                }

                if (up){
                    this.menu.selectPrevious();
                    this.lastMoved = this.game.time.now;
                }
            }

            if (!up && !down){
                this.lastMoved = 0;
            }

            this.filter.update();
        }


        mod(i, n){
            return ((i%n)+n)%n;
        }
    }
}