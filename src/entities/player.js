import { Entity } from '../lib/entity.js';
import Bank from '../components/bank.js';
import Owner from '../components/owner.js';
import Inbox from '../components/inbox.js';
import AI from '../components/ai.js';
import FleetState from '../components/fleet/fleet-state.js';
import StarData from '../components/star-data.js';
import Score from '../components/score.js';

export default class Player extends Entity {
  constructor(ai) {
    super();

    this.components.push(new Bank());
    this.components.push(new Inbox());
    this.components.push(new Score());

    if (ai) {
      this.components.push(new AI());
    }
  }

  addEvent(event) {
    this.getComponent(Inbox).events.push(event);
  }

  addScore(amount) {
    this.getComponent(Score).score += amount;
    return this.getScore();
  }

  getCredits() {
    return this.getComponent(Bank).credits;
  }

  getFleets() {
    return this.world.queryIntersection([FleetState]).filter((fleet) => {
      return fleet.getOwner() === this;
    });
  }

  getScore() {
    return this.getComponent(Score).score;
  }

  getStars() {
    return this.world.queryIntersection([StarData]).filter((star) => {
      return star.getOwner() === this;
    });
  }

  spendCredits(amount) {
    const bank = this.getComponent(Bank);

    if (isNaN(amount)) {
      throw new Error('Tried to spend NaN credits');
    }

    if (bank.credits >= amount) {
      bank.credits -= amount;
      return true;
    }

    return false;
  }

  isAI() {
    return this.hasComponent(AI);
  }

  isDefeated() {
    return this.getComponent(Score).defeated;
  }

  toJSON() {
    // console.time('player response');
    const response = {
      id: this.id,
      ai: this.isAI(),
      defeated: this.isDefeated(),
      events: this.getComponent(Inbox).events,
      bank: this.getComponent(Bank),
      ownedEntities: this.world.queryIntersection([Owner]).filter((ownedEntity) => {
        return this === ownedEntity.getOwner();
      }).map((playerEntity) => {
        return {
          type: playerEntity.constructor.name,
          id: playerEntity.id
        };
      }),
      score: this.getScore()
    };
    // console.timeEnd('player response');
    return response;
  }
}
