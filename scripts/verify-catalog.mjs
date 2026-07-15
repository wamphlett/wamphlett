#!/usr/bin/env node
// Fails loudly if any app's package.json pins one of the shared,
// catalog-managed dependencies to a literal version instead of "catalog:".
// This is what actually stops the four apps from drifting apart again —
// see pnpm-workspace.yaml's `catalog:` block for the pinned versions.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const rootDir = path.join(import.meta.dirname, '..');
const catalogDeps = [
  'next',
  'react',
  'react-dom',
  '@types/react',
  '@types/react-dom',
  'eslint',
  'eslint-config-next',
  'typescript',
];

const appsDir = path.join(rootDir, 'apps');
const apps = readdirSync(appsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

let hasViolations = false;

for (const app of apps) {
  const pkgPath = path.join(appsDir, app, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const sections = ['dependencies', 'devDependencies'];

  for (const section of sections) {
    const deps = pkg[section];
    if (!deps) continue;

    for (const dep of catalogDeps) {
      if (dep in deps && deps[dep] !== 'catalog:') {
        hasViolations = true;
        console.error(
          `apps/${app}/package.json: "${dep}" in ${section} is "${deps[dep]}", expected "catalog:"`,
        );
      }
    }
  }
}

if (hasViolations) {
  console.error(
    '\nOne or more apps pin a catalog-managed dependency directly instead of using "catalog:".\n' +
      'Fix by referencing pnpm-workspace.yaml\'s catalog entry instead of a literal version.',
  );
  process.exit(1);
}

console.log('verify-catalog: all apps reference the shared catalog versions.');
