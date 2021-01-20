import deepmerge from 'deepmerge';

export const mergePackageJsonFiles = (
  usersJson: Record<string, any>,
  tplJson: Record<string, any>,
  additionalContent: Record<string, any>,
): Record<string, any> => {
  // merge the package json files together
  return deepmerge.all([tplJson, additionalContent, usersJson]);
};
