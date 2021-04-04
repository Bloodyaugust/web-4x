import Benchmark from 'benchmark';
import { World } from './world.js';
import Bank from '../components/bank.js';
import Inbox from '../components/inbox.js';
import Owner from '../components/owner.js';
import Population from '../components/population.js';
import PopulationGrowth from '../systems/population-growth.js';
import Planet from '../entities/planet.js';
import Player from '../entities/player.js';

const suite = new Benchmark.Suite('World');
const world = new World();

world.registerComponent(Bank);
world.registerComponent(Inbox);
world.registerComponent(Owner);
world.registerComponent(Population);

world.addSystem(new PopulationGrowth());

const player = world.addEntity(new Player());

for (let i = 0; i < 100; i++) {
  world.addEntity(new Planet(player));
}

suite
  .add('#queryIntersection, one component', () => {
    world.queryIntersection([Population]);
  })
  .add('#queryIntersection, two components', () => {
    world.queryIntersection([Population, Inbox]);
  })
  .add('#entities, direct access', () => {
    world.entities[player.id];
  })
  .add('#tick', () => {
    world.tick();
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .run();
