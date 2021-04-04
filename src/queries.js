import FleetComposition from './components/fleet/fleet-composition.js';
import FleetState from './components/fleet/fleet-state.js';
import StarData from './components/star-data.js';

function queryClosestEnemyOrUnownedStar(world, fleet) {
  return world.queryIntersection([StarData]).filter(star => star.getOwner() !== fleet.getOwner()).sort((a, b) => {
    return a.getDistance(fleet.getPosition()) - b.getDistance(fleet.getPosition());
  })[0];
}

function queryClosestOwnedStar(world, fleet) {
  return world.queryIntersection([StarData]).filter(star => star.getOwner() === fleet.getOwner()).sort((a, b) => {
    return a.getDistance(fleet.getPosition()) - b.getDistance(fleet.getPosition());
  })[0];
}

function queryClosestOwnedStarWithUncolonizedPlanets(world, fleet) {
  return world.queryIntersection([StarData]).filter(star => star.getOwner() === fleet.getOwner() && star.getUncolonizedPlanets().length).sort((a, b) => {
    return a.getDistance(fleet.getPosition()) - b.getDistance(fleet.getPosition());
  })[0];
}

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
  queryClosestEnemyOrUnownedStar,
  queryClosestOwnedStar,
  queryClosestOwnedStarWithUncolonizedPlanets,
  queryEnemyFleetsSamePosition,
  queryNonEmptyFleets,
  queryUnownedStars
};
