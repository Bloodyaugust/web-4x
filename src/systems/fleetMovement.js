import ape from 'ape-ecs';
import { default as Victor } from 'victor';
import { EVENTS, FleetEvent } from '../objects/events.js';

class FleetMovement extends ape.System {
  init() {
    this.mainQuery = this.createQuery().fromAll('Fleet').persist();
    this.fleetMoveSpeed = 0.1;
  }

  update(tick) {
    this.mainQuery.execute().forEach((entity) => {
      const fleetData = entity.c.data;
      const fleetPosition = entity.c.position;

      if (fleetData.target.c.position.vector.distance(fleetPosition.vector) > 0) {
        const directionVector = fleetData.target.c.position.vector.clone().subtract(fleetPosition.vector).normalize();

        if (fleetData.target.c.position.vector.distance(fleetPosition.vector) <= this.fleetMoveSpeed) {
          const owningPlayer = entity.c.owner.owner;

          fleetPosition.vector = fleetData.target.c.position.vector.clone();

          this.world.getEntity('events').c.events.events.push(new FleetEvent(entity, EVENTS.FLEET_ARRIVED));
          owningPlayer.c.events.events.push(new FleetEvent(entity, EVENTS.FLEET_ARRIVED));
        } else {
          fleetPosition.vector.add(directionVector.multiply(new Victor(this.fleetMoveSpeed, this.fleetMoveSpeed)));
        }
      }
    });
  }
}

export { FleetMovement };
