import { System } from '../lib/system.js';
import { GameWonEvent } from '../objects/events.js';
import Score from '../components/score.js';

export default class GameWin extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    const players = this.world.queryIntersection([Score]);

    players.forEach((player) => {
      if (!player.getStars().length) {
        player.getComponent(Score).defeated = true;
      }
    });

    const undefeatedPlayers = players.filter(player => !player.getComponent(Score).defeated);

    if (undefeatedPlayers.length === 1 && players.length > 1) {
      undefeatedPlayers[0].addEvent(new GameWonEvent(undefeatedPlayers[0]));
    }
  }
}
