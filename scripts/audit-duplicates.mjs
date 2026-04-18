#!/usr/bin/env node
// Scan one or more bank files for near-duplicates across items.
// Current strategy: exact-match on normalised correct+prompt (hash key),
// plus Jaccard similarity > 0.85 on prompt token sets.
//
// Usage: node scripts/audit-duplicates.mjs js/data/banks/english/*.json

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/audit-duplicates.mjs <bank.json> [...]');
  process.exit(2);
}

function tokens(text) {
  return new Set(String(text || '').toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

const allItems = [];
for (const file of files) {
  const bank = JSON.parse(await readFile(resolve(process.cwd(), file), 'utf8'));
  for (const item of bank.items) {
    allItems.push({ file, item, tokens: tokens(item.prompt) });
  }
}

const exactDupes = new Map();
for (const rec of allItems) {
  const key = `${String(rec.item.correct || '').toLowerCase().trim()}|${String(rec.item.prompt || '').toLowerCase().trim()}`;
  if (!exactDupes.has(key)) exactDupes.set(key, []);
  exactDupes.get(key).push(rec);
}

let exactDupeCount = 0;
for (const [key, group] of exactDupes) {
  if (group.length > 1) {
    exactDupeCount += group.length - 1;
    console.log(`\n[EXACT-DUPE] ${group.length} items share correct+prompt:`);
    for (const g of group) console.log(`  ${g.item.id} in ${g.file}`);
  }
}

let nearDupeCount = 0;
for (let i = 0; i < allItems.length; i++) {
  for (let j = i + 1; j < allItems.length; j++) {
    const a = allItems[i];
    const b = allItems[j];
    if (!a.tokens.size || !b.tokens.size) continue;
    if (a.item.correct === b.item.correct && a.item.prompt === b.item.prompt) continue; // already caught
    const sim = jaccard(a.tokens, b.tokens);
    if (sim > 0.85) {
      nearDupeCount++;
      console.log(`\n[NEAR-DUPE] jaccard ${sim.toFixed(2)}:`);
      console.log(`  ${a.item.id}: ${String(a.item.prompt).slice(0, 80)}`);
      console.log(`  ${b.item.id}: ${String(b.item.prompt).slice(0, 80)}`);
    }
  }
}

console.log(`\nScanned ${allItems.length} items across ${files.length} file(s): ${exactDupeCount} exact dupes, ${nearDupeCount} near-dupes.`);
process.exit(exactDupeCount > 0 ? 1 : 0);
