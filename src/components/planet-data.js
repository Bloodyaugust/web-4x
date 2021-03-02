import ape from 'ape-ecs';

class PlanetData extends ape.Component {}

PlanetData.properties = {
  size: null,
  star: null,
  planetType: null
}

export { PlanetData };
