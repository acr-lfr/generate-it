export default (obj: object, isNumber: number) => {
  return (Object.keys(obj).length === isNumber);
};
