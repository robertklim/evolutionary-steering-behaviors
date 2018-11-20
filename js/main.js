const vehiclesNum = 10;
const foodNum = 10;
const poisonNum = 10;

let vehicles = [];
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

        // level of atraction to:
        this.genome = [];
        this.genome[0] = random(-5, 5); // food 
        this.genome[1] = random(-5, 5); // poison

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

    behaviors(good, bad) {
        let steerGood = this.eat(good);
        let steerBad = this.eat(bad);

        steerGood.mult(this.genome[0]);
        steerBad.mult(this.genome[1]);

        this.applyForce(steerGood);
        this.applyForce(steerBad);
    }

    eat(resource) {
        let closestDistance = Infinity;
        let closestResource = null;
        let closestResourceIndex = -1;
        for (let i = 0; i < resource.length; i++) {
            // let d = dist(this.pos.x, this.pos.y, resource[i].x, resource[i].y);
            let d = this.pos.dist(resource[i]);
            if (d < closestDistance) {
                closestDistance = d;
                closestResource = resource[i];
                closestResourceIndex = i;
            }
        }

        // if the vehicle is close enough from the resource EAT IT!!
        if (closestDistance < 5) {
            resource.splice(closestResourceIndex, 1);
        } else if (closestResourceIndex > -1) {
            return this.seek(resource[closestResourceIndex]);
        }

        return createVector(0, 0);

    }

    seek(target) {
        // vector from vehicle pos to target
        let desired = p5.Vector.sub(target, this.pos);

        // scale to maxSpeed
        desired.setMag(this.maxSpeed);

        // steering = desired - velocity
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        
        // this.applyForce(steer);
        return steer;
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

        // show arrtaction for foor
        stroke(0, 255, 0);
        line(0, 0, 0, -this.genome[0] * 20);
        // show arrtaction for poison
        stroke(255, 0, 0);
        line(0, 0, 0, -this.genome[1] * 20);

        pop();

    }

}

function setup() {
    createCanvas(600, 600);
    background(0);

    // create vehicles
    for (let i = 0; i < vehiclesNum; i++) {
        vehicles[i] = new Vehicle(random(width), random(height));
    }

    // create food
    for (let i = 0; i < foodNum; i++) {
        food.push(createVector(random(width), random(height)));
    }

    // create poison
    for (let i = 0; i < poisonNum; i++) {
        poison.push(createVector(random(width), random(height)));
    }

}

function draw() {
    background(0);

    let center = createVector(width / 2, height / 2);

    // draw food
    for (let i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        ellipse(food[i].x, food[i].y, 6, 6);
    }

    // draw poison
    for (let i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        ellipse(poison[i].x, poison[i].y, 6, 6);
    }

    for (let i = 0; i < vehicles.length; i++) {
        if (food.length > 0 || poison.length > 0) {
            vehicles[i].behaviors(food, poison);
            // vehicle.eat(food);
            // vehicle.eat(poison);
        } else {
            vehicles[i].seek(center);
        }

        // vehicle.seek(mouse);
        vehicles[i].update();
        vehicles[i].show();
    }
}