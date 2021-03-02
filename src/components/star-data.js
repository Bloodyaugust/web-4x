import ape from 'ape-ecs';

class StarData extends ape.Component {}

StarData.properties = {
  class: null,
  planets: ape.EntitySet
}

export { StarData };
