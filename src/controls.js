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

  render() {
    return (
      <div>
        <h1> Number of cars: {this.state.numCars} </h1>
        <h1> SelectedCar: {this.state.selectedCar}</h1>
      </div>
    );
  }
}

export default function() {
  const wrapper = document.getElementById("controls");
  return ReactDOM.render(<Controls />, wrapper);
}
