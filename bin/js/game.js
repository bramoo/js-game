var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var game = new Tsgame.Game();
};
var Tsgame;
(function (Tsgame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 800, 400, Phaser.AUTO, 'ts-game', null) || this;
            _this.state.add('Level', Tsgame.Level, false);
            _this.state.start('Level');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Tsgame.Game = Game;
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.clicking = false;
            return _this;
        }
        Level.prototype.preload = function () {
            this.game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
            this.game.load.shader('tv', 'assets/tv2.frag');
        };
        Level.prototype.create = function () {
            this.game.stage.backgroundColor = '#221122';
            this.game.stage.disableVisibilityChange = true;
            var floor = new Phaser.Graphics(this.game, 0, 0);
            floor.beginFill(0xFFFFFF);
            floor.drawRect(0, 0, 400, 200);
            floor.endFill();
            var floorSprite = this.game.add.sprite(0, 232);
            floorSprite.addChild(floor);
            this.player = new Tsgame.Player(this.game, 200, 200);
            this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
            this.filter.uniforms.resolution = { type: '3f', value: { x: this.game.width, y: this.game.height, z: 0.0 } };
            this.game.stage.filters = [this.filter];
        };
        Level.prototype.update = function () {
            this.player.update();
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
        Level.prototype.render = function () {
        };
        return Level;
    }(Phaser.State));
    Tsgame.Level = Level;
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            var _this = _super.call(this, game, x, y, 'dude', 6) || this;
            _this.lastRopePoint = new Phaser.Point();
            _this.speed = 400;
            _this.jumpspeed = -800;
            _this.vel = new Phaser.Point(0, 0);
            _this.mass = 10;
            _this.gravity = 2000;
            // one cycle should cover 50px, there are 6 frames
            // fps = velocity * distance-per-frame
            // fps = velocity * (frames / distance) * fudge-factor
            var fps = _this.speed * (6 / 50) * 0.5;
            _this.animations.add('run', [0, 1, 2, 3, 4, 5], fps, true);
            _this.animations.add('stand', [6], 0, true);
            _this.animations.add('jump', [7], 0, true);
            _this.anchor.setTo(0.5, 0.5);
            _this.ropeAnchor = new Phaser.Point();
            _this.ropePhysics = new Tsgame.RopePhysics(_this);
            // TODO: generate texture in preload
            var ropeGraphics = new Phaser.Graphics(_this.game, 0, 0);
            ropeGraphics.beginFill(0xFFFFFF);
            ropeGraphics.drawRect(0, 0, 4, 4);
            ropeGraphics.endFill();
            _this.rope = new Phaser.Rope(_this.game, 0, 0, ropeGraphics.generateTexture(), null, new Array(2));
            _this.rope.points = [_this.position, _this.ropeAnchor];
            _this.rope.exists = false;
            game.add.existing(_this);
            game.add.existing(_this.rope);
            return _this;
        }
        Player.prototype.update = function () {
            var time = this.game.time.elapsedMS;
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
        };
        Player.prototype.updateSwinging = function (time) {
            this.ropePhysics.update(time);
        };
        Player.prototype.updateAnchor = function (anchor) {
            this.ropeAnchor.copyFrom(anchor);
            this.ropePhysics.updateAnchor(anchor);
        };
        return Player;
    }(Phaser.Sprite));
    Tsgame.Player = Player;
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var RopePhysics = (function () {
        function RopePhysics(object) {
            this.object = object;
        }
        RopePhysics.prototype.updateAnchor = function (anchor) {
            this.anchor = new Phaser.Point(anchor.x, anchor.y);
            this.length = Phaser.Point.distance(anchor, this.object.position);
            this.object.energy = this.GetTotalEnergy(this.object.mass, this.object.gravity, -this.object.position.y, this.object.vel.x, this.object.vel.y);
        };
        RopePhysics.prototype.update = function (time) {
            this.object.vel.y += this.object.gravity * time / 1000;
            this.object.position.y += this.object.vel.y * time / 1000;
            this.object.position.x += this.object.vel.x * time / 1000;
            // vector from object to anchor
            var currentToAnchor = Phaser.Point.subtract(this.anchor, this.object.position);
            // vector from desired object location to anchor, calculated by scaling oa to rope length
            var newToAnchor = new Phaser.Point(currentToAnchor.x, currentToAnchor.y);
            newToAnchor.normalize().multiply(this.length, this.length);
            // vector from current object location to desired object location
            var currentToNew = Phaser.Point.subtract(currentToAnchor, newToAnchor);
            // update object location
            this.object.position.add(currentToNew.x, currentToNew.y);
            // tangent to rope
            var move = Phaser.Point.subtract(this.object.position, this.object.previousPosition);
            var vTangential = new Phaser.Point(newToAnchor.y, -newToAnchor.x);
            // make tangent point in the same general direction as the move vector
            if (vTangential.dot(move) < 0) {
                vTangential.multiply(-1, -1);
            }
            // tangent is going to become the new velocity vector
            // current kinetic energy
            var cke = this.GetKineticEnergy(this.object.mass, vTangential.x, vTangential.y);
            // desired kinetic energy
            var dke = this.object.energy - this.GetPotentialEnergy(this.object.mass, this.object.gravity, -this.object.position.y);
            // ratio of desired velocity to current velocity
            var r = Math.sqrt(dke / cke);
            this.object.vel.x = vTangential.x * r;
            this.object.vel.y = vTangential.y * r;
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
    Tsgame.RopePhysics = RopePhysics;
})(Tsgame || (Tsgame = {}));
//# sourceMappingURL=game.js.map