import { System } from '../lib/system.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Position from '../components/position.js';
import Victor from 'victor';
import Owner from '../components/owner.js';
import Inbox from '../components/inbox.js';
import { FleetArrivedEvent } from '../objects/events.js';

export default class FleetMovement extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const fleets = this.world.queryIntersection([FleetState]);

    fleets.filter((fleet) => {
      const fleetComposition = fleet.getComponent(FleetComposition);
      let shipCount = 0;

      shipCount += fleetComposition.colony;
      shipCount += fleetComposition.frigate;

      return shipCount > 0;
    }).forEach((fleet) => {
      const fleetState = fleet.getComponent(FleetState);
      const owningPlayer = fleet.getComponent(Owner).player;
      const position = fleet.getComponent(Position).position;
      const targetPosition = fleetState.target.getComponent(Position).position;
      const directionVector = targetPosition.clone().subtract(position).normalize();
      const distanceToTarget = targetPosition.distance(position);
      const moveDistance = 15 * deltaTime;
      
      if (fleetState.checkState('IDLE') && distanceToTarget > 0.1) {
        fleetState.setState('MOVING');
      }

      if (fleetState.checkState('MOVING')) {
        if (distanceToTarget > moveDistance) {
          position.add(directionVector.multiply(new Victor(moveDistance, moveDistance)));
        } else {
          fleet.getComponent(Position).position = targetPosition.clone();
          fleetState.setState('IDLE');
          fleetState.target.own(owningPlayer);
          owningPlayer.addEvent(new FleetArrivedEvent(fleet));
        }
      }
    });
  }
}
