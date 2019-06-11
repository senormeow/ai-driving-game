import paper from "paper";
import keyboard from "./keyboard";

var canvas = document.getElementById("canv");

paper.setup(canvas);
//paper.install(window);
/* global view */
var path = new paper.Path();
path.strokeColor = "black";
var start = new paper.Point(100, 100);
path.moveTo(start);
// Note that the plus operator on Point objects does not work
// in JavaScript. Instead, we need to call the add() function:
path.lineTo(start.add([200, -50]));

var tool = new paper.Tool();

tool.onMouseDown = function(event) {
  path = new paper.Path();
  path.strokeColor = "black";
  path.add(event.point);
};

tool.onMouseDrag = function(event) {
  path.add(event.point);
};

// Draw the view now:
paper.view.draw();
console.log(paper.view.bounds);

class Car {
  constructor() {
    console.log("New Car");
    this.position = new paper.Point(
      paper.view.bounds.width / 2,
      paper.view.bounds.height / 2
    );
    console.log("car position", this.position);
    let rectangle = new paper.Rectangle(
      new paper.Point(50, 50),
      new paper.Point(150, 100)
    );
    let cornerSize = new paper.Size(20, 20);
    let carBody = new paper.Path.RoundRectangle(rectangle, cornerSize);
    carBody.fillColor = "orange";
    carBody.strokeColor = "black";
    //construct the windshield via Rectangle constructors
    let headlight = new paper.Path.Arc({
      from: carBody.segments[4].point,
      through: [149, 65],
      to: carBody.segments[5].point,
      strokeColor: "black",
      fillColor: "grey",
      closed: true
    });

    let headlight2 = headlight.clone();
    headlight2.position.y += 30;
    headlight2.scale(-1, 1);
    headlight2.rotate(180);

    this.carGroup = new paper.Group(carBody, headlight, headlight2);
    this.carGroup.strokeColor = "black";
    this.carGroup.applyMatrix = false;

    this.vector = new paper.Point({
      angle: 0,
      length: 1
    });
    this.speed = 1;
    //this.carGroup.vector = this.vector;
  }

  left() {
    console.log("left");
    this.vector.angle -= 15;
  }

  right() {
    console.log("right");
    this.vector.angle += 15;
  }

  draw() {
    var vec = this.vector.normalize(Math.abs(this.speed));
    this.position = this.position.add(vec);
    //console.log(vec);
    //console.log("new pos", this.position);
    let rotation = this.vector.angle;
    this.carGroup.position = this.position;
    this.carGroup.rotation = rotation;

    //    console.log(rotation, this.carGroup.rotation);
  }
}

let rect = new paper.Path.Rectangle(
  new paper.Rectangle(new paper.Point(500, 500), new paper.Point(600, 600))
);

rect.strokeColor = "black";
rect.fillColor = "blue";

var car = new Car();

let left = keyboard("ArrowLeft");
let right = keyboard("ArrowRight");

left.press = () => {
  car.left();
};

right.press = () => {
  car.right();
};

paper.view.onFrame = function(event) {
  // On each frame, rotate the path by 3 degrees:
  //path.rotate(3);
  car.draw();

  var inte = car.carGroup.intersects(rect);

  //var inte = path.intersects(car.carGroup.bounds);
  console.log(inte);
};
