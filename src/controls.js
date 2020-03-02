import React, { Component } from "react";
import ReactDOM from "react-dom";

class Controls extends Component {
  constructor(props) {
    super(props);
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
    var loadPopulation = this.props.loadPopulation;
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
      </div>
    );
  }
}

export default function(loadPopulation) {
  const wrapper = document.getElementById("controls");
  return ReactDOM.render(<Controls loadPopulation={loadPopulation} />, wrapper);
}
