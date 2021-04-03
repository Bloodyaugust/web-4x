import { v4 as uuid } from 'uuid';
import FleetState from "../components/fleet/fleet-state.js";

const EVENTS = Object.freeze({
  GAME_EVENT: 0,
  GAME_START: 1,
  FLEET_ARRIVED: 2,
  PLANET_COLONIZED: 3,
  FLEET_CREATED: 4,
  SYSTEM_CAPTURED: 5,
  FLEET_TARGETED: 6,
  FLEET_COMBAT: 7,
  FLEET_DESTROYED: 8,
  FLEET_DAMAGED: 9,
});

const EVENT_STRINGS = Object.freeze({
  0: 'General event',
  1: 'Game started',
  2: 'Fleet arrived at target',
  3: 'Planet colonized',
  4: 'Fleet created',
  5: 'System captured',
  6: 'Fleet target set',
  7: 'Fleet engaged in combat',
  8: 'Fleet destroyed in combat',
  9: 'Fleet damaged in combat',
});

class GameEvent {
  constructor(type) {
    this.id = uuid();
    this.read = false;
    this.time = new Date();
    this.type = type || EVENTS.GAME_EVENT;
    this.message = EVENT_STRINGS[this.type];
  }
}

class FleetArrivedEvent extends GameEvent {
  constructor(fleet) {
    super(EVENTS.FLEET_ARRIVED);

    this.fleet = fleet.id;
    this.target = fleet.getComponent(FleetState).target.id;
  }
}

class FleetCombatEvent extends GameEvent {
  constructor(fleet, attackedFleets, damage) {
    super(EVENTS.FLEET_COMBAT);

    this.fleet = fleet.id;
    this.position = fleet.getPosition().clone();
    this.attackedFleets = attackedFleets.map(attackedFleet => attackedFleet.id);
    this.damage = damage;
  }
}

class FleetCreatedEvent extends GameEvent {
  constructor(fleet) {
    super(EVENTS.FLEET_CREATED);

    this.fleet = fleet.id;
  }
}

class FleetDamagedEvent extends GameEvent {
  constructor(fleet, attackerFleet, damage) {
    super(EVENTS.FLEET_DAMAGED);

    this.fleet = fleet.id;
    this.position = fleet.getPosition().clone();
    this.attackerFleet = attackerFleet.id;
    this.damage = damage;
  }
}

class FleetDestroyedEvent extends GameEvent {
  constructor(fleet, destroyedByFleet) {
    super(EVENTS.FLEET_DESTROYED);

    this.fleet = fleet.id;
    this.position = fleet.getPosition().clone();
    this.destroyedByFleet = destroyedByFleet;
  }
}

class FleetTargetedEvent extends GameEvent {
  constructor(fleet) {
    super(EVENTS.FLEET_TARGETED);

    this.fleet = fleet.id;
    this.target = fleet.getComponent(FleetState).target.id;
  }
}

class ColonizeEvent extends GameEvent {
  constructor(planet) {
    super(EVENTS.PLANET_COLONIZED);

    this.planet = planet.id;
    this.player = planet.getOwner().id;
  }
}

class SystemCapturedEvent extends GameEvent {
  constructor(system) {
    super(EVENTS.SYSTEM_CAPTURED);

    this.system = system.id;
  }
}

export {
  ColonizeEvent,
  EVENTS,
  FleetArrivedEvent,
  FleetCombatEvent,
  FleetCreatedEvent,
  FleetDamagedEvent,
  FleetDestroyedEvent,
  FleetTargetedEvent,
  SystemCapturedEvent,
  GameEvent
};
