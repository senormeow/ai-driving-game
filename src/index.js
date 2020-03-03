import Engine from "./engine";
import Controls from "./controls";

(async () => {
  var canvas = document.getElementById("canv");
  var controlsElem = document.getElementById("controls");
  var controls = Controls(controlsElem);
  var engine = await new Engine(canvas, controls);
  console.log(engine);
  controls.setEngine(engine);
})();
