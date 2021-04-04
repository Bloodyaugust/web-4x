import { System } from '../lib/system.js';
import { queryEnemyFleetsSamePosition, queryNonEmptyFleets } from '../queries.js';
import { FleetCombatEvent } from '../objects/events.js';

export default class FleetCombat extends System {
  constructor() {
    super();
  }

  update(deltaTime) {
    queryNonEmptyFleets(this.world).forEach((fleet) => {
      if (fleet.canAttack()) {
        const enemyFleets = queryEnemyFleetsSamePosition(this.world, fleet);
        let totalDamage = 0;

        enemyFleets.forEach((enemyFleet) => {
          totalDamage += enemyFleet.attack(fleet);
        });

        if (totalDamage > 0) {
          fleet.getOwner().addEvent(new FleetCombatEvent(fleet, enemyFleets, totalDamage));
          fleet.getOwner().addScore(totalDamage);
        }
      }
    });
  }
}
