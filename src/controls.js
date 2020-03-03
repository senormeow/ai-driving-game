import React, { Component } from "react";
import ReactDOM from "react-dom";

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = { numCars: 0, selectedCar: 0 };
  }

  setEngine(engine) {
    console.log("engine", engine);
    this.engine = engine;
  }

  updateCars(numCars) {
    this.setState({ numCars: numCars });
  }

  selectedCar(carId) {
    this.setState({ selectedCar: carId });
  }

  updateGeneration(g) {
    this.setState({ generation: g });
  }

  fileUpload(event) {
    var loadPopulation = this.engine.loadPopulation;
    var file = event.target.files[0];
    var reader = new FileReader();
    console.log(file);
    reader.readAsBinaryString(file);
    var data;
    reader.onload = function(e) {
      data = JSON.parse(e.target.result);
      loadPopulation(data);
    };
  }

  reRrain(event) {
    this.engine.reTrain();
  }

  savePopulation(event) {
    this.engine.savePopulation();
  }

  render() {
    return (
      <div>
        <h1> Number of cars: {this.state.numCars} </h1>
        <h1> SelectedCar: {this.state.selectedCar}</h1>
        <h1> Generation: {this.state.generation}</h1>
        <br></br>
        Load Population:{" "}
        <input
          type="file"
          id="uploadFile"
          accept="appliction/json"
          onChange={this.fileUpload.bind(this)}
        ></input>
        <div>
          <button onClick={this.reRrain.bind(this)}>Re-Train</button>
          <button onClick={this.savePopulation.bind(this)}>
            Save Population
          </button>
        </div>
      </div>
    );
  }
}

export default function(controlsElem) {
  return ReactDOM.render(<Controls />, controlsElem);
}
