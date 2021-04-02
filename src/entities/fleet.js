import { Entity } from '../lib/entity.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Owner from '../components/owner.js';
import Position from '../components/position.js';
import Inbox from '../components/inbox.js';
import { FleetCreatedEvent, FleetTargetedEvent } from '../objects/events.js';

export default class Fleet extends Entity {
  constructor(player, composition, star) {
    super();

    this.components.push(new FleetComposition(composition));
    this.components.push(new FleetState(star));
    this.components.push(new Owner(player));
    this.components.push(new Position(star.getComponent(Position).position.clone()));

    player.addEvent(new FleetCreatedEvent(this));
  }

  buyShips(ships) {
    const player = this.getOwner();
    const fleetComposition = this.getComponent(FleetComposition);
    const {
      colony = 0,
      frigate = 0
    } = ships;
    let totalCost = 0;

    totalCost += colony * 1000;
    totalCost += frigate * 15;

    if (player.spendCredits(totalCost)) {
      fleetComposition.colony += colony;
      fleetComposition.frigate += frigate;

      return true;
    }

    return false;
  }

  getOwner() {
    return this.getComponent(Owner).player;
  }

  isIdle() {
    return this.getComponent(FleetState).checkState('IDLE');
  }

  setColonizing(colonize) {
    this.getComponent(FleetState).colonizeTarget = colonize;
  }

  target(star) {
    this.getComponent(FleetState).target = star;
    this.getOwner().addEvent(new FleetTargetedEvent(this));
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
      position: this.getComponent(Position).position,
      state: fleetState.state,
      target: fleetState.target ? fleetState.target.id : ''
    };
  }
}
