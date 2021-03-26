import { System } from '../lib/system.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';

export default class Colonization extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const entities = this.world.queryIntersection([FleetState]);

    entities.forEach((entity) => {
      const fleetComposition = entity.getComponent(FleetComposition);
      const fleetState = entity.getComponent(FleetState);
      
      if (fleetState.colonizeTarget && fleetState.checkState('IDLE') && fleetComposition.colony > 0) {
        const uncolonizedPlanets = fleetState.target.getUncolonizedPlanets();
        let colonizedPlanets = 0;

        while (fleetComposition.colony > 0 && colonizedPlanets < uncolonizedPlanets.length) {
          uncolonizedPlanets[colonizedPlanets].colonize();
          fleetComposition.colony--;
          colonizedPlanets++;
        }
      }
    });
  }
}
