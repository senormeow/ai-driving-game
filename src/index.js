import paper from "paper";
import keyboard from "./keyboard";
import Car from "./car";
import Road from "./road";

import Ai from "./ai";

(async () => {
  var CAR_POPULATION = 100;

  var canvas = document.getElementById("canv");

  paper.setup(canvas);
  //paper.install(window);
  /* global view */

  // var path = new paper.Path();
  // path.strokeColor = "black";
  // var start = new paper.Point(700, 100);
  // path.moveTo(start);
  // path.lineTo(start.add([50, 400]));

  // Draw the view now:
  // paper.view.draw();
  // console.log(paper.view.bounds);

  // console.log('ai', ai());

  let flag = new paper.Path.Rectangle(
    new paper.Rectangle(new paper.Point(500, 500), new paper.Point(600, 600))
  );

  flag.strokeColor = "black";
  flag.fillColor = "blue";

  var road = await Road();
  console.log(road);

  var ai = new Ai(CAR_POPULATION);
  console.log(ai.neat);

  var cars = [];
  for (var i = 0; i < CAR_POPULATION; i++) {
    let c = new Car(new paper.Point(400, 75), flag, road, ai.neat.population[i]);
    cars.push(c);
    c.draw();
  }

  var car = new Car(new paper.Point(400, 75), flag, road);
  let trainingData = [];
  let auto = false;

  function addPoint(value) {
    if (car.speed > 0) {
      fov = car.getFov();
      let td = { input: fov, output: [value] };
      console.log(td);
      trainingData.push(td);
    }
  }

  keyboard("ArrowLeft").press = () => {
    addPoint(0.9);
    car.left();
  };

  keyboard("ArrowRight").press = () => {
    addPoint(0.1);
    car.right();
  };

  keyboard("ArrowUp").press = () => {
    car.foward();
  };

  keyboard("ArrowDown").press = () => {
    car.break();
  };

  keyboard(" ").press = () => {
    console.log("FOV", car.getFov());
    auto = false;
    car.hit("manual");
  };

  keyboard("a").press = () => {
    console.log("Auto Start");
    auto = true;
  };

  // keyboard("t").press = () => {
  //   console.log(trainingData);
  //   let result = myNetwork.train(trainingData, {
  //     log: 10,
  //     error: 0.03,
  //     iterations: 1000,
  //     rate: 0.3
  //   });
  //   console.log(result);
  // };

  //let np = path.getNearestPoint(car.position);
  // let carvec = new paper.Point(car.position);
  // carvec.length = 5;
  // carvec.angle = 88;
  // console.log("carvec", carvec);

  //console.log("np", np);
  // var line = new paper.Path.Line(carvec, car.position);
  // line.strokeColor = "black";

  //window.car = car.carGroup;
  window.road = road;

  // car.foward();

  let fov = [0, 0, 0];

  setInterval(() => {
    if (car.speed > 0) {
      addPoint(0.5);
    }
  }, 500);

  await cars.forEach((c) => {c.foward()})

  paper.view.onFrame = async function(event) {
    car.draw();
    await cars.forEach((c) => {c.draw(); c.aiSteer()});


    if (auto) {
      fov = car.getFov();
      //let direction = myNetwork.activate(fov);
      //console.log(direction);
      //car.steer(steering);
      //steering = car.getSteering();
      //car.steer(steering);
    }

    // if (fov[2] < 0.50) {
    //   car.left();
    // }

    //console.log(inte);
  };
})();
