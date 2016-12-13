class Player
{

    constructor(
        private game: Phaser.Game,
        public sprite: Phaser.Sprite,
        public rope: Phaser.Rope,
        public speed: number,
        public jumpspeed: number,
        public vel: Phaser.Point,
        public gravity: number)
    {
        this.sprite.anchor.setTo(0.5, 0.5);
        this.rope.points = [this.sprite.position, new Phaser.Point(0, 0)];
        this.rope.exists = false;
    }

    update(time: number)
    {
        if (this.x < 400 && this.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            this.vel.y = this.jumpspeed;

        this.vel.y += this.gravity * time / 1000;
        this.y += this.vel.y * time / 1000;

        if (this.x < 400 && this.y > 200)
        {
            this.y = 200;
            this.vel.y = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {

            this.vel.x = -this.speed * time / 1000;
            this.x += this.vel.x;
            this.sprite.scale.x = 1;

            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                    && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {

            this.vel.x = this.speed * time / 1000;
            this.x += this.vel.x;
            this.sprite.scale.x = -1;

            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else
        {
            this.sprite.play('stand');
        }
    }

    public updateRope(position: Phaser.Point){
        this.rope.points[1].copyFrom(position);
    }

    get x(): number
    {
        return this.sprite.x;
    }

    set x(x: number)
    {
        this.sprite.x = x;
    }

    get y(): number{
        return this.sprite.y;
    }

    set y(y: number)
    {
        this.sprite.y = y;
    }
}