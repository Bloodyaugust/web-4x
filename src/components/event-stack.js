import ape from 'ape-ecs';

class EventStack extends ape.Component {
  init() {
    this.events = [];
  }
}

EventStack.properties = {
  events: []
}

export { EventStack };
