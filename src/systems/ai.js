import AI from '../components/ai.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import Position from '../components/position.js';
import Fleet from '../entities/fleet.js';
import { System } from '../lib/system.js';
import { queryClosestEnemyOrUnownedStar, queryClosestOwnedStar, queryClosestOwnedStarWithUncolonizedPlanets } from '../queries.js';

export default class AISystem extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const aiPlayers = this.world.queryIntersection([AI]).filter(player => !player.getScore().defeated && player.getStars().length !== 0);

    aiPlayers.forEach((player) => {
      const ai = player.getComponent(AI);
      const credits = player.getCredits();
      const fleets = player.getFleets();
      const stars = player.getStars();
      let colonizationFleet = this.world.entities[ai.colonizationFleet];
      let combatFleet = this.world.entities[ai.combatFleet];

      // Ensure we have a combat fleet created and designated
      if (!combatFleet) {
        const unassignedFleets = player.getAIUnassignedFleets();

        if (unassignedFleets.length) {
          ai.combatFleet = unassignedFleets[0].id;
          combatFleet = unassignedFleets[0];
        } else {
          const newFleet = this.world.addEntity(new Fleet(player, {}, stars[0]));
          ai.combatFleet = newFleet.id;
          combatFleet = newFleet;
        }
      }

      // Ensure we have a colonization fleet created and designated
      if (!colonizationFleet) {
        const unassignedFleets = player.getAIUnassignedFleets();

        if (unassignedFleets.length) {
          ai.colonizationFleet = unassignedFleets[0].id;
          colonizationFleet = unassignedFleets[0];
        } else {
          const newFleet = this.world.addEntity(new Fleet(player, {}, stars[0]));
          ai.colonizationFleet = newFleet.id;
          colonizationFleet = newFleet;
        }
      }

      // If combat fleet is below 5 frigates, set target to closest owned star, and once there, buy frigates until we're back to 5
      const combatFleetComposition = combatFleet.getComponent(FleetComposition);
      if (combatFleetComposition.frigate < 5) {
        const resupplyStar = queryClosestOwnedStar(this.world, combatFleet);

        if (combatFleet.getTarget() !== resupplyStar) {
          combatFleet.target(resupplyStar);
        }

        if (combatFleet.isAtTarget()) {
          while (combatFleetComposition.frigate < 5 && combatFleet.buyShips({
            frigate: 1
          })) { }
        }
      } else {
        // If combat fleet is at our target and we own it, find closest star we don't own and target it
        if (combatFleet.isAtTarget() && combatFleet.getTarget().getOwner() === player) {
          const newTarget = queryClosestEnemyOrUnownedStar(this.world, combatFleet);

          if (newTarget) {
            combatFleet.target(newTarget);
          }
        }
      }

      // If colonization fleet is below 1 frigate and 2 colony ships, set target to closest owned star, and once there, buy ships until satisfied
      const colonizationFleetComposition = colonizationFleet.getComponent(FleetComposition);
      if (colonizationFleetComposition.frigate < 1 || colonizationFleetComposition.colony < 2) {
        const resupplyStar = queryClosestOwnedStar(this.world, colonizationFleet);

        if (colonizationFleet.getTarget() !== resupplyStar) {
          colonizationFleet.target(resupplyStar);
        }

        if (colonizationFleet.isAtTarget()) {
          while (colonizationFleetComposition.frigate < 1 && colonizationFleet.buyShips({
            frigate: 1
          })) { }
          while (colonizationFleetComposition.colony < 2 && colonizationFleet.buyShips({
            colony: 1
          })) { }
        }
      } else {
        // If colonization fleet is at our target and we own it, find closest star we own with uncolonized planets and target it
        if (colonizationFleet.isAtTarget() && colonizationFleet.getTarget().getOwner() === player) {
          const newTarget = queryClosestOwnedStarWithUncolonizedPlanets(this.world, colonizationFleet);

          if (newTarget) {
            colonizationFleet.target(newTarget);
          }
        }
      }

      // If we have more than 5k credits in the bank, spend to below 5k on more frigates for our fleets
      while (player.getCredits() >= 5000 && (combatFleet.buyShips({ frigate: 1 }) || colonizationFleet.buyShips({ frigate: 1 }))) { }
    });
  }
}
