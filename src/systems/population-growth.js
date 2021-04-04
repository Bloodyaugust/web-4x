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
      const populationGrown = (0.001 * population.amount) * deltaTime;
      const owningPlayer = planet.getOwner();
      let newPopulation = population.amount + populationGrown;
      newPopulation = clamp(newPopulation, newPopulation, 1000); // Cap based on planet size

      if (owningPlayer && !owningPlayer.isDefeated()) {
        owningPlayer.addScore(newPopulation - population.amount);
      }
      population.amount = newPopulation;
    });
  }
}
