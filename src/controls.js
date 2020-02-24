import React, { Component } from "react";
import ReactDOM from "react-dom";

class Controls extends Component {
    constructor() {
      super();
      this.state = {numCars:0}

    }
  
    updateCars(numCars) {
        this.setState({numCars: numCars});
    }  

    render() {
      return (
      <h1> { this.state.numCars } </h1>
      );
    }
  }

export default function() {
   const wrapper = document.getElementById("controls");
   return ReactDOM.render(<Controls />, wrapper);
}