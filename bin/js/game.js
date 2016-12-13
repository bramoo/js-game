var Game = (function () {
    function Game() {
        this.clicking = false;
        this.game = new Phaser.Game(800, 400, Phaser.AUTO, 'ts-game', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }
    Game.prototype.preload = function () {
        this.game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
    };
    Game.prototype.create = function () {
        this.game.stage.backgroundColor = '#221122';
        this.game.stage.disableVisibilityChange = true;
        var floor = new Phaser.Graphics(this.game, 0, 0);
        floor.beginFill(0xFFFFFF);
        floor.drawRect(0, 0, 400, 200);
        floor.endFill();
        var floorSprite = this.game.add.sprite(0, 232);
        floorSprite.addChild(floor);
        var ropeGraphics = new Phaser.Graphics(this.game, 0, 0);
        ropeGraphics.beginFill(0xFFFFFF);
        ropeGraphics.drawRect(0, 0, 4, 4);
        ropeGraphics.endFill();
        this.player = new Player(this.game, this.game.add.sprite(200, 200, 'dude', 6), this.game.add.rope(0, 0, ropeGraphics.generateTexture(), null, [new Phaser.Point(0, 0), new Phaser.Point(0, 0)]), 400, -800, new Phaser.Point(0, 0), 2000);
        // one cycle should cover 50px, there are 6 frames
        // fps = velocity * distance-per-frame
        // fps = velocity * (frames / distance) * fudge-factor
        var fps = this.player.speed * (6 / 50) * 0.5;
        this.player.sprite.animations.add('run', [0, 1, 2, 3, 4, 5], fps, true);
        this.player.sprite.animations.add('stand', [6], 0, true);
        this.player.sprite.animations.add('jump', [7], 0, true);
    };
    Game.prototype.update = function () {
        var t = this.game.time.elapsedMS;
        this.player.update(t);
        var pointer = this.game.input.activePointer;
        if (pointer.leftButton.isDown && !this.clicking) {
            this.clicking = true;
            this.player.updateRope(pointer.position);
            this.player.rope.exists = true;
        }
        else if (pointer.leftButton.isUp && this.clicking) {
            this.clicking = false;
            this.player.rope.exists = false;
        }
    };
    Game.prototype.render = function () {
    };
    return Game;
}());
window.onload = function () { var game = new Game(); };
var Player = (function () {
    function Player(game, sprite, rope, speed, jumpspeed, vel, gravity) {
        this.game = game;
        this.sprite = sprite;
        this.rope = rope;
        this.speed = speed;
        this.jumpspeed = jumpspeed;
        this.vel = vel;
        this.gravity = gravity;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.rope.points = [this.sprite.position, new Phaser.Point(0, 0)];
        this.rope.exists = false;
    }
    Player.prototype.update = function (time) {
        if (this.x < 400 && this.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            this.vel.y = this.jumpspeed;
        this.vel.y += this.gravity * time / 1000;
        this.y += this.vel.y * time / 1000;
        if (this.x < 400 && this.y > 200) {
            this.y = 200;
            this.vel.y = 0;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.vel.x = -this.speed * time / 1000;
            this.x += this.vel.x;
            this.sprite.scale.x = 1;
            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.vel.x = this.speed * time / 1000;
            this.x += this.vel.x;
            this.sprite.scale.x = -1;
            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else {
            this.sprite.play('stand');
        }
    };
    Player.prototype.updateRope = function (position) {
        this.rope.points[1].copyFrom(position);
    };
    Object.defineProperty(Player.prototype, "x", {
        get: function () {
            return this.sprite.x;
        },
        set: function (x) {
            this.sprite.x = x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "y", {
        get: function () {
            return this.sprite.y;
        },
        set: function (y) {
            this.sprite.y = y;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
}());
//# sourceMappingURL=game.js.map