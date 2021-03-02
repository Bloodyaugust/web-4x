import ape from 'ape-ecs';
import { clamp } from '../lib/math.js';

class PopulationGrowth extends ape.System {
  init() {
    this.mainQuery = this.createQuery().fromAll('Population').persist();
  }

  update(tick) {
    const planets = this.mainQuery.execute();
    let populationGrown = 0;

    for (const planet of planets) {
      const population = planet.getOne('Population');
      let newPopulation = population.amount + (0.001 * population.amount);
      newPopulation = clamp(newPopulation, newPopulation, planet.c.data.size * 1000);

      populationGrown += newPopulation - population.amount;
      population.amount = newPopulation;
    }

    // console.log(`Grew populations by: ${populationGrown} this tick`);
  }
}

export { PopulationGrowth };
