import { Component } from '../../lib/component.js';

const FLEET_STATES = {
  'IDLE': 0,
  'MOVING': 1
};

export default class FleetState extends Component {
  constructor(star) {
    super();

    this.colonizeTarget = false;
    this.state = null;
    this.target = star;

    this.setState('IDLE');
  }

  checkState(state) {
    return this.state === FLEET_STATES[state];
  }

  setState(state) {
    this.state = FLEET_STATES[state];
  }
}
