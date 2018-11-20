const vehiclesNum = 50;
const foodNum = 100;
const poisonNum = 20;
const dyingSpeed = 0.005;
const foodStrength = 0.2;
const poisonStrength = -0.5;
const cloneRate = 0.001;
const mutationRate = 0.01;

let vehicles = [];
let food = [];
let poison = [];

class Vehicle {

    constructor(x, y, gen) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(0, 0);
        this.r = 6;
        this.maxSpeed = 5;
        this.maxForce = 0.5;

        this.health = 1;

        this.genome = [];
        if (gen) {
            // mutation
            this.genome[0] = gen[0];
            if (random(1) < mutationRate) {
                this.genome[0] += random(-0.1, 0.1);
            }
            this.genome[1] = gen[1];
            if (random(1) < mutationRate) {
                this.genome[1] += random(-0.1, 0.1);
            }
            this.genome[2] = gen[2];
            if (random(1) < mutationRate) {
                this.genome[2] += random(-10, 10);
            }
            this.genome[3] = gen[3];
            if (random(1) < mutationRate) {
                this.genome[3] += random(-10, 10);
            }
        } else {
            // level of atraction to:
            this.genome[0] = random(-5, 5); // food 
            this.genome[1] = random(-5, 5); // poison
            // Level of perception of:
            this.genome[2] = random(10, 200); // food 
            this.genome[3] = random(10, 200); // poison
        }

    }

    update() {
        // decrease health every frame
        this.health -= dyingSpeed;
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
        let steerGood = this.eat(good, foodStrength, this.genome[2]);
        let steerBad = this.eat(bad, poisonStrength, this.genome[3]);

        steerGood.mult(this.genome[0]);
        steerBad.mult(this.genome[1]);

        this.applyForce(steerGood);
        this.applyForce(steerBad);
    }

    cloneSelf() {
        if (random(1) < cloneRate) {
            return new Vehicle(this.pos.x, this.pos.y, this.genome);
        } else {
            return null;
        }
    }

    eat(resource, nutrition, perception) {
        let closestDistance = Infinity;
        let closestResource = null;
        let closestResourceIndex = -1;
        for (let i = 0; i < resource.length; i++) {
            // let d = dist(this.pos.x, this.pos.y, resource[i].x, resource[i].y);
            let d = this.pos.dist(resource[i]);
            if (d < closestDistance && d < perception) {
                closestDistance = d;
                closestResource = resource[i];
                closestResourceIndex = i;
            }
        }

        // if the vehicle is close enough from the resource EAT IT!!
        if (closestDistance < this.maxSpeed) {
            resource.splice(closestResourceIndex, 1);
            this.health += nutrition;
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

    isDead() {
        return (this.health < 0);
    }

    show() {
        let green = color(0, 255, 0);
        let red = color(255, 0 ,0);
        let col = lerpColor(red, green, this.health); // <0 - red ... 1 - green>

        // Draw a triangle rotated in the direction of velocity
        let theta = this.vel.heading() + PI / 2;
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);

        // Draw the vehicle
        strokeWeight(1);
        fill(col);
        stroke(col);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        // show food atraction and perception
        stroke(0, 255, 0);
        noFill();
        line(0, 0, 0, -this.genome[0] * 20);
        ellipse(0, 0, this.genome[2] * 2);
        // show poison attraction and perception
        stroke(255, 0, 0);
        line(0, 0, 0, -this.genome[1] * 20);
        ellipse(0, 0, this.genome[3] * 2);

        pop();

    }

    boundaries() {
        let d = 10;
        let desired = null;
        if (this.pos.x < d) {
            desired = createVector(this.maxSpeed, this.vel.y);
        } else if (this.pos.x > width - d) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = createVector(this.vel.x, this.maxSpeed);
        } else if (this.pos.y > height - d) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.setMag(this.maxSpeed);
            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
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

    // randomly add food
    if (random(1) < 0.05) {
       food.push(createVector(random(width), random(height)));
    }

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

    for (let i = vehicles.length - 1; i >= 0; i--) {
        if (food.length > 0 || poison.length > 0) {
            vehicles[i].behaviors(food, poison);
            // vehicle.eat(food);
            // vehicle.eat(poison);
        } else {
            vehicles[i].seek(center);
        }

        // vehicle.seek(mouse);
        vehicles[i].boundaries();
        vehicles[i].update();
        vehicles[i].show();

        // create new vehicle
        let newVehicle = vehicles[i].cloneSelf();
        if (newVehicle !== null) {
            vehicles.push(newVehicle);
        }

        if (vehicles[i].isDead()) {
            food.push(createVector(vehicles[i].pos.x, vehicles[i].pos.y));
            vehicles.splice(i, 1);
        }

    }
}