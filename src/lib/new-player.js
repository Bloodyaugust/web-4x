import StarData from '../components/star-data.js';
import Fleet from '../entities/fleet.js';
import Player from '../entities/player.js';

const calledForStars = [];

export default function newPlayer(world, ai) {
  const starEntities = world.queryIntersection([StarData]);
  const validStars = starEntities.filter((star) => {
    return star.getPlanets().length > 0 && star.getClass() === 'M' && star.getOwner() === null && !calledForStars.includes(star);
  });

  if (!validStars.length) {
    return false;
  }

  const player = world.addEntity(new Player(ai));
  const playerStar = validStars[Math.floor(Math.random() * validStars.length)];
  calledForStars.push(playerStar);

  const playerFleet = world.addEntity(new Fleet(player, {
    colony: 1,
    frigate: 1,
  }, playerStar));
  playerFleet.setColonizing(true);

  return player;
}