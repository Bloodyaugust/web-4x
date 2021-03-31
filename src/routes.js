// Components
import Bank from './components/bank.js';
import FleetComposition from './components/fleet/fleet-composition.js';
import FleetState from './components/fleet/fleet-state.js';
import Owner from './components/owner.js';
import Population from './components/population.js';
import Position from './components/position.js';
import StarData from './components/star-data.js';

export default function initializeRoutes(app, world) {
  app.get('/fleet', (request, response) => {
    console.log('Getting all fleet entities...');
  
    response.json(world.queryIntersection([FleetComposition]).map((fleet) => {
      return fleet.toJSON();
    }));
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
  app.get('/player/:id', (request, response) => {
    const { id } = request.params;
    const player = world.entities[id];

    console.log(`Getting player: ${id}`);

    response.json(player);
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
