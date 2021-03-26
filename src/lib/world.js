import { v4 as uuid } from 'uuid';

class World {
  constructor() {
    this.components = [];
    this.entities = {};
    this.systems = [];

    this.startTime = new Date().valueOf();
    this.lastFrameTime = this.startTime;
    this.currentFrameTime = this.startTime;
  }

  addEntity(entity) {
    const world = this;

    entity.components.forEach((component) => {
      world.entities[component.constructor.name].push(entity);
    });

    entity.id = uuid();
    entity.world = world;
    this.entities[entity.id] = entity;

    return entity;
  }

  addSystem(system) {
    system.world = this;

    this.systems.push(system);
  }

  registerComponent(component) {
    this.components.push(component);

    this.entities[component.name] = [];
  }

  tick() {
    this.lastFrameTime = this.currentFrameTime;
    this.currentFrameTime = new Date().valueOf();

    const deltaTime = (this.currentFrameTime - this.lastFrameTime) / 1000;

    this.systems.forEach((system) => {
      system.update(deltaTime);
    });
  }

  queryAll() {
    return [...new Set(this.components.map((component) => {
      return this.entities[component.name];
    }).flat())] || [];
  }

  queryIntersection(components) {
    return components.map((component) => {
      return this.entities[component.name];
    }).reduce((a, b) => a.filter(c => b.includes(c))) || [];
  }
}

export {
  World
};
