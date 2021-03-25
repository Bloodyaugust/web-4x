import { Entity } from '../lib/entity.js';
import Owner from '../components/owner.js';
import Position from '../components/position.js';
import StarData from '../components/star-data.js';

export default class Star extends Entity {
  constructor(data) {
    super();

    this.components.push(new Owner(data.player || null));
    this.components.push(new Position(data.position));
    this.components.push(new StarData(data.star));
  }
}
