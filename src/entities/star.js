import { default as Victor } from 'victor';

function Star(star) {
  return {
    components: [
      {
        type: 'Owner',
        key: 'owner'
      },
      {
        type: 'Position',
        key: 'position',
        vector: Victor(
          chance.floating({
            min: -1000,
            max: 1000
          }),
          chance.floating({
            min: -1000,
            max: 1000
          })
        )
      },
      {
        type: 'StarData',
        key: 'data',
        class: star.class,
        planets: []
      }
    ],
    tags: ['Star']
  };
}

export { Star };
