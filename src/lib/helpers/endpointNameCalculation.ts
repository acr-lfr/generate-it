import ucFirst from '@/lib/template/helpers/ucFirst';

export default (fullPath: string, config: { segmentFirstGrouping?: number }): string => {
  // double check the 1st char is /
  if (fullPath[0] !== '/') {
    fullPath = '/' + fullPath;
  }

  if (fullPath === '/') {
    return 'root';
  }
  if (!config.segmentFirstGrouping) {
    return fullPath.split('/')[1];
  }
  const {segmentFirstGrouping} = config;
  const segments = fullPath.split('/');
  // Get rid of the empty slot
  segments.shift();

  if (segmentFirstGrouping >= segments.length) {
    return fullPath.split('/')[1];
  }

  return segments[0].replace(/{*}*/gm, '')
    + ucFirst(segments[segmentFirstGrouping].replace(/{*}*/gm, ''));
};
