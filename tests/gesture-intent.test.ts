import test from 'node:test';
import assert from 'node:assert/strict';
import { gestureIntent, projectedSnap } from '../src/lib/gesture-intent.ts';

test('jitter does not select an axis; vertical and diagonal swipes yield to scrolling', () => {
  for (const [x,y] of [[0,0],[7,7],[-7,3]]) assert.equal(gestureIntent(x,y), 'pending');
  for (const [x,y] of [[0,10],[5,-30],[30,30],[-40,90],[110,100]]) assert.equal(gestureIntent(x,y), Math.abs(x)>Math.abs(y) ? 'pending' : 'vertical');
});
test('deliberate horizontal swipes work in both directions and at every card height', () => {
  for (const [x,y] of [[8,0],[-8,0],[100,20],[-100,-20]]) assert.equal(gestureIntent(x,y), 'horizontal');
});
test('inertia snaps to real project positions, stays finite and cancellation ignores velocity', () => {
  assert.equal(projectedSnap(20,200,46,276),46);
  assert.equal(projectedSnap(100,-200,46,276),46);
  assert.equal(projectedSnap(0,-900,46,276),0);
  assert.equal(projectedSnap(276,900,46,276),276);
  assert.equal(projectedSnap(20,400,46,276,true),0);
  assert.equal(projectedSnap(138,0,46,276),138);
});
