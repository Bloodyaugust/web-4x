import { Entity } from '../lib/entity.js';
import Owner from '../components/owner.js';
import Population from '../components/population.js';
import Position from '../components/position.js';
import StarData from '../components/star-data.js';
import Inbox from '../components/inbox.js';
import { SystemCapturedEvent } from '../objects/events.js';

export default class Star extends Entity {
  constructor(data) {
    super();

    this.components.push(new Owner(data.player || null));
    this.components.push(new Position(data.position));
    this.components.push(new StarData(data.star.class));
  }

  getOwner() {
    return this.getComponent(Owner).player;
  }

  addPlanet(planet) {
    this.getComponent(StarData).planets.push(planet);
  }

  getPlanets() {
    return this.getComponent(StarData).planets;
  }

  getUncolonizedPlanets() {
    const planets = this.getComponent(StarData).planets;

    return planets.filter((planet) => {
      return planet.getComponent(Population).amount === 0;
    });
  }

  own(player) {
    this.getComponent(Owner).player = player;
    this.getComponent(StarData).planets.forEach((planet) => {
      planet.own(player);
    });
    player.addEvent(new SystemCapturedEvent(this));
  }

  toJSON() {
    const owner = this.getComponent(Owner);
    const position = this.getComponent(Position);
    const starData = this.getComponent(StarData);

    return {
      data: {
        planets: starData.planets.length,
        spectralClass: starData.spectralClass
      },
      position: position.position,
      owner: owner.player ? owner.player.id : 'None',
      id: this.id
    };
  }
}
