module Tsgame {
    export class Player extends Phaser.Sprite implements IPhysics {
        private ropeAnchor: Phaser.Point;
        private ropePhysics: RopePhysics;
        private ropeLength: number;
        private lastRopePoint: Phaser.Point = new Phaser.Point();
        
        public energy: number;

        constructor(game: Phaser.Game, 
                x: number, 
                y: number,
                public rope: Phaser.Rope,
                public speed: number,
                public jumpspeed: number,
                public vel: Phaser.Point,
                public mass: number,
                public gravity: number) {

            super(game, x, y, 'dude', 6)
            this.anchor.setTo(0.5, 0.5);
            this.ropeAnchor = new Phaser.Point();
            this.ropePhysics = new RopePhysics(this);

            this.rope.points = [this.position, this.ropeAnchor];
            this.rope.exists = false;

            game.add.existing(this);
        }

        update() {
            let time = this.game.time.elapsedMS;

            if (this.rope.exists) {
                this.updateSwinging(time);
            } else {
                this.updateRunning(time);
            }
        }

        private updateRunning(time: number) {
            if (this.x < 400 && this.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
                this.vel.y = this.jumpspeed;

            this.vel.y += this.gravity * time / 1000;
            this.y += this.vel.y * time / 1000;

            if (this.x < 400 && this.y > 200) {
                this.y = 200;
                this.vel.y = 0;
                this.vel.x = 0;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
                && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

                this.vel.x = -this.speed;

                this.scale.x = 1;

                if (this.x < 400 && this.y == 200)
                    this.play('run');
                else
                    this.play('jump');
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

                this.vel.x = this.speed;

                this.scale.x = -1;

                if (this.x < 400 && this.y == 200)
                    this.play('run');
                else
                    this.play('jump');
            }
            else {
                this.play('stand');
            }

            this.x += this.vel.x * time / 1000;
        }

        private updateSwinging(time: number) {
            this.ropePhysics.update(time);
        }

        public updateAnchor(anchor: Phaser.Point) {
            this.ropeAnchor.copyFrom(anchor);
            this.ropePhysics.updateAnchor(anchor);
        }
    }
}