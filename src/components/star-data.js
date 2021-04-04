import { Component } from '../lib/component.js';

export default class StarData extends Component {
  constructor(spectralClass) {
    super();

    this.planets = [];
    this.spectralClass = spectralClass;
  }
}
