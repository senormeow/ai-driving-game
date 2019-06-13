import paper from "paper";
import { promisify } from "util";

let loadSvg = url => {
  return new Promise((resolve, reject) => {
    new paper.Item().importSVG(url, item => {
      resolve(item);
    });
  });
};
export default async () => {
  let road = await loadSvg("assets/main_track-split.svg");
  console.log(road);

  var roadParts = new paper.CompoundPath();
  roadParts.copyContent(road.children[1].children[0]);
  //debugger;

  roadParts.fillColor = "#999999";
  //roadParts.strokeColor = "red";

  var innerRoad = new paper.Path();
  innerRoad.copyContent(roadParts.children[1]);
  innerRoad.strokeColor = "black";

  var outterRoad = new paper.Path();
  outterRoad.copyContent(roadParts.children[0]);
  outterRoad.strokeColor = "black";
  return { roadParts, innerRoad, outterRoad };
};
// new paper.Item().importSVG("assets/main_track-split.svg", item => {
//   road = item;
//console.log("road", road);
//window.road = road;

//console.log(myPath);
// });
