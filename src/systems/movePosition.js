import ape from 'ape-ecs';
import { default as Victor } from 'victor';

class MovePosition extends ape.System {
  init() {
    this.mainQuery = this.createQuery().fromAll('Position');
    this.translateVector = new Victor(1, 0);
  }

  update(tick) {
    this.mainQuery.execute().forEach((entity) => {
      entity.c.position.vector.add(this.translateVector);
      // console.log(entity.c.position);
    });
  }
}

export { MovePosition };
