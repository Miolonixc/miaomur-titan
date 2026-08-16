import test from 'node:test';
import assert from 'node:assert/strict';
import { TvIdleLife } from '../src/tv-idle-life.js';

test('starts a pastime after the configured idle interval', () => {
  const life = new TvIdleLife({ idleAfter: 1, seed: 1 });
  life.advance(.8);
  assert.equal(life.activity, 'calm');
  life.advance(.3);
  assert.notEqual(life.activity, 'calm');
  assert.ok(['mouse', 'butterfly', 'laser', 'zoomies'].includes(life.activity));
});

test('wake returns the cat to the calm room state', () => {
  const life = new TvIdleLife({ idleAfter: 0, seed: 2 });
  life.advance(.01);
  assert.notEqual(life.activity, 'calm');
  life.wake();
  assert.equal(life.activity, 'calm');
  assert.equal(life.scene, 'room');
  assert.equal(life.prey, null);
});

test('prey and the cat stay inside the safe display area', () => {
  const life = new TvIdleLife({ idleAfter: 0, seed: 3 });
  for (let frame = 0; frame < 4000; frame++) {
    life.advance(1 / 60);
    assert.ok(life.catX >= 0 && life.catX <= 1);
    assert.ok(life.catY >= 0 && life.catY <= 1);
    assert.ok(life.preyX >= .08 && life.preyX <= .92);
  }
});
