class RopePhysics
{
    private anchor: Phaser.Point;
    private length: number;
    private object: IPhysics;
    private lastPosition: Phaser.Point;
    private totalEnergy: number;

    constructor(object: IPhysics)
    {
        this.object = object;
    }

    public updateAnchor(anchor: Phaser.Point): void
    {
        this.anchor = new Phaser.Point(anchor.x, anchor.y);
        this.length = Phaser.Point.distance(anchor, new Phaser.Point(this.object.x, this.object.y));
        this.totalEnergy = this.GetTotalEnergy(this.object.mass,
                                                this.object.gravity,
                                                -this.object.y,
                                                this.object.velx,
                                                this.object.vely);
    }

    public update(time: number)
    {
        this.lastPosition = new Phaser.Point(this.object.x, this.object.y);

        this.object.vely += this.object.gravity * time / 1000;
        this.object.y += this.object.vely * time / 1000;

        this.object.x += this.object.velx * time / 1000;

        // vector from object to anchor
        let currentToAnchor = new Phaser.Point(this.anchor.x - this.object.x, this.anchor.y - this.object.y);

        // vector from desired object location to anchor, calculated by scaling oa to rope length
        let newToAnchor = new Phaser.Point();
        newToAnchor.copyFrom(currentToAnchor);
        newToAnchor.normalize().multiply(this.length, this.length);

        // vector from current object location to desired object location
        let currentToNew = Phaser.Point.subtract(currentToAnchor, newToAnchor);
       
        // update object location
        this.object.x += currentToNew.x;
        this.object.y += currentToNew.y;

        // tangent to rope
        let move = new Phaser.Point(this.object.x - this.lastPosition.x, this.object.y - this.lastPosition.y);
        let vTangential = new Phaser.Point(newToAnchor.y, -newToAnchor.x);

        // make tangent point in the same general direction as the move vector
        if (vTangential.dot(move) < 0)
        {
            vTangential.multiply(-1, -1);
        }

        // tangent is going to become the new velocity vector
        // current kinetic energy
        let cke = this.GetKineticEnergy(this.object.mass, vTangential.x, vTangential.y);

        // desired kinetic energy
        let dke = this.totalEnergy - this.GetPotentialEnergy(this.object.mass, 
                                                                this.object.gravity, 
                                                                -this.object.y);
        
        // ratio of desired velocity to current velocity
        let r = Math.sqrt(dke / cke);

        this.object.velx = vTangential.x * r;
        this.object.vely = vTangential.y * r;
    }
    
    private GetTotalEnergy(mass: number, gravity: number, height: number, velx: number, vely: number): number
    {
        return this.GetPotentialEnergy(mass, gravity, height) + this.GetKineticEnergy(mass, velx, vely);
    }

    private GetPotentialEnergy(mass: number, gravity: number, height: number): number
    {
        return mass * gravity * height;
    }

    private GetKineticEnergy(mass: number, velx: number, vely: number): number
    {
        return 0.5 * mass * (velx * velx + vely * vely);
    }

}