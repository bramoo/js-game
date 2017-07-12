interface IPhysics{
    position: Phaser.Point;
    previousPosition: Phaser.Point;
    vel: Phaser.Point;
    mass: number;
    gravity: number;
    energy: number;
}