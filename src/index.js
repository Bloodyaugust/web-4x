import bodyParser from 'body-parser';
import chance from 'chance';
import express from 'express';
import { inspect } from 'util';
import { getSheet } from './lib/castledb-interface.js';

import { World } from './lib/world.js';

// Components
import { Component } from './lib/component.js';

// Entities
import { Entity } from './lib/entity.js';

// Systems
import { System } from './lib/system.js';

const expressApp = express();
expressApp.use(bodyParser.json());

global.chance = new chance();

const world = new World();

class Position extends Component {
  constructor() {
    super();

    this.x = Math.random() * 1000;
    this.y = Math.random() * 1000;
  }
}

class Velocity extends Component {
  constructor() {
    super();

    this.x = Math.random();
    this.y = Math.random();
  }
}

class Transform extends Entity {
  constructor() {
    super();

    this.components.push(new Position());
    this.components.push(new Velocity());
  }
}

class Point extends Entity {
  constructor() {
    super();

    this.components.push(new Position());
  }
}

class Movement extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    console.time('query');
    const entities = this.world.queryIntersection([Position, Velocity]);
    console.timeEnd('query');
    console.log(`Entities in query: ${entities.length}`);
    console.log(`All entities: ${this.world.queryAll().length}`);

    entities.forEach((entity) => {
      const position = entity.getComponent(Position);

      position.x += deltaTime;
      position.y += deltaTime * 2;
    });
  }
}

world.registerComponent(Position);
world.registerComponent(Velocity);

world.addSystem(new Movement());

// for (let i = 0; i < 1000; i++) {
//   world.addEntity(new TestEntity());
// }

world.addEntity(new Transform());
world.addEntity(new Point());

function update() {
  console.time('systems');
  world.tick();
  console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

expressApp.get('/position', (request, response) => {
  console.log('Getting all position components...');

  response.json(world.queryIntersection([Position]).map((entity) => {
    return inspect(entity.getComponent(Position));
  }));
});

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
