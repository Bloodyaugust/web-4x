import ape from 'ape-ecs';
import { Fleet } from '../entities/fleet.js';

class AISystem extends ape.System {
  init() {
    this.aiQuery = this.createQuery().fromAll('AI').persist();
    this.unownedStarQuery = this.createQuery().fromAll('Star').not('Owned').persist();
  }

  update(tick) {
    this.aiQuery.execute().forEach((entity) => {
      const ai = entity.getOne('AI');
      const playerData = entity.c.data;
      const ownedFleets = [...this.createQuery().fromAll('Fleet').fromReverse(entity, 'Owner').execute()];

      // Create new fleet in home system if none exists
      if (!ownedFleets.length) {
        const newFleet = this.world.createEntity(Fleet(entity, entity.c.data.ownedStars[0]));
        ownedFleets.push(newFleet);
      }

      const fleetData = ownedFleets[0].c.data;
      const fleetPosition = ownedFleets[0].c.position;

      // Add Colony ship to fleet if there isn't one
      if (!fleetData.colony) {
        fleetData.colony = 1;
        fleetData.update();
      }

      // Are we at our target star? If so, colonize and re-target
      if (fleetData.target.c.position.vector.distance(fleetPosition.vector) <= 0.1) {
        // Own and colonize target system
        playerData.ownStar(fleetData.target);
        global.colonizeSystem.colonize(fleetData.target);
        fleetData.colony -= 1;

        // Find the closest un-owned Star and target it
        fleetData.target = [...this.unownedStarQuery.execute()].sort((a, b) => {
          return a.c.position.vector.distanceSq(fleetPosition.vector) - b.c.position.vector.distanceSq(fleetPosition.vector);
        })[0];
        fleetData.update();
      }
    });
  }
}

export { AISystem };
