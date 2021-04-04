import { System } from '../lib/system.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import { ColonizeEvent } from '../objects/events.js';

export default class Colonization extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const entities = this.world.queryIntersection([FleetState]);

    entities.forEach((entity) => {
      const fleetComposition = entity.getComponent(FleetComposition);
      const fleetState = entity.getComponent(FleetState);
      
      if (entity.isAtTarget() && fleetComposition.colony > 0 && fleetState.target.getOwner() === entity.getOwner()) {
        const uncolonizedPlanets = fleetState.target.getUncolonizedPlanets();
        let colonizedPlanets = 0;

        while (fleetComposition.colony > 0 && colonizedPlanets < uncolonizedPlanets.length) {
          uncolonizedPlanets[colonizedPlanets].colonize();
          fleetComposition.colony--;
          entity.getOwner().addEvent(new ColonizeEvent(uncolonizedPlanets[colonizedPlanets]));
          entity.getOwner().addScore(100)
          colonizedPlanets++;
        }
      }
    });
  }
}
