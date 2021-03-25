import World from 'bitecs';
import bodyParser from 'body-parser';
import chance from 'chance';
import express from 'express';
import { inspect } from 'util';
import { getSheet } from './lib/castledb-interface.js';

const expressApp = express();
expressApp.use(bodyParser.json());

global.chance = new chance();

const world = World();

// Register all components
world.registerComponent('POSITION', {
  x: 'float32',
  y: 'float32'
});
world.registerComponent('VELOCITY', {
  x: 'float32',
  y: 'float32'
});

// Register all systems
world.registerSystem({
  name: 'MOVEMENT',
  components: ['POSITION', 'VELOCITY'],
  update: (position, velocity) => entities => {
    entities.forEach((entityID) => {
      position.x[entityID] += velocity.x[entityID];
      position.y[entityID] += velocity.y[entityID];
      console.log(`Updated ${entityID} in MOVEMENT system: ${JSON.stringify(position.x[entityID])}`)
    });
  }
});

const positions = world.createQuery(['POSITION']);
const entityID = world.addEntity();
const entityID2 = world.addEntity();

world.addComponent('POSITION', entityID, {
  x: 0,
  y: 0
});
world.addComponent('VELOCITY', entityID, {
  x: 1,
  y: 2
});

world.addComponent('POSITION', entityID2, {
  x: 0,
  y: 0
});
world.addComponent('VELOCITY', entityID2, {
  x: 1,
  y: 2
});

function update() {
  console.time('systems');
  world.step();
  console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

expressApp.get('/positions', (request, response) => {
  console.log('Getting all positions...');

  response.json({
    positions: JSON.stringify(positions)
  });
});

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
