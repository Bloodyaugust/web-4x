// Components
import Bank from './components/bank.js';
import FleetComposition from './components/fleet/fleet-composition.js';
import FleetState from './components/fleet/fleet-state.js';
import Inbox from './components/inbox.js';
import Owner from './components/owner.js';
import Population from './components/population.js';
import Position from './components/position.js';
import StarData from './components/star-data.js';
import Fleet from './entities/fleet.js';
import Player from './entities/player.js';
import newPlayer from './lib/new-player.js';

export default function initializeRoutes(app, world) {
  app.get('/event', (request, response) => {
    console.log('Getting all events...');
  
    response.json(world.queryIntersection([Inbox]).map((player) => {
      return player.getComponent(Inbox).events;
    }).flat());
  });

  app.get('/fleet', (request, response) => {
    console.log('Getting all fleet entities...');
  
    response.json(world.queryIntersection([FleetComposition]).map((fleet) => {
      return fleet.toJSON();
    }));
  });
  app.post('/fleet', (request, response) => {
    const { player, star } = request.body;
    const playerEntity = world.entities[player];
    const starEntity = world.entities[star];
    const fleet = world.addEntity(new Fleet(playerEntity, {frigate: 1}, starEntity));

    console.log(`Created a new fleet for player ${playerEntity.id} at star ${starEntity.id}: ${fleet.id}`);
  
    response.json(fleet);
  });
  app.put('/fleet/:id/target', (request, response) => {
    const { id } = request.params;
    const { target } = request.body;
    const fleet = world.entities[id];
    const targetStar = world.entities[target];

    console.log(`Setting target for fleet: ${id} to (Star)${target}`);

    fleet.target(targetStar);
  
    response.json(fleet);
  });

  app.get('/planet', (request, response) => {
    console.log('Getting all planet entities...');
  
    response.json(world.queryIntersection([Population]).map((planet) => {
      return planet.toJSON();
    }).sort((a, b) => {
      return b.population.amount - a.population.amount;
    }));
  });
  
  app.get('/player', (request, response) => {
    console.log('Getting all player entities...');
  
    response.json(world.queryIntersection([Bank]).map((player) => {
      return player.toJSON();
    }));
  });
  app.post('/player', (request, response) => {
    const { ai } = request.body;
    const player = newPlayer(world, ai);

    if (player) {
      console.log(`Created a new${ai ? ' ai' : ''} player: ${player.id}`);
  
      response.json(player);
    } else {
      console.log(`Failed to create a new player, galaxy is full!`);
  
      response.json({
        message: 'Failed to create a new player, galaxy is full!'
      });
    }
  });
  app.get('/player/:id', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    console.log(`Getting player: ${id}`);

    response.json(player);
  });
  app.get('/player/:id/bank', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player bank: ${id}`);

    response.json(player.getComponent(Bank));
  });
  app.get('/player/:id/event', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player events: ${id}`);

    response.json(player.getComponent(Inbox).events);
  });
  app.get('/player/:id/star', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player stars: ${id}`);

    response.json(world.queryIntersection([Owner]).filter((entity) => {
      return entity.constructor.name === 'Star' && entity.getComponent(Owner).player === player;
    }));
  });
  app.get('/player/:id/score', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player score: ${id}`);

    response.json({
      defeated: player.isDefeated(),
      score: player.getScore()
    });
  });
  app.get('/player/:id/planet', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player planets: ${id}`);

    response.json(world.queryIntersection([Owner]).filter((entity) => {
      return entity.constructor.name === 'Planet' && entity.getComponent(Owner).player === player;
    }));
  });
  app.get('/player/:id/fleet', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    // console.log(`Getting player fleets: ${id}`);

    response.json(world.queryIntersection([Owner]).filter((entity) => {
      return entity.constructor.name === 'Fleet' && entity.getComponent(Owner).player === player;
    }));
  });
  
  app.get('/position', (request, response) => {
    console.log('Getting all position components...');
  
    response.json(world.queryIntersection([Position]).map((entity) => {
      return inspect(entity.getComponent(Position));
    }));
  });
  
  app.get('/star', (request, response) => {
    console.log('Getting all star entities...');
  
    response.json(world.queryIntersection([StarData]).map((star) => {
      return star.toJSON();
    }));
  });
}
