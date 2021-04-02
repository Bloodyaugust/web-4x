import bodyParser from 'body-parser';
import chance from 'chance';
import cors from 'cors';
import express from 'express';
import { inspect } from 'util';
import Victor from 'victor';
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
import Income from './systems/income.js';
import PopulationGrowth from './systems/population-growth.js';
import FleetMovement from './systems/fleet-movement.js';

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
world.addSystem(new FleetMovement());
world.addSystem(new Colonization());
world.addSystem(new Income());
world.addSystem(new PopulationGrowth());

function generateGalaxy() {
  console.time('generate');

  const planets = getSheet('planets');
  const planetWeights = planets.map((planet) => planet.weight);
  const stars = getSheet('stars');
  const starWeights = stars.map((star) => star.weight);
  const planetTypes = {};
  const starClasses = {};

  for (let i = 0; i < 100; i++) {
    const pickedStar = global.chance.weighted(stars, starWeights);
    // TODO: Currently stars can generate with the exact same location. Look into poisson disk sampling, or maybe brute enforce distance thru regeneration. Is this randomize using floats?
    const newStar = world.addEntity(new Star({
      position: new Victor(0, 0).randomize(
        new Victor(-100, -100),
        new Victor(100, 100)
      ),
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
    for (let i2 = 0; i2 < numPlanets; i2++) {
      const pickedPlanet = global.chance.weighted(planets, planetWeights); // TODO: Pipe into planet entity
      const newPlanet = world.addEntity(new Planet());

      newStar.addPlanet(newPlanet);

      // if (planetTypes[newPlanet.c.data.planetType]) {
      //   planetTypes[newPlanet.c.data.planetType] += 1;
      // } else {
      //   planetTypes[newPlanet.c.data.planetType] = 1;
      // }
    }
  }

  console.log(planetTypes);
  console.log(starClasses);

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
