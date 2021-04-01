import StarData from '../components/star-data.js';
import Fleet from '../entities/fleet.js';
import Player from '../entities/player.js';

export default function newPlayer(world, ai) {
  const player = world.addEntity(new Player(ai));

  const starEntities = world.queryIntersection([StarData]);
  const playerStar = starEntities.find((star) => {
    return star.getPlanets().length > 0 && star.getClass() === 'M' && star.getOwner() === null;
  });

  const playerFleet = world.addEntity(new Fleet(player, {
    colony: 1,
    frigate: 1,
  }, playerStar));
  playerFleet.setColonizing(true);

  return player;
}