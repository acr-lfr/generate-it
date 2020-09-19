/**
 * The path is already converted from {params} to :params at this point
 */
export default (fullPath: string): string => {
  // Pass simple slash back
  if (fullPath === '/') {
    return '/';
  }
  // get all the path segments
  const pathParts = fullPath.split('/').filter(part => part.length > 0);

  // if we only have 1 segment, return / again
  if (pathParts.length === 1) {
    return '/';
  }

  // else remove the 1st segment and join the rest in a new path
  // this will be used typically in express after the routes importer
  pathParts.shift();
  return '/' + pathParts.join('/');
};
