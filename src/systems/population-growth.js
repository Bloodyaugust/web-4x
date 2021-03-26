import { clamp } from '../lib/math.js';
import { System } from '../lib/system.js';
import Population from '../components/population.js';

export default class PopulationGrowth extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const planets = this.world.queryIntersection([Population]);

    planets.forEach((planet) => {
      const population = planet.getComponent(Population);
      let newPopulation = population.amount + ((0.001 * population.amount) * deltaTime);
      newPopulation = clamp(newPopulation, newPopulation, 1000); // Cap based on planet size

      population.amount = newPopulation;
    });
  }
}
