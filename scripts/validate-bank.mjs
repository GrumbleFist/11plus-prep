#!/usr/bin/env node
// Run validator battery against one or more bank JSON files.
// Usage:
//   node scripts/validate-bank.mjs js/data/banks/english/spelling.json
//   node scripts/validate-bank.mjs js/data/banks/english/*.json
//
// Exit code 0 = all pass. 1 = validation failed. 2 = invalid input.

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateBank } from './validators.mjs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/validate-bank.mjs <bank.json> [<bank.json> ...]');
  process.exit(2);
}

let totalFailing = 0;
let totalBankIssues = 0;

for (const file of files) {
  const path = resolve(process.cwd(), file);
  let bank;
  try {
    bank = JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    console.error(`\n[FAIL] ${file}: cannot parse — ${err.message}`);
    totalBankIssues++;
    continue;
  }

  const report = validateBank(bank);
  const header = `${report.subject}/${report.branch} — ${report.totalItems} items`;

  if (report.failingItems.length === 0 && report.bankIssues.length === 0) {
    console.log(`[PASS] ${file}  (${header})`);
    continue;
  }

  console.log(`\n[FAIL] ${file}  (${header})`);
  for (const item of report.failingItems) {
    console.log(`  item ${item.index} (${item.id}):`);
    for (const issue of item.issues) console.log(`    - ${issue}`);
  }
  for (const issue of report.bankIssues) console.log(`  ${issue}`);

  totalFailing += report.failingItems.length;
  totalBankIssues += report.bankIssues.length;
}

console.log(`\nSummary: ${totalFailing} failing items, ${totalBankIssues} bank-level issues across ${files.length} file(s).`);
process.exit(totalFailing + totalBankIssues > 0 ? 1 : 0);
