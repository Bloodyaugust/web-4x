import { Entity } from '../lib/entity.js';
import Bank from '../components/bank.js';
import Owner from '../components/owner.js';

export default class Player extends Entity {
  constructor() {
    super();

    this.components.push(new Bank());
  }

  toJSON() {
    // console.time('player response');
    const response = {
      id: this.id,
      bank: this.getComponent(Bank),
      ownedEntities: this.world.queryIntersection([Owner]).filter((ownedEntity) => {
        return this === ownedEntity.getComponent(Owner).player;
      }).map((playerEntity) => {
        return {
          type: playerEntity.constructor.name,
          id: playerEntity.id
        };
      })
    };
    // console.timeEnd('player response');
    return response;
  }
}
