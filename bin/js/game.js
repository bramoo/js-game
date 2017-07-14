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
    var webFontConfig = {
        active: function () { return game.state.getCurrentState().webFontsLoaded(); },
        google: {
            families: [
                'Audiowide',
                'Bungee',
                'Bungee+Hairline',
                'Bungee+Inline',
                'Bungee+Outline',
                'Gruppo',
                'Monoton'
            ]
        }
    };
    WebFont.load(webFontConfig);
};
var Tsgame;
(function (Tsgame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 800, 400, Phaser.AUTO, 'ts-game', null) || this;
            _this.state.add('Boot', Tsgame.State.Boot, false);
            _this.state.add('Preloader', Tsgame.State.Preloader, false);
            _this.state.add('MainMenu', Tsgame.State.MainMenu, false);
            _this.state.add('Help', Tsgame.State.Help, false);
            _this.state.add('Level', Tsgame.State.Level, false);
            _this.fontsLoaded = false;
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    Tsgame.Game = Game;
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var Menu = (function () {
        function Menu(highlight) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            this.index = 0;
            this.highlight = highlight;
            var itemsArray = new Array();
            this.items = itemsArray.concat(items);
            if (this.items.length > 0) {
                this.selectIndex(0);
            }
        }
        Menu.prototype.setHighlight = function (highlight) {
            this.highlight = highlight;
        };
        Menu.prototype.addItem = function (item) {
            this.items.push(item);
        };
        Menu.prototype.selectIndex = function (index) {
            if (index >= this.items.length)
                return;
            this.index = index;
            this.highlight.centerX = this.items[index].text.textBounds.centerX;
            this.highlight.centerY = this.items[index].text.textBounds.centerY;
        };
        Menu.prototype.selectNext = function () {
            if (this.items.length == 0)
                return;
            this.selectIndex((this.index + 1) % this.items.length);
        };
        Menu.prototype.selectPrevious = function () {
            if (this.items.length == 0)
                return;
            this.selectIndex((this.index - 1 + this.items.length) % this.items.length);
        };
        Menu.prototype.doAction = function () {
            if (this.items.length == 0)
                return;
            this.items[this.index].action();
        };
        return Menu;
    }());
    Tsgame.Menu = Menu;
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var MenuItem = (function () {
        function MenuItem(text, action) {
            this.text = text;
            this.action = action;
        }
        return MenuItem;
    }());
    Tsgame.MenuItem = MenuItem;
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
var Tsgame;
(function (Tsgame) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Boot.prototype.preload = function () {
            };
            Boot.prototype.create = function () {
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                if (this.game.fontsLoaded) {
                    this.game.state.start('Preloader', true, false);
                }
                else {
                    this.ready = true;
                    console.log("Boot ready, waiting for webfonts ...");
                }
                //this.input.onDown.addOnce(() => this.game.state.start('Preloader', true, false), this);
            };
            Boot.prototype.webFontsLoaded = function () {
                this.game.fontsLoaded = true;
                if (this.ready) {
                    this.game.state.start('Preloader', true, false);
                }
                else {
                    console.log("Webfonts loaded, waiting for boot ...");
                }
            };
            return Boot;
        }(Phaser.State));
        State.Boot = Boot;
    })(State = Tsgame.State || (Tsgame.State = {}));
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var State;
    (function (State) {
        var Help = (function (_super) {
            __extends(Help, _super);
            function Help() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Help.prototype.create = function () {
                var headingStyle = {
                    font: "90px Bungee Hairline",
                    fill: "#fff",
                    boundsAlignH: "center"
                };
                var headingBounds = new Phaser.Rectangle(0, 0, 0, 0);
                headingBounds.width = 400;
                headingBounds.height = 90;
                headingBounds.centerX = this.game.width / 2;
                headingBounds.centerY = 100;
                var heading = this.add.text(0, 0, "How to play", headingStyle);
                heading.setTextBounds(headingBounds.x, headingBounds.y, headingBounds.width, headingBounds.height);
            };
            return Help;
        }(Phaser.State));
        State.Help = Help;
    })(State = Tsgame.State || (Tsgame.State = {}));
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var State;
    (function (State) {
        var Level = (function (_super) {
            __extends(Level, _super);
            function Level() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.clicking = false;
                return _this;
            }
            Level.prototype.preload = function () {
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
        State.Level = Level;
    })(State = Tsgame.State || (Tsgame.State = {}));
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var State;
    (function (State) {
        var MainMenu = (function (_super) {
            __extends(MainMenu, _super);
            function MainMenu() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MainMenu.prototype.create = function () {
                var _this = this;
                var titleStyle = {
                    font: "180px Bungee Outline",
                    fill: "#fff",
                    boundsAlignH: "center"
                };
                var titleBounds = new Phaser.Rectangle(0, 0, 0, 0);
                titleBounds.width = 400;
                titleBounds.height = 185;
                titleBounds.centerX = this.game.width / 2;
                titleBounds.centerY = 70;
                var title = this.add.text(0, 0, "TS-GAME", titleStyle);
                title.setTextBounds(titleBounds.x, titleBounds.y, titleBounds.width, titleBounds.height);
                //this.game.debug.rectangle(titleBounds, "#0f0", false);
                var itemStyle = {
                    font: "90px Bungee Hairline",
                    fill: "#fff",
                    boundsAlignH: "center"
                };
                var itemBounds = new Phaser.Rectangle(0, 0, 0, 0);
                itemBounds.width = 400;
                itemBounds.height = 90;
                itemBounds.centerX = this.game.width / 2;
                itemBounds.centerY = 200;
                var play = this.add.text(0, 0, "Play", itemStyle);
                play.setTextBounds(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
                // this.game.debug.rectangle(itemBounds, "#0f0", false);
                itemBounds.centerY = 300;
                var how = this.add.text(0, 0, "How?", itemStyle);
                how.setTextBounds(itemBounds.x, itemBounds.y, itemBounds.width, itemBounds.height);
                // this.game.debug.rectangle(itemBounds, "#0f0", false);
                var highlightGraphics = new Phaser.Graphics(this.game, 0, 0);
                highlightGraphics.lineStyle(5, 0xFFFFFF);
                highlightGraphics.moveTo(5, 5);
                highlightGraphics.lineTo(95, 5);
                highlightGraphics.moveTo(405, 5);
                highlightGraphics.lineTo(495, 5);
                this.highlight = this.add.sprite(0, 0, highlightGraphics.generateTexture());
                this.highlight.width = 500;
                this.highlight.height = 10;
                this.highlight.anchor.setTo(0.5, 0.5);
                this.menu = new Tsgame.Menu(this.highlight, new Tsgame.MenuItem(play, function () { return _this.game.state.start("Level"); }), new Tsgame.MenuItem(how, function () { return _this.game.state.start("Help"); }));
                this.lastMoved = this.game.time.now - 100;
                this.filter = new Phaser.Filter(this.game, null, this.game.cache.getShader('tv'));
                this.filter.uniforms.resolution = { type: '3f', value: { x: this.game.width, y: this.game.height, z: 0.0 } };
                this.stage.filters = [this.filter];
            };
            MainMenu.prototype.update = function () {
                var elapsed = this.game.time.now - this.lastMoved;
                var action = this.input.keyboard.isDown(Phaser.KeyCode.ENTER)
                    || this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR);
                var down = this.input.keyboard.isDown(Phaser.KeyCode.DOWN);
                var up = this.input.keyboard.isDown(Phaser.KeyCode.UP);
                if (action) {
                    this.menu.doAction();
                }
                if (elapsed > 300) {
                    if (down) {
                        this.menu.selectNext();
                        this.lastMoved = this.game.time.now;
                    }
                    if (up) {
                        this.menu.selectPrevious();
                        this.lastMoved = this.game.time.now;
                    }
                }
                if (!up && !down) {
                    this.lastMoved = 0;
                }
                this.filter.update();
            };
            MainMenu.prototype.mod = function (i, n) {
                return ((i % n) + n) % n;
            };
            return MainMenu;
        }(Phaser.State));
        State.MainMenu = MainMenu;
    })(State = Tsgame.State || (Tsgame.State = {}));
})(Tsgame || (Tsgame = {}));
var Tsgame;
(function (Tsgame) {
    var State;
    (function (State) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Preloader.prototype.preload = function () {
                var preloadGraphics = new Phaser.Graphics(this.game);
                preloadGraphics.beginFill(0xFFFFFF);
                preloadGraphics.drawRect(0, 0, 600, 20);
                preloadGraphics.endFill();
                this.preloadBar = this.add.sprite(100, 190, preloadGraphics.generateTexture());
                this.load.setPreloadSprite(this.preloadBar);
                this.load.spritesheet('dude', 'assets/dude.png', 64, 64);
                this.load.shader('tv', 'assets/tv2.frag');
            };
            Preloader.prototype.create = function () {
                var _this = this;
                var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () { return _this.game.state.start('MainMenu', true, false); });
            };
            return Preloader;
        }(Phaser.State));
        State.Preloader = Preloader;
    })(State = Tsgame.State || (Tsgame.State = {}));
})(Tsgame || (Tsgame = {}));
//# sourceMappingURL=game.js.map