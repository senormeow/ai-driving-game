import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { ELITISM_RATIO, RANDOM_INJECTION_RATIO, MUTATION_RATE, MUTATION_AMOUNT } from "./ai";

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numCars: 0,
      selectedCar: null,
      generation: 0,
      alive: 0,
      crashed: 0,
      bestDist: 0,
    };
  }

  setEngine(engine) {
    this.engine = engine;
  }

  updateCars(numCars) {
    this.setState({ numCars, alive: numCars, crashed: 0 });
  }

  selectedCar(carId) {
    this.setState({ selectedCar: carId });
  }

  updateGeneration(generation) {
    this.setState({ generation });
  }

  updateStats({ alive, crashed, bestDist }) {
    this.setState({ alive, crashed, bestDist });
  }

  fileUpload(event) {
    var loadPopulation = this.engine.loadPopulation;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      loadPopulation(JSON.parse(e.target.result));
    };
  }

  render() {
    const { numCars, selectedCar, generation, alive, crashed, bestDist } = this.state;
    const aliveRatio = numCars > 0 ? (alive / numCars) * 100 : 0;

    return (
      <>
        {/* Header */}
        <div className="sidebar-header">
          <h1>AI Driving</h1>
          <div className="subtitle">Neuroevolution Simulation</div>
        </div>

        {/* Generation / run info */}
        <div className="stat-section">
          <div className="stat-section-title">Run Info</div>
          <div className="stat-row">
            <span className="stat-label">Generation</span>
            <span className="stat-value generation">{generation}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Population</span>
            <span className="stat-value">{numCars}</span>
          </div>
        </div>

        {/* Live stats */}
        <div className="stat-section">
          <div className="stat-section-title">This Generation</div>
          <div className="stat-row">
            <span className="stat-label">Alive</span>
            <span className="stat-value alive">{alive}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Crashed</span>
            <span className="stat-value crashed">{crashed}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Best Distance</span>
            <span className="stat-value distance">{Math.round(bestDist)}</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${aliveRatio}%` }}
            />
          </div>
        </div>

        {/* Selected car */}
        <div className="stat-section">
          <div className="stat-section-title">Selected Car</div>
          {selectedCar !== null ? (
            <div className="selected-car-badge">
              <span className="dot" />
              Car #{selectedCar}
            </div>
          ) : (
            <span className="stat-label">Click a car to select</span>
          )}
        </div>

        {/* Mutation config (read-only display) */}
        <div className="stat-section">
          <div className="stat-section-title">Mutation Config</div>
          <div className="mutation-grid">
            <div className="mutation-chip">
              <span className="chip-label">Rate</span>
              <span className="chip-value">{(MUTATION_RATE * 100).toFixed(0)}%</span>
            </div>
            <div className="mutation-chip">
              <span className="chip-label">Ops / member</span>
              <span className="chip-value">{MUTATION_AMOUNT}</span>
            </div>
            <div className="mutation-chip">
              <span className="chip-label">Elitism</span>
              <span className="chip-value">{(ELITISM_RATIO * 100).toFixed(0)}%</span>
            </div>
            <div className="mutation-chip">
              <span className="chip-label">Random inject</span>
              <span className="chip-value">{(RANDOM_INJECTION_RATIO * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="action-section">
          <button className="btn btn-primary" onClick={() => this.engine.reTrain()}>
            Re-Train Generation
          </button>
          <button className="btn btn-secondary" onClick={() => this.engine.savePopulation()}>
            Save Population
          </button>
          <label className="upload-label" htmlFor="uploadFile">
            Load Population (JSON)
          </label>
          <input
            type="file"
            id="uploadFile"
            accept="application/json"
            onChange={this.fileUpload.bind(this)}
          />
        </div>
      </>
    );
  }
}

export default function (controlsElem) {
  return ReactDOM.render(<Controls />, controlsElem);
}
