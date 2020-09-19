import ValidHttpMethods from '@/constants/ValidHttpMethods';

/**
 * Checks if a method is a valid HTTP method.
 */
export default (method: string) => {
  return ValidHttpMethods.indexOf(method.toUpperCase()) !== -1;
};
