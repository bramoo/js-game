module Tsgame {
    export class Player extends Phaser.Sprite implements IPhysics {

        private ropeAnchor: Phaser.Point;
        private ropePhysics: RopePhysics;
        private ropeLength: number;
        private lastRopePoint: Phaser.Point = new Phaser.Point();

        public rope: Phaser.Rope;
        public speed: number;
        public jumpspeed: number;
        public vel: Phaser.Point;
        public mass: number;
        public gravity: number;
        public energy: number;

        constructor(game: Phaser.Game, x: number, y: number,){

            super(game, x, y, 'dude', 6)

            this.speed = 400;
            this.jumpspeed = -800;
            this.vel = new Phaser.Point(0, 0);
            this.mass = 10;
            this.gravity = 2000;

            // one cycle should cover 50px, there are 6 frames
            // fps = velocity * distance-per-frame
            // fps = velocity * (frames / distance) * fudge-factor
            let fps = this.speed * (6 / 50) * 0.5;

            this.animations.add('run', [0,1,2,3,4,5], fps, true);
            this.animations.add('stand', [6], 0, true);
            this.animations.add('jump', [7], 0, true);


            this.anchor.setTo(0.5, 0.5);
            this.ropeAnchor = new Phaser.Point();
            this.ropePhysics = new RopePhysics(this);

            // TODO: generate texture in preload
            let ropeGraphics = new Phaser.Graphics(this.game, 0, 0);
            ropeGraphics.beginFill(0xFFFFFF);
            ropeGraphics.drawRect(0, 0, 4, 4);
            ropeGraphics.endFill();           
            
            this.rope = new Phaser.Rope(this.game, 0, 0, ropeGraphics.generateTexture(), null, new Array(2));
            this.rope.points = [this.position, this.ropeAnchor];
            this.rope.exists = false;

            game.add.existing(this);
            game.add.existing(this.rope);
        }

        update() {
            let time = this.game.time.physicsElapsedMS;

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