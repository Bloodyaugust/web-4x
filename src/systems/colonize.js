import ape from 'ape-ecs';
import { default as Victor } from 'victor';

class Colonize extends ape.System {
  init() {
    this.planets = this.createQuery().fromAll('Planet');
  }

  colonize(star) {
    const planets = this.planets.execute();

    for (const planet of planets) {
      if (planet.c.data.star === star.id) {
        if (!planet.has('Population')) {
          planet.addComponent({
            type: 'Population'
          });
        }

        const population = planet.getOne('Population');
        population.colonize();

        population.update();
      }
    }
  }
}

export { Colonize };
