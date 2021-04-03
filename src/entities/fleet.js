import { Entity } from '../lib/entity.js';
import FleetComposition from '../components/fleet/fleet-composition.js';
import FleetState from '../components/fleet/fleet-state.js';
import Owner from '../components/owner.js';
import Position from '../components/position.js';
import Inbox from '../components/inbox.js';
import { FleetCreatedEvent, FleetDamagedEvent, FleetDestroyedEvent, FleetTargetedEvent } from '../objects/events.js';

export default class Fleet extends Entity {
  constructor(player, composition, star) {
    super();

    this.components.push(new FleetComposition(composition));
    this.components.push(new FleetState(star));
    this.components.push(new Owner(player));
    this.components.push(new Position(star.getComponent(Position).position.clone()));

    player.addEvent(new FleetCreatedEvent(this));
  }

  attack(attackingFleet) {
    const fleetComposition = this.getComponent(FleetComposition);
    let attackerPower = attackingFleet.getFleetAttackPower();
    let damage = 0;

    while (attackerPower > 0) {
      attackerPower--;
      damage++;

      if (fleetComposition.frigate > 0) {
        fleetComposition.frigate--;
      } else if (fleetComposition.colony > 0) {
        fleetComposition.colony--;
      } else {
        this.world.removeEntity(this);
        this.getOwner().addEvent(new FleetDestroyedEvent(this, attackingFleet));
        break;
      }
    }

    this.getOwner().addEvent(new FleetDamagedEvent(this, attackingFleet, damage));
    return damage;
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

  canAttack() {
    return this.getComponent(FleetComposition).frigate > 0 && this.checkState('IDLE');
  }

  checkState(state) {
    return this.getComponent(FleetState).checkState(state);
  }

  getFleetAttackPower() {
    const {
      frigate = 0,
    } = this.getComponent(FleetComposition);
    let attackPower = 0;

    attackPower += frigate;

    return attackPower;
  }

  getOwner() {
    return this.getComponent(Owner).player;
  }

  getPosition() {
    return this.getComponent(Position).position;
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
      owner: this.getOwner().id,
      position: this.getComponent(Position).position,
      state: fleetState.state,
      target: fleetState.target ? fleetState.target.id : ''
    };
  }
}
