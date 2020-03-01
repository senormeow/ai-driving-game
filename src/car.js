import paper from "paper";
import Fov from "./fov";

class Car {
  constructor(start, flag, road, brain, carId, controls) {
    this.controls = controls;
    this.carId = carId;
    this.start = start;
    this.flag = flag;
    this.road = road;
    this.brain = brain;

    this.stopped = false;
    this.steering = 0.5;
    this.maxSteer = 5;

    console.log("New Car");
    this.position = new paper.Point(this.start.x, this.start.y);
    console.log("car position", this.position);
    let rectangle = new paper.Rectangle(
      new paper.Point(25, 25),
      new paper.Point(75, 50)
    );
    let cornerSize = new paper.Size(10, 10);
    let carBody = new paper.Path.RoundRectangle(rectangle, cornerSize);
    carBody.fillColor = "orange";
    carBody.strokeColor = "black";

    //construct the windshield via Rectangle constructors

    let headlight = new paper.Path.Arc({
      from: carBody.segments[4].point,
      through: [73, 32],
      to: carBody.segments[5].point,
      strokeColor: "black",
      fillColor: "grey",
      closed: true
    });

    let headlight2 = headlight.clone();
    headlight2.position.y += 15;
    headlight2.scale(-1, 1);
    headlight2.rotate(180);

    this.carGroup = new paper.Group(carBody, headlight, headlight2);
    this.carGroup.strokeColor = "black";
    this.carGroup.applyMatrix = false;
    this.carGroup.carId = this.carId;
    this.carGroup.onMouseDown = function(event) {
      controls.selectedCar(this.carId);
      console.log(brain);
    };

    this.vector = new paper.Point({
      angle: 0,
      length: 1
    });
    this.speed = 0;
    //this.carGroup.vector = this.vector;

    // Add the field of view lines:
    this.fov = new Fov(this);
  }

  left() {
    console.log("left");
    this.steer(this.steering - 0.2);
  }

  right() {
    console.log("right");
    this.steer(this.steering + 0.2);
  }

  // Steer value from 0 to 1, enforce
  steer(value) {
    if (value < 0) {
      this.steering = 0;
    } else if (value > 1) {
      this.steering = 1;
    } else {
      this.steering = value;
    }
  }

  aiSteer() {
    this.steer(this.brain.activate(this.fov.getFov)[0]);
  }

  getSteering() {
    return this.steering;
  }

  foward() {
    this.speed += 1;
    this.flag.fillColor = "green";
  }

  break() {
    this.speed -= 1;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  getFov() {
    return this.fov.getFov();
  }

  hit(track) {
    console.log(`car hit ${track} track`);
    this.flag.fillColor = "red";
    this.position = new paper.Point(this.start.x, this.start.y);
    this.speed = 0;
    this.vector.angle = 0;
    this.stopped = true;
  }

  draw() {
    if (this.stopped) {
      return;
    }

    this.vector.angle += this.maxSteer * this.steering - this.maxSteer / 2;

    var vec = this.vector.normalize(Math.abs(this.speed));
    this.position = this.position.add(vec);
    //console.log(vec);
    //console.log("new pos", this.position);
    let rotation = this.vector.angle;
    this.carGroup.position = this.position;
    this.carGroup.rotation = rotation;
    this.fov.updateFov(this.position, rotation);

    if (this.carGroup.intersects(this.road.innerRoad)) {
      this.hit("inner");
    }
    if (this.carGroup.intersects(this.road.outterRoad)) {
      this.hit("outter");
    }

    //    console.log(rotation, this.carGroup.rotation);
  }
}

export default Car;
