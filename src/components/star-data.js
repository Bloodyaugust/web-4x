import { Component } from '../lib/component.js';

export default class StarData extends Component {
  constructor(config) {
    super();

    this.planets = config.planets;
    this.spectralClass = config.spectralClass;
  }
}
