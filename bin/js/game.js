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
        this.game.load.shader('tv', 'assets/tv2.frag');
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
        this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
        this.filter.uniforms.resolution = { type: '3f', value: { x: this.game.width, y: this.game.height, z: 0.0 } };
        this.game.stage.filters = [this.filter];
    };
    Game.prototype.update = function () {
        var t = this.game.time.elapsedMS;
        this.player.update(t);
        var pointer = this.game.input.activePointer;
        if (pointer.leftButton.isDown && !this.clicking) {
            this.clicking = true;
            this.player.updateAnchor(pointer.position);
            this.player.rope.exists = true;
        }
        else if (pointer.leftButton.isUp && this.clicking) {
            this.clicking = false;
            this.player.rope.exists = false;
        }
        this.filter.update();
    };
    Game.prototype.render = function () {
    };
    return Game;
}());
window.onload = function () { var game = new Game(); };
var Player = (function () {
    function Player(game, sprite, rope, speed, jumpspeed, vel, g) {
        this.game = game;
        this.sprite = sprite;
        this.rope = rope;
        this.speed = speed;
        this.jumpspeed = jumpspeed;
        this.vel = vel;
        this.g = g;
        this.m = 10;
        this.lastRopePoint = new Phaser.Point();
        this.sprite.anchor.setTo(0.5, 0.5);
        this.anchor = new Phaser.Point();
        this.ropePhysics = new RopePhysics(this);
        this.rope.points = [this.sprite.position, this.anchor];
        this.rope.exists = false;
    }
    Player.prototype.update = function (time) {
        if (this.rope.exists) {
            this.updateSwinging(time);
        }
        else {
            this.updateRunning(time);
        }
    };
    Player.prototype.updateRunning = function (time) {
        if (this.x < 400 && this.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            this.vel.y = this.jumpspeed;
        this.vel.y += this.g * time / 1000;
        this.y += this.vel.y * time / 1000;
        if (this.x < 400 && this.y > 200) {
            this.y = 200;
            this.vel.y = 0;
            this.vel.x = 0;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.vel.x = -this.speed;
            this.sprite.scale.x = 1;
            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.vel.x = this.speed;
            this.sprite.scale.x = -1;
            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else {
            this.sprite.play('stand');
        }
        this.x += this.vel.x * time / 1000;
    };
    Player.prototype.updateSwinging = function (time) {
        this.ropePhysics.update(time);
    };
    Player.prototype.updateAnchor = function (anchor) {
        this.anchor.copyFrom(anchor);
        this.ropePhysics.updateAnchor(anchor);
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
    Object.defineProperty(Player.prototype, "velx", {
        get: function () {
            return this.vel.x;
        },
        set: function (velx) {
            this.vel.x = velx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "vely", {
        get: function () {
            return this.vel.y;
        },
        set: function (vely) {
            this.vel.y = vely;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "mass", {
        get: function () {
            return this.m;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "gravity", {
        get: function () {
            return this.g;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
}());
var RopePhysics = (function () {
    function RopePhysics(object) {
        this.object = object;
    }
    RopePhysics.prototype.updateAnchor = function (anchor) {
        this.anchor = new Phaser.Point(anchor.x, anchor.y);
        this.length = Phaser.Point.distance(anchor, new Phaser.Point(this.object.x, this.object.y));
        this.totalEnergy = this.GetTotalEnergy(this.object.mass, this.object.gravity, -this.object.y, this.object.velx, this.object.vely);
    };
    RopePhysics.prototype.update = function (time) {
        this.lastPosition = new Phaser.Point(this.object.x, this.object.y);
        this.object.vely += this.object.gravity * time / 1000;
        this.object.y += this.object.vely * time / 1000;
        this.object.x += this.object.velx * time / 1000;
        // vector from object to anchor
        var currentToAnchor = new Phaser.Point(this.anchor.x - this.object.x, this.anchor.y - this.object.y);
        // vector from desired object location to anchor, calculated by scaling oa to rope length
        var newToAnchor = new Phaser.Point();
        newToAnchor.copyFrom(currentToAnchor);
        newToAnchor.normalize().multiply(this.length, this.length);
        // vector from current object location to desired object location
        var currentToNew = Phaser.Point.subtract(currentToAnchor, newToAnchor);
        // update object location
        this.object.x += currentToNew.x;
        this.object.y += currentToNew.y;
        // tangent to rope
        var move = new Phaser.Point(this.object.x - this.lastPosition.x, this.object.y - this.lastPosition.y);
        var vTangential = new Phaser.Point(newToAnchor.y, -newToAnchor.x);
        // make tangent point in the same general direction as the move vector
        if (vTangential.dot(move) < 0) {
            vTangential.multiply(-1, -1);
        }
        // tangent is going to become the new velocity vector
        // current kinetic energy
        var cke = this.GetKineticEnergy(this.object.mass, vTangential.x, vTangential.y);
        // desired kinetic energy
        var dke = this.totalEnergy - this.GetPotentialEnergy(this.object.mass, this.object.gravity, -this.object.y);
        // ratio of desired velocity to current velocity
        var r = Math.sqrt(dke / cke);
        this.object.velx = vTangential.x * r;
        this.object.vely = vTangential.y * r;
    };
    RopePhysics.prototype.GetTotalEnergy = function (mass, gravity, height, velx, vely) {
        return this.GetPotentialEnergy(mass, gravity, height) + this.GetKineticEnergy(mass, velx, vely);
    };
    RopePhysics.prototype.GetPotentialEnergy = function (mass, gravity, height) {
        return mass * gravity * height;
    };
    RopePhysics.prototype.GetKineticEnergy = function (mass, velx, vely) {
        return 0.5 * mass * (velx * velx + vely * vely);
    };
    return RopePhysics;
}());
//# sourceMappingURL=game.js.map