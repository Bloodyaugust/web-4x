import ape from 'ape-ecs';

const DIFFICULTIES = Object.freeze({
  EASY: 0
});

class AI extends ape.Component {
  init(difficulty) {
    this.difficulty = difficulty || DIFFICULTIES.EASY;
  }
}

AI.properties = {
  difficulty: 0
}

export { AI, DIFFICULTIES };
