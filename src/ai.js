import carrot from "@liquid-carrot/carrot";
//let carrot = require("@liquid-carrot/carrot");
//import neataptic from "neataptic";
//import neataptic from "neataptic";

class Ai {
  constructor(popsize) {
    var MUTATION_RATE = 0.1;
    var ELITISM = Math.round(0.6 * popsize);
    var Methods = carrot.methods;
    this.neat = new carrot.Neat(3, 1, null, {
      mutation: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN,
      ],
      population_size: popsize,
      mutation_rate: MUTATION_RATE,
      elitism: ELITISM,
    });
  }
}

export default Ai;
