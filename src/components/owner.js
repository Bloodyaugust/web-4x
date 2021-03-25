import { Component } from '../lib/component.js';

export default class Owner extends Component {
  constructor(player = null) {
    super();

    this.player = player;
  }
}
