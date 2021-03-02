function Fleet(player, star) {
  return {
    components: [
      {
        type: 'Owner',
        key: 'owner',
        ownerID: player.id,
        owner: player
      },
      {
        type: 'FleetData',
        key: 'data',
        colony: 0,
        frigate: 0,
        target: star
      },
      {
        type: 'Position',
        key: 'position',
        vector: star.c.position.vector.clone()
      },
    ],
    tags: ['Fleet']
  };
}

export { Fleet };
