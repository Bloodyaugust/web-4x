import { Component } from '../lib/component.js';

export default class Score extends Component {
  constructor() {
    super();

    this.defeated = false;
    this.score = 0;
  }
}
