import { System } from '../lib/system.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Position from '../components/position.js';
import Victor from 'victor';
import { FleetArrivedEvent } from '../objects/events.js';

const fleetSpeed = 2.5;

export default class FleetMovement extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const fleets = this.world.queryIntersection([FleetState]);

    fleets.filter((fleet) => {
      const fleetComposition = fleet.getComponent(FleetComposition);
      const {
        colony = 0,
        frigate = 0
      } = fleetComposition;
      let shipCount = 0;

      shipCount += colony;
      shipCount += frigate;

      return shipCount > 0;
    }).forEach((fleet) => {
      const fleetState = fleet.getComponent(FleetState);
      const owningPlayer = fleet.getOwner();
      const position = fleet.getComponent(Position).position;
      const targetPosition = fleetState.target.getComponent(Position).position;
      const directionVector = targetPosition.clone().subtract(position).normalize();
      const distanceToTarget = targetPosition.distance(position);
      const moveDistance = fleetSpeed * deltaTime;
      
      if (fleetState.checkState('IDLE') && distanceToTarget > 0.1) {
        fleetState.setState('MOVING');
      }

      if (fleetState.checkState('MOVING')) {
        if (distanceToTarget > moveDistance) {
          position.add(directionVector.multiply(new Victor(moveDistance, moveDistance)));
        } else {
          fleet.getComponent(Position).position = targetPosition.clone();
          fleetState.setState('IDLE');
          owningPlayer.addEvent(new FleetArrivedEvent(fleet));
        }
      }

      if (distanceToTarget === 0) {
        fleetState.target.own(owningPlayer);
      }
    });
  }
}
