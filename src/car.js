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

    let twoPoint = new paper.Point(0, 0);
    twoPoint.angle = 42;
    twoPoint.length = 400;

    this.distLine1 = new paper.Path.Line({
      from: [0, 0],
      to: twoPoint,
      strokeColor: "red"
    });
    this.distLine2 = new paper.Path.Line({
      from: [0, 0],
      to: [200, 0],
      strokeColor: "green"
    });
    this.distLine3 = new paper.Path.Line({
      from: [0, 0],
      to: [150, -150],
      strokeColor: "blue"
    });

    // this.distLines = new paper.Group(
    //   this.distLine1,
    //   this.distLine2,
    //   this.distLine3
    // );
    // this.distLines.pivot = new paper.Point(0, 0);
    // this.distLines.applyMatrix = false;
    this.distLine2.applyMatrix = false;
    this.distLine2.pivot = new paper.Point(0, 0);
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
    this.getLineDistance(window.road);

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

  getLineDistance(road) {
    let line2inter = road.innerRoad.getIntersections(this.distLine2);
    if (line2inter.length > 0) {
      console.log("intersect", line2inter.toString());
      console.log(this.position, line2inter[0].point);
      var line2dist = this.position.getDistance(line2inter[0].point);
      console.log(line2dist);
    }
  }

  draw() {
    var vec = this.vector.normalize(Math.abs(this.speed));
    this.position = this.position.add(vec);
    //console.log(vec);
    //console.log("new pos", this.position);
    let rotation = this.vector.angle;
    this.carGroup.position = this.position;
    this.carGroup.rotation = rotation;
    this.distLine2.position = this.position;
    this.distLine2.rotation = rotation;

    //    console.log(rotation, this.carGroup.rotation);
  }
}

export default Car;
