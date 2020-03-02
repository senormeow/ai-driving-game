import React, { Component } from "react";
import ReactDOM from "react-dom";

class Controls extends Component {
  constructor() {
    super();
    this.state = { numCars: 0, selectedCar: 0 };
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
    var file = event.target.files[0];
    var reader = new FileReader();
    console.log(file);
    reader.readAsBinaryString(file);
    var data;
    reader.onload = function(e) {
      data = JSON.parse(e.target.result);
      console.log(data);
    };
  }

  render() {
    return (
      <div>
        <h1> Number of cars: {this.state.numCars} </h1>
        <h1> SelectedCar: {this.state.selectedCar}</h1>
        <h1> Generation: {this.state.generation}</h1>
        <br></br>
        Load File:{" "}
        <input
          type="file"
          id="uploadFile"
          accept="appliction/json"
          onChange={this.fileUpload}
        ></input>
      </div>
    );
  }
}

export default function() {
  const wrapper = document.getElementById("controls");
  return ReactDOM.render(<Controls />, wrapper);
}
