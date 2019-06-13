import paper from "paper";

class Car {
  constructor(start, flag) {
    this.start = start;
    this.flag = flag;
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

    this.vector = new paper.Point({
      angle: 0,
      length: 1
    });
    this.speed = 0;
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

  hit(track) {
    console.log(`car hit ${track} track`);
    this.flag.fillColor = "red";
    this.position = new paper.Point(this.start.x, this.start.y);
    this.speed = 0;
    this.vector.angle = 0;
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

export default Car;
