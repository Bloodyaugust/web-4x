function Player(isAI) {
  const newPlayer = {
    components: [
      {
        type: 'EventStack',
        key: 'events'
      },
      {
        type: 'PlayerData',
        key: 'data'
      }
    ],
    tags: ['Player']
  };

  if (isAI) {
    newPlayer.components.push({
      type: 'AI',
      key: 'ai'
    });
  }

  return newPlayer;
}

export { Player };
