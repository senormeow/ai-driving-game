import paper from "paper";
import neataptic from "neataptic";
import drawGraph from "./graph";
import keyboard from "./keyboard";
import Car from "./car";
import Road from "./road";

import Ai from "./ai";

export default async function(canvas, controls) {
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const CAR_POPULATION = 100;
  var generation = 0;

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
      this
    );
    cars.push(c);
    c.draw();
  }

  var car = new Car(new paper.Point(400, 75), flag, road, undefined, 500, this);
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

  this.selectCallback = function(carId) {
    selectedCar = carId;
    controls.selectedCar(carId);
    drawGraph(cars[selectedCar].brain.graph(200, 200), ".draw");
  };

  function resetCars() {
    for (let i = 0; i < CAR_POPULATION; i++) {
      cars[i].hit();
      cars[i].brain = ai.neat.population[i];
      cars[i].stopped = false;
      cars[i].speed = 3;
    }
  }

  this.reTrain = function() {
    console.log("ReTrain");

    //Reset population with new car
    console.log("Setting population to carId", selectedCar);
    //cars[selectedCar].brain.score = 1;
    var newPopulation = [];
    for (let i = 0; i < ai.neat.elitism; i++) {
      newPopulation.push(cars[selectedCar].brain);
    }
    for (let i = 0; i < ai.neat.popsize - ai.neat.elitism; i++) {
      newPopulation.push(ai.neat.getOffspring());
    }
    ai.neat.population = newPopulation;
    ai.neat.mutate();
    generation++;
    controls.updateGeneration(generation);

    console.log("Mutated Population");
    resetCars();
  };

  this.loadPopulation = function(population) {
    console.log("Apply Population");
    var newPop = [];
    for (let i = 0; i < ai.neat.popsize; i++) {
      let brain = neataptic.Network.fromJSON(population[i]);
      newPop.push(brain);
    }
    ai.neat.population = newPop;
    resetCars();
  };

  this.savePopulation = function() {
    console.log("save population");
    download(
      JSON.stringify(ai.neat.population),
      "carPopulation.json",
      "application/json"
    );
  };

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

  keyboard("a").press = () => {};

  keyboard(" ").press = () => {
    console.log("FOV", car.getFov());
    auto = false;
    car.hit("manual");
  };

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
  };
  return this;
}
