import ape from 'ape-ecs';

class PlayerData extends ape.Component {
  init() {
    this.ownedStars = [];
  }

  ownStar(star) {
    this.ownedStars.push(star);
    star.c.owner.owner = this.entity;
    star.addTag('Owned');
    star.c.owner.update();
    this.update();
  }
}

PlayerData.properties = {
  energy: 100,
  ownedStars : []
}

export { PlayerData };
