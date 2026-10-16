import test from 'node:test';
import assert from 'node:assert/strict';
import { cardPosition, orbitState, snapOrbit, TAU } from '../src/lib/orbit-math.ts';
test('each snapped link reaches the front of the same world-space ellipse',()=>{
  for(let i=0;i<6;i++){const p=cardPosition(i,6,i*TAU/6,4,2.5);assert.ok(Math.abs(p.x)<1e-10);assert.equal(p.z,2.5);}
  assert.ok(cardPosition(3,6,0,4,2.5).z<0);
});
test('cycle percent and signed revolutions wrap consistently in both directions',()=>{
  assert.deepEqual(orbitState(0,6),{active:0,percent:0,revolution:0});
  assert.equal(orbitState(TAU,6).revolution,1);assert.equal(orbitState(TAU,6).percent,0);
  assert.equal(orbitState(-TAU/6,6).active,5);assert.equal(orbitState(-TAU/6,6).revolution,-1);
  assert.ok(Math.abs(orbitState(TAU/2,6).percent-50)<1e-9);
});
test('snap bounds inertia and cancellation settles without inertia',()=>{
  const step=TAU/6;assert.equal(snapOrbit(.4,10,6),step);assert.equal(snapOrbit(.4,10,6,true),0);
  assert.equal(snapOrbit(-.4,-10,6),-step);assert.ok(Math.abs(snapOrbit(100*TAU,0,6)-100*TAU)<1e-9);
  assert.equal(orbitState(snapOrbit(100*TAU,0,6),6).percent,0);
});
