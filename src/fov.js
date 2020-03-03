import paper from "paper";

class Fov {
  constructor(car) {
    this.car = car;
    this.road = car.road;
    this.lineLength = 200;
    let front = 15;

    let angles = [-45, 0, 45];
    let colors = ["red", "green", "blue"];

    this.distLines = [];

    for (let i = 0; i < angles.length; i++) {
      let onePoint = new paper.Point(0, 0);
      onePoint.angle = angles[i];
      onePoint.length = this.lineLength;

      let distLine = new paper.Path.Line({
        from: [front, 0],
        to: onePoint,
        strokeColor: colors[i]
      });

      distLine.applyMatrix = false;
      distLine.pivot = new paper.Point(0, 0);
      this.distLines.push(distLine);
    }
  }

  getLineDistance(road, line) {
    let innerDist = 1;
    let outterDist = 1;

    let lineInterInner = road.innerRoad.getIntersections(line);
    let lineInterOutter = road.outterRoad.getIntersections(line);

    if (lineInterInner.length > 0) {
      innerDist =
        line.position.getDistance(lineInterInner[0].point) / this.lineLength;
    }

    if (lineInterOutter.length > 0) {
      outterDist =
        line.position.getDistance(lineInterOutter[0].point) / this.lineLength;
    }

    if (innerDist < outterDist) {
      return innerDist;
    }

    return outterDist;
  }

  getFov() {
    return this.distLines.map(line => {
      return this.getLineDistance(this.road, line);
    });
  }

  updateFov(position, rotation) {
    for (let i = 0; i < this.distLines.length; i++) {
      this.distLines[i].position = position;
      this.distLines[i].rotation = rotation;
    }
  }
}

export default Fov;
