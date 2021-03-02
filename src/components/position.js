import ape from 'ape-ecs';

class Position extends ape.Component {}

Position.properties = {
  vector: null
}

export { Position };
