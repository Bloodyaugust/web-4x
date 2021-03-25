import { System } from '../lib/system.js';
import Bank from '../components/bank.js';
import Owner from '../components/owner.js';
import Population from '../components/population.js';

export default class Income extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const entities = this.world.queryIntersection([Population]);

    entities.forEach((entity) => {
      const population = entity.getComponent(Population);
      const owningPlayer = entity.getComponent(Owner).player;

      if (population.amount > 0 && owningPlayer) {
        const playerBank = owningPlayer.getComponent(Bank);

        playerBank.credits += population.amount * deltaTime;
      }
    });
  }
}
