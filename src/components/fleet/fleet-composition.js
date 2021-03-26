import { Component } from '../../lib/component.js';

export default class FleetComposition extends Component {
  constructor(config) {
    super();

    const {
      colony,
      frigate
    } = config;

    this.colony = colony || 0;
    this.frigate = frigate || 0;
  }
}
