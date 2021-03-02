import ape from 'ape-ecs';
import bodyParser from 'body-parser';
import chance from 'chance';
import express from 'express';
import { inspect } from 'util';
import { getSheet } from './lib/castledb-interface.js';

// Systems
import { AISystem } from './systems/aiSystem.js';
import { Colonize } from './systems/colonize.js';
import { Income } from './systems/income.js';
import { MovePosition } from './systems/movePosition.js';
import { FleetMovement } from './systems/fleetMovement.js';
import { PopulationGrowth } from './systems/populationGrowth.js';

// Components
import { AI } from './components/ai.js';
import { EventStack } from './components/event-stack.js';
import { FleetData } from './components/fleet-data.js';
import { Owner } from './components/owner.js';
import { Population } from './components/population.js';
import { Position } from './components/position.js';
import { PlanetData } from './components/planet-data.js';
import { PlayerData } from './components/player-data.js';
import { StarData } from './components/star-data.js';

// Entities
import { Fleet } from './entities/fleet.js';
import { Player } from './entities/player.js';
import { Planet } from './entities/planet.js';
import { Star } from './entities/star.js';

// Objects
import {
  EVENTS,
  FleetEvent,
  GameEvent
} from './objects/events.js';

const expressApp = express();
expressApp.use(bodyParser.json());

global.chance = new chance();

let colonizeSystem;

function generateGalaxy() {
  console.time('generate');

  const planets = getSheet('planets');
  const planetWeights = planets.map((planet) => planet.weight);
  const stars = getSheet('stars');
  const starWeights = stars.map((star) => star.weight);
  const planetTypes = {};
  const starClasses = {};

  for (let i = 0; i < 100000; i++) {
    const pickedStar = global.chance.weighted(stars, starWeights);
    const newStar = world.createEntity(Star(pickedStar));

    if (starClasses[newStar.c.data.class]) {
      starClasses[newStar.c.data.class] += 1;
    } else {
      starClasses[newStar.c.data.class] = 1;
    }

    const numPlanets = global.chance.integer({
      min: pickedStar.possibleWorlds[0],
      max: pickedStar.possibleWorlds[1]
    });
    for (let i2 = 0; i2 < numPlanets; i2++) {
      const pickedPlanet = global.chance.weighted(planets, planetWeights);
      const newPlanet = world.createEntity(Planet(pickedPlanet, newStar));

      newStar.c.data.planets.add(newPlanet);

      if (planetTypes[newPlanet.c.data.planetType]) {
        planetTypes[newPlanet.c.data.planetType] += 1;
      } else {
        planetTypes[newPlanet.c.data.planetType] = 1;
      }
    }
  }

  console.log(planetTypes);
  console.log(starClasses);

  console.timeEnd('generate');
}

function formatPlayer(player) {
  const formattedPlayer = {
    ai: player.has('AI'),
    id: player.id,
    energy: player.c.data.energy,
    fleets: [...world.createQuery().fromAll('Fleet').fromReverse(player, 'Owner').execute()].map((fleet) => {
      return fleet.getObject();
    }),
    planets: player.c.data.ownedStars.map((star) => {
      return [...star.c.data.planets].map((planet) => {
        return planet.getObject();
      });
    }),
    stars: player.c.data.ownedStars.map((star) => {
      return star.getObject();
    })
  };

  formattedPlayer.planetCount = formattedPlayer.planets.length;
  formattedPlayer.starCount = formattedPlayer.stars.length;

  return formattedPlayer;
}

function registerPlayer(isAI) {
  const newPlayer = world.createEntity(Player(isAI));
  const unownedStars = world.createQuery().fromAll('Star').not('Owned').execute();

  let owningStar;
  for (const star of unownedStars) {
    if (star.c.data.class === 'G') {
      owningStar = star;
      break;
    }
  }

  newPlayer.c.data.ownStar(owningStar);

  colonizeSystem.colonize(owningStar);

  console.log(`Registered new player: ${inspect(newPlayer)}`);

  return newPlayer;
}

const world = new ape.World();

// Register all components
world.registerComponent(AI);
world.registerComponent(EventStack);
world.registerComponent(FleetData);
world.registerComponent(Owner);
world.registerComponent(Population);
world.registerComponent(Position);
world.registerComponent(PlayerData);
world.registerComponent(PlanetData);
world.registerComponent(StarData);

// Register all systems
colonizeSystem = world.registerSystem('colonize', Colonize);
global.colonizeSystem = colonizeSystem;
world.registerSystem('main', AISystem);
world.registerSystem('main', FleetMovement);
world.registerSystem('main', Income);
// world.registerSystem('main', MovePosition);
world.registerSystem('main', PopulationGrowth);

// Register all tags
world.registerTags('Fleet', 'Owned', 'Planet', 'Player', 'Star');

generateGalaxy();

const globalEventStack = world.createEntity({
  id: 'events',
  components: [
    {
      type: 'EventStack',
      key: 'events'
    }
  ]
});

globalEventStack.c.events.events.push(new GameEvent(EVENTS.GAME_START));
globalEventStack.c.events.update();

registerPlayer(true);

function update() {
  // console.time('systems');
  world.runSystems('main');
  // console.timeEnd('systems');
  setTimeout(update, 1000);
}

update();

expressApp.get('/event', (request, response) => {
  console.log('Getting all global events...');

  response.json({
    events: globalEventStack.c.events.events
  });

  globalEventStack.c.events.events.forEach((event) => {
    event.read = true;
  });
});

expressApp.get('/fleet', (request, response) => {
  console.log('Getting all fleets...');

  response.json({
    fleets: [...world.createQuery().fromAll('Fleet').execute()].map((fleet) => {
      return fleet.getObject();
    })
  });
});
expressApp.post('/fleet', (request, response) => {
  const { playerID, starID } = request.body;

  const newFleet = world.createEntity(Fleet(world.getEntity(playerID), world.getEntity(starID)));

  response.json({
    fleet: newFleet.getObject()
  });
});
expressApp.put('/fleet/:id/target', (request, response) => {
  const { id } = request.params;
  const { starID } = request.body;

  const fleetEntity = world.getEntity(id);

  fleetEntity.c.data.target = world.getEntity(starID);

  response.json({
    fleet: fleetEntity.getObject()
  });
});

expressApp.get('/player', (request, response) => {
  console.log('Getting all players...');

  const playerSet = world.createQuery().fromAll('Player').execute();

  response.json({
    players: [...playerSet].map((player) => {
      return player.id;
    })
  });
});
expressApp.get('/player/:id', (request, response) => {
  const { id } = request.params;

  console.log(`Getting player: ${id}`);

  const playerEntity = world.getEntity(id);

  response.json({
    player: formatPlayer(playerEntity)
  });
});
expressApp.get('/player/:id/event', (request, response) => {
  const { id } = request.params;

  console.log(`Getting events for player: ${id}`);

  const playerEntity = world.getEntity(id);

  response.json({
    player: playerEntity.c.events.events
  });

  playerEntity.c.events.events.forEach((event) => {
    event.read = true;
  });
});

expressApp.get('/register', (request, response) => {
  const newPlayer = registerPlayer(false);

  console.log(`Registered new player: ${newPlayer.id}`);

  response.json({
    player: formatPlayer(newPlayer)
  });
});

expressApp.listen(3000, () => {
  console.log(`Server started at ${new Date}`);
});
