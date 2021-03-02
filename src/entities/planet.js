import { getPlanet } from '../lib/castledb-interface.js';

function Planet(planet, star) {
  return {
    components: [
      {
        type: 'PlanetData',
        key: 'data',
        planetType: planet.type,
        size: chance.integer({
          min: getPlanet(planet.type).sizeRange[0],
          max: getPlanet(planet.type).sizeRange[1]
        }),
        star: star.id
      }
    ],
    tags: ['Planet']
  };
}

export { Planet };
