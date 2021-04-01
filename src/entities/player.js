import { Entity } from '../lib/entity.js';
import Bank from '../components/bank.js';
import Owner from '../components/owner.js';
import Inbox from '../components/inbox.js';

export default class Player extends Entity {
  constructor() {
    super();

    this.components.push(new Bank());
    this.components.push(new Inbox());
  }

  toJSON() {
    // console.time('player response');
    const response = {
      id: this.id,
      events: this.getComponent(Inbox).events,
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
