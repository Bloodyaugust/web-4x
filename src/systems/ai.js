import AI from '../components/ai.js';
import Position from '../components/position.js';
import Fleet from '../entities/fleet.js';
import { System } from '../lib/system.js';
import { queryUnownedStars } from '../queries.js';

export default class AISystem extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const aiPlayers = this.world.queryIntersection([AI]);

    aiPlayers.forEach((player) => {
      const ai = player.getComponent(AI);
      const credits = player.getCredits();
      const fleets = player.getFleets();
      const stars = player.getStars();
      
      if (fleets.length && fleets[0].isIdle()) {
        const fleetPosition = fleets[0].getComponent(Position).position;
        const closestUnownedStar = queryUnownedStars(this.world).sort((a, b) => {
          return a.getDistance(fleetPosition) - b.getDistance(fleetPosition);
        })[0];

        if (credits >= 1000 && closestUnownedStar) {
          fleets[0].buyShips({
            colony: 1
          });
          fleets[0].target(closestUnownedStar);
        }
      }

      if (!fleets.length && stars.length) {
        const newFleet = this.world.addEntity(new Fleet(player, {
          colony: 0,
          frigate: 1,
        }, stars[0]));
      }
    });
  }
}
