import { semverCompare } from './semverCompare';

export interface DependancyDiff {
  [pkg: string]: {
    'Changed To': string;
    'from': string;
  };
}

// Technically, we accept non-semver formats in the npm packages and in some
// cases our "versions" are just strings, so the regex on the site is overkill.
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const looksLikeAVersion = (v: string) => !/[^0-9a-zA-Z.+-]/.test(v) && /\d/.test(v);

export const suggestVersionUpgrade = (deps: DependancyDiff, baseCommand: string): string => {
  if (!deps) return;

  const commandParts = Object.entries(deps).reduce(
    (installCmd, [pkgName, diff]) => {
      const masterVersion = diff['Changed To'].replace(/^[^0-9a-zA-Z.]/, '');
      const localVersion = diff.from.replace(/^[^0-9a-zA-Z.]/, '');

      if (!looksLikeAVersion(masterVersion)) {
        return installCmd;
      } else if (!looksLikeAVersion(localVersion)) {
        return installCmd.concat(`${pkgName}@${masterVersion}`);
      }

      if (semverCompare(masterVersion, localVersion) < 0) {
        return installCmd;
      }

      return installCmd.concat(`${pkgName}@${masterVersion}`);
    },
    [baseCommand]
  );

  if (commandParts.length > 1) {
    return commandParts.join(' ');
  }
};

export default suggestVersionUpgrade;
