import neataptic from "neataptic";

// --- Tuning constants ---------------------------------------------------
// Adjust these to change how the population evolves each generation.

/** Number of cars in the population. */
export const POP_SIZE = 100;

/** Fraction of the population kept as unmodified elite copies. */
export const ELITISM_RATIO = 0.1; // 10 cars preserved exactly

/**
 * Fraction of the population replaced with brand-new random brains each
 * generation. Keeps structural diversity alive and prevents premature
 * convergence on a local optimum.
 */
export const RANDOM_INJECTION_RATIO = 0.05; // 5 fresh random brains

/**
 * Probability that any single offspring member is mutated.
 * Higher = more exploration; lower = more exploitation.
 */
export const MUTATION_RATE = 0.8;

/**
 * Number of independent mutation ops applied per member when it is mutated.
 * Higher values produce larger structural jumps each generation.
 */
export const MUTATION_AMOUNT = 2;
// -----------------------------------------------------------------------

class Ai {
  constructor(popsize) {
    var Methods = neataptic.methods;

    this.neat = new neataptic.Neat(3, 1, null, {
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
      popsize: popsize,
      mutationRate: MUTATION_RATE,
      mutationAmount: MUTATION_AMOUNT,
      elitism: Math.round(ELITISM_RATIO * popsize),
    });
  }
}

export default Ai;
