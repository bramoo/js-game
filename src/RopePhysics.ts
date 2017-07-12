module Tsgame {
    export class RopePhysics {
        private anchor: Phaser.Point;
        private length: number;
        private object: IPhysics;

        constructor(object: IPhysics) {
            this.object = object;
        }

        public updateAnchor(anchor: Phaser.Point): void {
            this.anchor = new Phaser.Point(anchor.x, anchor.y);
            this.length = Phaser.Point.distance(anchor, this.object.position);
            this.object.energy = this.GetTotalEnergy(this.object.mass,
                this.object.gravity,
                -this.object.position.y,
                this.object.vel.x,
                this.object.vel.y);
        }

        public update(time: number) {
            this.object.vel.y += this.object.gravity * time / 1000;
            this.object.position.y += this.object.vel.y * time / 1000;

            this.object.position.x += this.object.vel.x * time / 1000;

            // vector from object to anchor
            let currentToAnchor = Phaser.Point.subtract(this.anchor, this.object.position);

            // vector from desired object location to anchor, calculated by scaling oa to rope length
            let newToAnchor = new Phaser.Point(currentToAnchor.x, currentToAnchor.y);
            newToAnchor.normalize().multiply(this.length, this.length);

            // vector from current object location to desired object location
            let currentToNew = Phaser.Point.subtract(currentToAnchor, newToAnchor);

            // update object location
            this.object.position.add(currentToNew.x, currentToNew.y);

            // tangent to rope
            let move = Phaser.Point.subtract(this.object.position, this.object.previousPosition);
            let vTangential = new Phaser.Point(newToAnchor.y, -newToAnchor.x);

            // make tangent point in the same general direction as the move vector
            if (vTangential.dot(move) < 0) {
                vTangential.multiply(-1, -1);
            }

            // tangent is going to become the new velocity vector
            // current kinetic energy
            let cke = this.GetKineticEnergy(this.object.mass, vTangential.x, vTangential.y);

            // desired kinetic energy
            let dke = this.object.energy - this.GetPotentialEnergy(this.object.mass,
                this.object.gravity,
                -this.object.position.y);

            // ratio of desired velocity to current velocity
            let r = Math.sqrt(dke / cke);

            this.object.vel.x = vTangential.x * r;
            this.object.vel.y = vTangential.y * r;
        }

        private GetTotalEnergy(mass: number, gravity: number, height: number, velx: number, vely: number): number {
            return this.GetPotentialEnergy(mass, gravity, height) + this.GetKineticEnergy(mass, velx, vely);
        }

        private GetPotentialEnergy(mass: number, gravity: number, height: number): number {
            return mass * gravity * height;
        }

        private GetKineticEnergy(mass: number, velx: number, vely: number): number {
            return 0.5 * mass * (velx * velx + vely * vely);
        }

    }
}