import ape from 'ape-ecs';

class Owner extends ape.Component {}

Owner.properties = {
  owner: ape.EntityRef
}

export { Owner };
