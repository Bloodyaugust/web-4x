import bodyParser from 'body-parser';
import chance from 'chance';
import express from 'express';
import { inspect } from 'util';
import { getSheet } from './lib/castledb-interface.js';

import { World } from './lib/world.js';

// Components
import Bank from './components/bank.js';
import Owner from './components/owner.js';
import Population from './components/population.js';
import Position from './components/position.js';
import StarData from './components/star-data.js';

// Entities
import Planet from './entities/planet.js';
import Player from './entities/player.js';
import Star from './entities/star.js';

// Systems
import Income from './systems/income.js';

const expressApp = express();
expressApp.use(bodyParser.json());

global.chance = new chance();

const world = new World();

// Register all components
world.registerComponent(Bank);
world.registerComponent(Owner);
world.registerComponent(Population);
world.registerComponent(Position);
world.registerComponent(StarData);

// Add all systems
world.addSystem(new Income());

const player = world.addEntity(new Player());
const planet = world.addEntity(new Planet(player));
world.addEntity(new Star({
  player,
  star: {
    spectralClass: 'G',
    planets: [planet]
  }
}));

function update() {
  console.time('systems');
  world.tick();
  console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

expressApp.get('/planet', (request, response) => {
  console.log('Getting all planet entities...');

  response.json(world.queryIntersection([Population]).map((entity) => {
    return {
      population: entity.getComponent(Population),
      id: entity.id
    };
  }));
});

expressApp.get('/player', (request, response) => {
  console.log('Getting all player entities...');

  response.json(world.queryIntersection([Bank]).map((entity) => {
    return {
      bank: entity.getComponent(Bank),
      id: entity.id
    };
  }));
});

expressApp.get('/position', (request, response) => {
  console.log('Getting all position components...');

  response.json(world.queryIntersection([Position]).map((entity) => {
    return inspect(entity.getComponent(Position));
  }));
});

expressApp.get('/star', (request, response) => {
  console.log('Getting all star entities...');

  response.json(world.queryIntersection([StarData]).map((entity) => {
    const starData = entity.getComponent(StarData);

    return {
      data: {
        planets: starData.planets.length,
        spectralClass: starData.spectralClass
      },
      position: entity.getComponent(Position),
      owner: entity.getComponent(Owner).player.id,
      id: entity.id
    };
  }));
});

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
