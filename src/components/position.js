import { default as Victor } from 'victor';
import { Component } from '../lib/component.js';

export default class Position extends Component {
  constructor(startingPosition = Victor(0, 0)) {
    super();

    this.position = startingPosition;
  }
}
