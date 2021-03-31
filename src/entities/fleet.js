import { Entity } from '../lib/entity.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Owner from '../components/owner.js';

export default class Fleet extends Entity {
  constructor(player, composition) {
    super();

    this.components.push(new FleetComposition(composition));
    this.components.push(new FleetState());
    this.components.push(new Owner(player));
  }

  setColonizing(colonize) {
    this.getComponent(FleetState).colonizeTarget = colonize;
  }

  target(star) {
    this.getComponent(FleetState).target = star;
  }

  toJSON() {
    const fleetComposition = this.getComponent(FleetComposition);
    const fleetState = this.getComponent(FleetState);

    return {
      id: this.id,
      composition: {
        colony: fleetComposition.colony,
        frigate: fleetComposition.frigate,
      },
      state: fleetState.state
    };
  }
}
