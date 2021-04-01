import { System } from '../lib/system.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Owner from '../components/owner.js';
import Inbox from '../components/inbox.js';
import { ColonizeEvent } from '../objects/events.js';
import Position from '../components/position.js';

export default class Colonization extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const entities = this.world.queryIntersection([FleetState]);

    entities.forEach((entity) => {
      const fleetComposition = entity.getComponent(FleetComposition);
      const fleetState = entity.getComponent(FleetState);
      const position = entity.getComponent(Position).position;
      
      if (fleetState.colonizeTarget && fleetState.checkState('IDLE') && position.distance(fleetState.target.getComponent(Position).position) <= 0.1 && fleetComposition.colony > 0) {
        const uncolonizedPlanets = fleetState.target.getUncolonizedPlanets();
        let colonizedPlanets = 0;

        while (fleetComposition.colony > 0 && colonizedPlanets < uncolonizedPlanets.length) {
          uncolonizedPlanets[colonizedPlanets].colonize();
          fleetComposition.colony--;
          entity.getComponent(Owner).player.addEvent(new ColonizeEvent(uncolonizedPlanets[colonizedPlanets]));
          colonizedPlanets++;
        }
      }
    });
  }
}
