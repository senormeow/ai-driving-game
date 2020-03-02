import paper from "paper";
import keyboard from "./keyboard";
import Car from "./car";
import Road from "./road";
import Controls from "./controls";
import Ai from "./ai";

(async () => {
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const CAR_POPULATION = 100;
  var generation = 0;

  var canvas = document.getElementById("canv");
  var controls = Controls();
  controls.updateCars(CAR_POPULATION);

  paper.setup(canvas);
  //paper.install(window);
  /* global view */

  let flag = new paper.Path.Rectangle(
    new paper.Rectangle(new paper.Point(500, 500), new paper.Point(600, 600))
  );

  flag.strokeColor = "black";
  flag.fillColor = "blue";

  var road = await Road();
  console.log(road);

  var selectedCar = 0;

  var selectCallback = function(carId) {
    selectedCar = carId;
    controls.selectedCar(carId);
  };

  var ai = new Ai(CAR_POPULATION);
  console.log(ai.neat);

  var cars = [];
  for (let i = 0; i < CAR_POPULATION; i++) {
    let c = new Car(
      new paper.Point(400, 75),
      flag,
      road,
      ai.neat.population[i],
      i,
      selectCallback
    );
    cars.push(c);
    c.draw();
  }

  var car = new Car(
    new paper.Point(400, 75),
    flag,
    road,
    undefined,
    500,
    selectCallback
  );
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

  keyboard("t").press = async () => {
    console.log("ReTrain");

    //Reset population with new car
    console.log("Setting population to carId", selectedCar);
    cars[selectedCar].brain.score = 1;
    var newPopulation = [];
    for (var i = 0; i < ai.neat.elitism; i++) {
      newPopulation.push(cars[selectedCar].brain);
    }
    for (var i = 0; i < ai.neat.popsize - ai.neat.elitism; i++) {
      newPopulation.push(ai.neat.getOffspring());
    }
    ai.neat.population = newPopulation;
    ai.neat.mutate();
    generation++;
    controls.updateGeneration(generation);

    console.log("Mutated Population");
    for (let i = 0; i < CAR_POPULATION; i++) {
      cars[i].hit();
      cars[i].brain = ai.neat.population[i];
      cars[i].stopped = false;
      cars[i].speed = 3;
    }

    auto = true;
  };

  keyboard("s").press = () => {
    console.log("save population");
    download(
      JSON.stringify(ai.neat.population),
      "carPopulation.json",
      "application/json"
    );
  };

  // paper.view.onMouseDown = function(event) {
  //   var hit = car.carGroup.hitTest(event.point);
  //   console.log(hit.item.parent.carId);
  // };

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

  await cars.forEach(c => {
    c.speed = 3;
  });

  paper.view.onFrame = async function(event) {
    car.draw();
    await cars.forEach(c => {
      c.draw();
      c.aiSteer();
    });

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
