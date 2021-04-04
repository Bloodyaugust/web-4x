import { System } from '../lib/system.js';
import Bank from '../components/bank.js';
import Population from '../components/population.js';

export default class Income extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const entities = this.world.queryIntersection([Population]);

    entities.forEach((entity) => {
      const population = entity.getComponent(Population);
      const owningPlayer = entity.getOwner();

      if (population.amount > 0 && owningPlayer && !owningPlayer.isDefeated()) {
        const playerBank = owningPlayer.getComponent(Bank);
        const income = population.amount * 100 * deltaTime;

        playerBank.credits += income;
        owningPlayer.addScore(income / 5000);
      }
    });
  }
}
