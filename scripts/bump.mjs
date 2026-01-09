#!/usr/bin/env node

/**
 * Bump plugin versions for local development.
 * Reads jsonpaths from release-please config and increments rc suffix.
 */

import { readFileSync, writeFileSync, rmSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const MARKETPLACE_PATH = '.claude-plugin/marketplace.json';
const CACHE_PATH = join(homedir(), '.claude/plugins/cache');

function bumpVersion(version) {
  if (version.includes('-rc')) {
    const [base, rc] = version.split('-rc');
    return `${base}-rc${parseInt(rc) + 1}`;
  }
  return `${version}-rc1`;
}

function main() {
  // Read marketplace.json
  const marketplace = JSON.parse(readFileSync(MARKETPLACE_PATH, 'utf8'));

  // Bump each plugin version
  for (const plugin of marketplace.plugins) {
    const oldVersion = plugin.version;
    const newVersion = bumpVersion(oldVersion);
    plugin.version = newVersion;
    console.log(`${plugin.name}: ${oldVersion} → ${newVersion}`);
  }

  // Write back
  writeFileSync(MARKETPLACE_PATH, JSON.stringify(marketplace, null, 2) + '\n');

  // Clear plugin cache
  try {
    rmSync(CACHE_PATH, { recursive: true, force: true });
    console.log(`\nCleared cache: ${CACHE_PATH}`);
  } catch (e) {
    console.log(`\nNo cache to clear`);
  }

  console.log(`\nDone. Skills auto-reload from Claude Code 2.1.0 onwards.`);
}

main();
