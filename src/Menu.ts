module Tsgame {
    export class Menu {

        highlight: Phaser.Sprite;
        items: MenuItem[];
        index: number = 0;

        constructor(highlight: Phaser.Sprite, ...items: MenuItem[]) {
            this.highlight = highlight;
            let itemsArray = new Array<MenuItem>();
            this.items = itemsArray.concat(items);

            if (this.items.length > 0){
                this.selectIndex(0);
            }
        }

        public setHighlight(highlight: Phaser.Sprite){
            this.highlight = highlight;
        }

        public addItem(item: MenuItem) {
            this.items.push(item);
        }

        public selectIndex(index: number) {
            if (index >= this.items.length) return;

            this.index = index;

            this.highlight.centerX = this.items[index].text.textBounds.centerX;
            this.highlight.centerY = this.items[index].text.textBounds.centerY;
        }

        public selectNext() {
            if (this.items.length == 0) return;

            this.selectIndex((this.index + 1) % this.items.length);
        }

        public selectPrevious() {
            if (this.items.length == 0) return;

            this.selectIndex((this.index - 1 + this.items.length) % this.items.length);
        }

        public doAction(){
            if (this.items.length == 0) return;

            this.items[this.index].action();
        }
    }
}