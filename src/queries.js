import FleetComposition from './components/fleet/fleet-composition.js';
import FleetState from './components/fleet/fleet-state.js';
import StarData from './components/star-data.js';

function queryEnemyFleetsSamePosition(world, findingFleet) {
  return world.queryIntersection([FleetState]).filter((fleet) => {
    return fleet.checkState('IDLE') && fleet.getOwner() !== findingFleet.getOwner() && findingFleet.getPosition().distanceSq(fleet.getPosition()) <= 0.01;
  });
}

function queryNonEmptyFleets(world) {
  const fleets = world.queryIntersection([FleetState]);

  return fleets.filter((fleet) => {
    const fleetComposition = fleet.getComponent(FleetComposition);
    const {
      colony = 0,
      frigate = 0
    } = fleetComposition;
    let shipCount = 0;

    shipCount += colony;
    shipCount += frigate;

    return shipCount > 0;
  });
}

function queryUnownedStars(world) {
  return world.queryIntersection([StarData]).filter((star) => {
    return star.getOwner() === null;
  });
}

export {
  queryEnemyFleetsSamePosition,
  queryNonEmptyFleets,
  queryUnownedStars
};
