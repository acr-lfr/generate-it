/**
 * Returns the single 200-level response in responses,
 * or undefined if not only 1 exists
 */
export default (responses: { [key: string]: any; [key: number]: any }): number => {
  const codes = Object.keys(responses).filter((code) => /^2[0-9]+$/.test(code));

  return codes?.length === 1 ? parseInt(codes[0], 10) : undefined;
};
