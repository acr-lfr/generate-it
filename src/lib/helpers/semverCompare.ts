export const semverCompare = (versionA: string, versionB: string) => {
  const [coreA, preA] = (versionA || '')
    .replace(/\+.*/, '')
    .split('-')
    .map((s) => s.split('.'));
  const [coreB, preB] = (versionB || '')
    .replace(/\+.*/, '')
    .split('-')
    .map((s) => s.split('.'));

  const partCmp = (a1: string, b1: string) =>
    Number.isNaN(a1 + b1) ? 0 : +a1 - +b1 || a1.localeCompare(b1);

  for (let i = 0; i < coreA.length; ++i) {
    const n = partCmp(coreA[i], coreB[i]);
    if (n) return n;
  }

  if (preB && !preA) return 1;
  if (preA && !preB) return -1;

  for (let i = 0; i < (preA || []).length; ++i) {
    if (preB.length === i) return 1;
    if (preA[i] === preB[i]) continue;

    const n = partCmp(preA[i], preB[i]);
    if (n) return n;
  }

  return -1;
};

export default semverCompare;
