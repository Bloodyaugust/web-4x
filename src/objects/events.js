const EVENTS = Object.freeze({
  GAME_EVENT: 0,
  GAME_START: 1,
  FLEET_ARRIVED: 2
});

const EVENT_STRINGS = Object.freeze({
  0: 'General event',
  1: 'Game started',
  2: 'Fleet arrived at target'
});

class GameEvent {
  constructor(type) {
    this.read = false;
    this.time = new Date();
    this.type = type || EVENTS.GAME_EVENT;
  }
}

class FleetEvent extends GameEvent {
  constructor(fleet, type) {
    super();

    this.fleet = fleet.id;
    this.type = type;
  }
}

export {
  EVENTS,
  FleetEvent,
  GameEvent
};
