import bodyParser from 'body-parser';
import chance from 'chance';
import cors from 'cors';
import express from 'express';
import { inspect } from 'util';
import Victor from 'victor';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { getSheet } from './lib/castledb-interface.js';
import initializeRoutes from './routes.js';

import { World } from './lib/world.js';

// Components
import AI from './components/ai.js';
import Bank from './components/bank.js';
import FleetComposition from './components/fleet/fleet-composition.js';
import FleetState from './components/fleet/fleet-state.js';
import Inbox from './components/inbox.js';
import Owner from './components/owner.js';
import Population from './components/population.js';
import Position from './components/position.js';
import StarData from './components/star-data.js';

// Entities
import Fleet from './entities/fleet.js';
import Planet from './entities/planet.js';
import Player from './entities/player.js';
import Star from './entities/star.js';

// Systems
import AISystem from './systems/ai.js';
import Colonization from './systems/colonization.js';
import FleetCombat from './systems/fleet-combat.js';
import FleetMovement from './systems/fleet-movement.js';
import Income from './systems/income.js';
import PopulationGrowth from './systems/population-growth.js';

const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(cors());

global.chance = new chance();

const world = new World();

// Register all components
world.registerComponent(AI);
world.registerComponent(Bank);
world.registerComponent(FleetComposition);
world.registerComponent(FleetState);
world.registerComponent(Inbox);
world.registerComponent(Owner);
world.registerComponent(Population);
world.registerComponent(Position);
world.registerComponent(StarData);

// Add all systems
world.addSystem(new AISystem());
world.addSystem(new Colonization());
world.addSystem(new FleetCombat());
world.addSystem(new FleetMovement());
world.addSystem(new Income());
world.addSystem(new PopulationGrowth());

function generateGalaxy() {
  console.time('generate');

  const starPoissonDisk = new PoissonDiskSampling({
    shape: [100, 100],
    minDistance: 5,
    maxDistance: 20,
  });
  const planets = getSheet('planets');
  const planetWeights = planets.map((planet) => planet.weight);
  const stars = getSheet('stars');
  const starWeights = stars.map((star) => star.weight);
  const planetTypes = {};
  const starClasses = {};

  const starPositions = starPoissonDisk.fill().map((point) => {
    return new Victor(point[0] - 50, point[1] - 50);
  }).filter((vector) => {
    return vector.magnitude() <= 35;
  });

  console.log(starPositions.length);

  starPositions.forEach((position) => {
    const pickedStar = global.chance.weighted(stars, starWeights);
    const newStar = world.addEntity(new Star({
      position,
      star: pickedStar
    }));
    const newStarData = newStar.getComponent(StarData);

    if (starClasses[newStarData.spectralClass]) {
      starClasses[newStarData.spectralClass] += 1;
    } else {
      starClasses[newStarData.spectralClass] = 1;
    }

    const numPlanets = global.chance.integer({
      min: pickedStar.possibleWorlds[0],
      max: pickedStar.possibleWorlds[1]
    });
    for (let i = 0; i < numPlanets; i++) {
      const pickedPlanet = global.chance.weighted(planets, planetWeights); // TODO: Pipe into planet entity
      const newPlanet = world.addEntity(new Planet());

      newStar.addPlanet(newPlanet);

      // if (planetTypes[newPlanet.c.data.planetType]) {
      //   planetTypes[newPlanet.c.data.planetType] += 1;
      // } else {
      //   planetTypes[newPlanet.c.data.planetType] = 1;
      // }
    }
  });

  console.log('Planets: ', planetTypes);
  console.log('Stars: ', starClasses);

  console.timeEnd('generate');
}

generateGalaxy();

function update() {
  console.time('systems');
  world.tick();
  console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

initializeRoutes(expressApp, world);

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
