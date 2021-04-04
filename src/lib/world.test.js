import { jest } from '@jest/globals';
import { Component } from './component.js';
import { Entity } from './entity.js';
import { System } from './system.js';
import { World } from './world.js';

class TestComponent extends Component {
  constructor() {
    super();
  }
}

class TestEntity extends Entity {
  constructor() {
    super();

    this.components.push(new TestComponent());
  }
}

class TestSystem extends System {
  constructor() {
    super();
  }
}

describe('world', () => {
  test('can register components', () => {
    const world = new World();
    expect(world.entities[TestComponent.name]).toBeUndefined();

    world.registerComponent(TestComponent);

    expect(world.entities[TestComponent.name].length).toBe(0);
  });

  test('can add entities', () => {
    const world = new World();
    const newEntity = world.addEntity(new Entity());

    expect(world.entities[newEntity.id]).toBeTruthy();
  });

  test('throws error when adding entity with unregistered components', () => {
    const world = new World();
    
    expect(() => {
      world.addEntity(new TestEntity());
    }).toThrow('Component TestComponent not registered!');
  });

  test('can remove entities', () => {
    const world = new World();

    world.registerComponent(TestComponent);

    const newEntity = world.addEntity(new TestEntity());

    expect(world.entities[newEntity.id]).toBeTruthy();
    expect(world.queryIntersection([TestComponent])[0]).toBe(newEntity);

    world.removeEntity(newEntity);

    expect(world.entities[newEntity.id]).toBeUndefined();
    expect(world.queryIntersection([TestComponent]).length).toBe(0);
  });

  test('can add systems', () => {
    const world = new World();
    
    expect(world.systems.length).toBe(0);

    world.addSystem(new TestSystem());

    expect(world.systems.length).toBe(1);
  });

  test('runs systems on tick', () => {
    const mockUpdate = jest.fn(() => {});
    const world = new World();
    const testSystem = new TestSystem();
    
    testSystem.update = mockUpdate;
    world.addSystem(testSystem);
    world.tick();

    expect(mockUpdate.mock.calls.length).toBe(1);
    expect(mockUpdate.mock.calls[0][0]).toBeGreaterThan(-1);
  });

  test('#queryIntersection', () => {
    class SecondComponent extends Component {
      constructor() {
        super();
      }
    }

    class SecondEntity extends Entity {
      constructor() {
        super();

        this.components.push(new TestComponent());
        this.components.push(new SecondComponent());
      }
    }

    const world = new World();
    world.registerComponent(TestComponent);
    world.registerComponent(SecondComponent);
    world.addEntity(new Entity());
    world.addEntity(new TestEntity());
    world.addEntity(new SecondEntity());

    expect(world.queryIntersection([TestComponent]).length).toBe(2);
    expect(world.queryIntersection([TestComponent, SecondComponent]).length).toBe(1);
    expect(world.queryIntersection([SecondComponent]).length).toBe(1);
  });
});
