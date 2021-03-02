import ape from 'ape-ecs';

class Income extends ape.System {
  init() {
    this.mainQuery = this.createQuery().fromAll('Population').persist();
  }

  update(tick) {
    const planets = this.mainQuery.execute();

    for (const planet of planets) {
      // Find all planets whose star is owned, grab player id
      // Increment player energy
      const star = this.world.getEntity(planet.c.data.star);

      if (star.c.owner.owner !== null) {
        // console.log(`Adding income to player ${star.c.owner.ownerID}`);
        const player = star.c.owner.owner;
        const population = planet.getOne('Population');

        player.c.data.energy += population.amount * 5;
        player.c.data.update();
      }
    }
  }
}

export { Income };
