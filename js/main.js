let vehicle;

class Vehicle {

    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.r = 6;
        this.maxSpeed = 5;
        this.maxForce = 0.3;
    }

    update() {
        // update velocity
        this.vel.add(this.acc);
        // limit speed
        this.vel.limit(this.maxSpeed);
        // update location
        this.pos.add(this.vel);
        // clear acceleration
        this.acc.mult(0);
    }

    show() {
        stroke(255);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
    }

}

function setup() {
    createCanvas(600, 600);
    background(0);

    vehicle = new Vehicle(width / 2, height / 2);

}

function draw() {
    background(0);
    vehicle.update();
    vehicle.show();
}