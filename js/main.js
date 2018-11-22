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