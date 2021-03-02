import ape from 'ape-ecs';

class Population extends ape.Component {
  colonize() {
    this.amount = 1;
    this.update();
  }
}

Population.properties = {
  amount: 0 // Millions
}

export { Population };
