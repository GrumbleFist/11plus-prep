// Tree + bank loader. Fetches JSONs once, caches in memory.
// Phase 9 skill-tree substrate. Banks referenced from trees[].branches[].bankRef.

const treeCache = {};
const bankCache = {};

function basePath() {
  const p = window.location.pathname;
  return p.endsWith('/') ? p : p.replace(/[^/]*$/, '');
}

export async function getTree(subject) {
  if (treeCache[subject]) return treeCache[subject];
  const url = `${basePath()}js/data/trees/${subject}.json`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Tree fetch failed: ${subject} (${r.status})`);
  treeCache[subject] = await r.json();
  return treeCache[subject];
}

export async function getBranch(subject, branchId) {
  const tree = await getTree(subject);
  return tree.branches.find(b => b.id === branchId) || null;
}

// bankRef is relative to js/data/ (e.g. "banks/english/spelling.json")
export async function getBank(bankRef) {
  if (bankCache[bankRef]) return bankCache[bankRef];
  const url = `${basePath()}js/data/${bankRef}`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      bankCache[bankRef] = null;
      return null;
    }
    bankCache[bankRef] = await r.json();
    return bankCache[bankRef];
  } catch {
    bankCache[bankRef] = null;
    return null;
  }
}

// Pull items matching a specific level within a bank.
// Returns [] if bank exists but level empty; returns null if bank missing.
export async function getBankItemsForLevel(subject, branchId, level) {
  const branch = await getBranch(subject, branchId);
  if (!branch || !branch.bankRef) return null;
  const bank = await getBank(branch.bankRef);
  if (!bank || !Array.isArray(bank.items)) return null;
  return bank.items.filter(it => it && it.metadata && it.metadata.level === level);
}

export function clearCache() {
  Object.keys(treeCache).forEach(k => delete treeCache[k]);
  Object.keys(bankCache).forEach(k => delete bankCache[k]);
}
