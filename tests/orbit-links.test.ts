import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve(process.cwd(), 'src/lib/orbit-links.ts'), 'utf8');
const detailSource = readFileSync(resolve(process.cwd(), 'src/lib/orbit-projects.ts'), 'utf8');
const ids = [...source.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);
const detailIds = [...detailSource.matchAll(/id: '([^']+)'/g)].map((match) => match[1]);

test('primary orbit contains exactly five destinations in the required order', () => {
  assert.deepEqual(ids, ['modhew', 'met', 'sam-hao', 'github', 'contact']);
  assert.deepEqual(detailIds, ids);
  assert.equal(ids.length, 5);
});

test('primary orbit destinations have usable labels and verified detail targets', () => {
  assert.equal((source.match(/\{ id: '[^']+', title: [^,]+, subtitle:/g) ?? []).length, 5);
  assert.equal((source.match(/\{ id: '[^']+', title: [^,]+, subtitle:[\s\S]*?description:/g) ?? []).length, 5);
  assert.match(source, /href: `mailto:\$\{EMAIL\}`/);
});
