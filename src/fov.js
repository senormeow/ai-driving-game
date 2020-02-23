import paper from "paper";

class Fov {
  constructor(car) {
    this.car = car;

    this.lineLength = 300;
    let front = 15;

    let onePoint = new paper.Point(0, 0);
    onePoint.angle = -30;
    onePoint.length = this.lineLength;

    let distLine1 = new paper.Path.Line({
      from: [front, 0],
      to: onePoint,
      strokeColor: "red"
    });
    distLine1.applyMatrix = false;
    distLine1.pivot = new paper.Point(0, 0);

    let distLine2 = new paper.Path.Line({
      from: [front, 0],
      to: [this.lineLength, 0],
      strokeColor: "green"
    });
    distLine2.applyMatrix = false;
    distLine2.pivot = new paper.Point(0, 0);

    let threePoint = new paper.Point(0, 0);
    threePoint.angle = 30;
    threePoint.length = this.lineLength;

    let distLine3 = new paper.Path.Line({
      from: [front, 0],
      to: threePoint,
      strokeColor: "blue"
    });
    distLine3.applyMatrix = false;
    distLine3.pivot = new paper.Point(0, 0);

    this.distLines = [distLine1, distLine2, distLine3];
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
      return this.getLineDistance(window.road, line);
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
