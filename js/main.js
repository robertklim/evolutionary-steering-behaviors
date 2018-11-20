let vehicle;
let food = [];
let poison = [];

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

    applyForce(force) {
        this.acc.add(force);
    }

    eat(food) {
        let closestDistance = Infinity;
        let closestFood = null;
        let closestFoodIndex = -1;
        for (let i = 0; i < food.length; i++) {
            // let d = dist(this.pos.x, this.pos.y, food[i].x, food[i].y);
            let d = this.pos.dist(food[i]);
            if (d < closestDistance) {
                closestDistance = d;
                closestFood = food[i];
                closestFoodIndex = i;
            }
        }

        this.seek(closestFood);

    }

    seek(target) {
        // vector from vehicle pos to target
        let desired = p5.Vector.sub(target, this.pos);

        // scale to maxSpeed
        desired.setMag(this.maxSpeed);

        // steering = desired - velocity
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        
        this.applyForce(steer);
    }

    show() {
        // Draw a triangle rotated in the direction of velocity
        var theta = this.vel.heading() + PI / 2;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);

        // Draw the vehicle
        strokeWeight(1);
        fill(255);
        stroke(255);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();

    }

}

function setup() {
    createCanvas(600, 600);
    background(0);

    // create vehicle
    vehicle = new Vehicle(width / 2, height / 2);

    // create food
    for (let i = 0; i < 10; i++) {
        food.push(createVector(random(width), random(height)));
    }

    // create poison
    for (let i = 0; i < 10; i++) {
        poison.push(createVector(random(width), random(height)));
    }

}

function draw() {
    background(0);

    // let mouse = createVector(mouseX, mouseY);

    // draw food
    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        ellipse(food[i].x, food[i].y, 6, 6);
    }

    // draw poison
    for (let i = 0; i < food.length; i++) {
        fill(255, 0, 0);
        ellipse(poison[i].x, poison[i].y, 6, 6);
    }

    vehicle.eat(food);
    // vehicle.seek(mouse);
    vehicle.update();
    vehicle.show();
}