class Player implements IPhysics
{
    private anchor: Phaser.Point;
    private ropePhysics: RopePhysics;
    private m: number = 10;
    private e: number;
    private ropeLength: number;
    private lastRopePoint: Phaser.Point = new Phaser.Point();

    constructor(
        private game: Phaser.Game,
        public sprite: Phaser.Sprite,
        public rope: Phaser.Rope,
        public speed: number,
        public jumpspeed: number,
        public vel: Phaser.Point,
        public g: number)
    {
        this.sprite.anchor.setTo(0.5, 0.5);
        this.anchor = new Phaser.Point();
        this.ropePhysics = new RopePhysics(this);

        this.rope.points = [this.sprite.position, this.anchor];
        this.rope.exists = false;
    }

    update(time: number)
    {
        if (this.rope.exists){
            this.updateSwinging(time);
        }else{
            this.updateRunning(time);
        }
    }

    private updateRunning(time: number)
    {
        if (this.x < 400 && this.y == 200 && this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            this.vel.y = this.jumpspeed;

        this.vel.y += this.g * time / 1000;
        this.y += this.vel.y * time / 1000;

        if (this.x < 400 && this.y > 200)
        {
            this.y = 200;
            this.vel.y = 0;
            this.vel.x = 0;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
            && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {

            this.vel.x = -this.speed;
            
            this.sprite.scale.x = 1;

            if (this.x < 400 && this.y == 200)
                this.sprite.play('run');
            else
                this.sprite.play('jump');
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                    && !this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {

            this.vel.x = this.speed;
            
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

        this.x += this.vel.x * time / 1000;
    }

    private updateSwinging(time: number)
    {
        this.ropePhysics.update(time);
    }

    public updateAnchor(anchor: Phaser.Point){
        this.anchor.copyFrom(anchor);
        this.ropePhysics.updateAnchor(anchor);
    }

    get x(): number
    {
        return this.sprite.x;
    }

    set x(x: number)
    {
        this.sprite.x = x;
    }

    get y(): number
    {
        return this.sprite.y;
    }

    set y(y: number)
    {
        this.sprite.y = y;
    }

    get velx(): number
    {
        return this.vel.x;
    }

    set velx(velx: number)
    {
        this.vel.x = velx;
    }

    get vely(): number
    {
        return this.vel.y;
    }

    set vely(vely: number)
    {
        this.vel.y = vely;
    }

    get mass(): number
    {
        return this.m;
    }

    get gravity(): number
    {
        return this.g;
    }
}