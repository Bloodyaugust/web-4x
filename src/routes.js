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
      const fleetComposition = fleet.getComponent(FleetComposition);
      const fleetState = fleet.getComponent(FleetState);

      return {
        id: fleet.id,
        composition: {
          colony: fleetComposition.colony,
          frigate: fleetComposition.frigate,
        },
        state: fleet.getComponent(FleetState).state
      };
    }));
  });

  app.get('/planet', (request, response) => {
    console.log('Getting all planet entities...');
  
    response.json(world.queryIntersection([Population]).map((entity) => {
      return {
        population: entity.getComponent(Population),
        id: entity.id
      };
    }).sort((a, b) => {
      return b.population.amount - a.population.amount;
    }));
  });
  
  app.get('/player', (request, response) => {
    console.log('Getting all player entities...');
  
    response.json(world.queryIntersection([Bank]).map((player) => {
      return {
        id: player.id,
        bank: player.getComponent(Bank),
        ownedEntities: world.queryIntersection([Owner]).filter((ownedEntity) => {
          return player === ownedEntity.getComponent(Owner).player;
        }).map((playerEntity) => {
          return {
            type: playerEntity.constructor.name,
            id: playerEntity.id
          };
        })
      };
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
  
    response.json(world.queryIntersection([StarData]).map((entity) => {
      const starData = entity.getComponent(StarData);
  
      return {
        data: {
          planets: starData.planets.length,
          spectralClass: starData.spectralClass
        },
        position: entity.getComponent(Position),
        owner: entity.getComponent(Owner).player ? entity.getComponent(Owner).player.id : 'None',
        id: entity.id
      };
    }));
  });
}
