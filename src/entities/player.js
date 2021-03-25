import { Entity } from '../lib/entity.js';
import Bank from '../components/bank.js';

export default class Player extends Entity {
  constructor() {
    super();

    this.components.push(new Bank());
  }
}
