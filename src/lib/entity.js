class Entity {
  constructor() {
    this.components = [];
    this.id = null;
    this.world = null;
  }

  getComponent(componentClass) {
    return this.components.find((component) => {
      return component.constructor.name === componentClass.name;
    });
  }

  hasComponent(componentClass) {
    return this.components.some((component) => {
      return component.constructor.name === componentClass.name;
    });
  }
}

export {
  Entity
};
