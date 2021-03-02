import ape from 'ape-ecs';

class FleetData extends ape.Component {}

FleetData.properties = {
  colony: 0,
  frigate: 0,
  target: ape.EntityRef
}

export { FleetData };
