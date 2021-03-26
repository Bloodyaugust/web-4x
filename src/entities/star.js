import { Entity } from '../lib/entity.js';
import Owner from '../components/owner.js';
import Population from '../components/population.js';
import Position from '../components/position.js';
import StarData from '../components/star-data.js';

export default class Star extends Entity {
  constructor(data) {
    super();

    this.components.push(new Owner(data.player || null));
    this.components.push(new Position(data.position));
    this.components.push(new StarData(data.star.class));
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
  }
}
