import { Component } from '../lib/component.js';

export default class Population extends Component {
  constructor(amount = 0) {
    super();

    this.amount = amount; // In millions of beings
  }
}
