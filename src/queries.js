import StarData from './components/star-data.js';

function queryUnownedStars(world) {
  return world.queryIntersection([StarData]).filter((star) => {
    return star.getOwner() === null;
  });
}

export {
  queryUnownedStars
};
