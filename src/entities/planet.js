import { Entity } from '../lib/entity.js';
import Owner from '../components/owner.js';
import Population from '../components/population.js';

export default class Planet extends Entity {
  constructor(player = null) {
    super();

    this.components.push(new Owner(player));
    this.components.push(new Population(player ? 5 : 0));
  }
}
