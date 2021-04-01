import { v4 as uuid } from 'uuid';
import FleetState from "../components/fleet/fleet-state.js";
import Owner from "../components/owner.js";

const EVENTS = Object.freeze({
  GAME_EVENT: 0,
  GAME_START: 1,
  FLEET_ARRIVED: 2,
  PLANET_COLONIZED: 3,
});

const EVENT_STRINGS = Object.freeze({
  0: 'General event',
  1: 'Game started',
  2: 'Fleet arrived at target',
  3: 'Planet colonized',
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

class FleetEvent extends GameEvent {
  constructor(fleet) {
    super(EVENTS.FLEET_ARRIVED);

    this.fleet = fleet.id;
    this.target = fleet.getComponent(FleetState).target.id;
  }
}

class ColonizeEvent extends GameEvent {
  constructor(planet) {
    super(EVENTS.PLANET_COLONIZED);

    this.planet = planet.id;
    this.player = planet.getComponent(Owner).player.id;
  }
}

export {
  ColonizeEvent,
  EVENTS,
  FleetEvent,
  GameEvent
};
