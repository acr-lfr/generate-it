export const semverCompare = (versionA: string, versionB: string) => {
  const [coreA, preA] = (versionA || '')
    .replace(/\+.*/, '')
    .split('-')
    .map((s) => s.split('.'));
  const [coreB, preB] = (versionB || '')
    .replace(/\+.*/, '')
    .split('-')
    .map((s) => s.split('.'));

  const coreCmp = (a1: string, b1: string) => {
    if (Number.isNaN(Number(a1)) || Number.isNaN(Number(b1))) {
      return 0;
    }
    return +a1 - +b1;
  };

  const preCmp = (a1: string, b1: string) => {
    if (!Number.isNaN(Number(a1)) && !Number.isNaN(Number(b1))) {
      return +a1 - +b1;
    }
    return a1.localeCompare(b1);
  };

  for (let i = 0; i < coreA.length; ++i) {
    const n = coreCmp(coreA[i], coreB[i]);
    if (n) return n;
  }

  if (preB && !preA) return 1;
  if (preA && !preB) return -1;

  for (let i = 0; i < (preA || []).length; ++i) {
    if (preB.length === i) return 1;
    if (preA[i] === preB[i]) continue;

    const n = preCmp(preA[i], preB[i]);
    if (n) return n;
  }

  return -1;
};

export default semverCompare;
