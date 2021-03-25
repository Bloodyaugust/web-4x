class Entity {
  constructor() {
    this.components = [];
  }

  getComponent(componentClass) {
    return this.components.find((component) => {
      return component.constructor.name === componentClass.name;
    });
  }
}

export {
  Entity
};
