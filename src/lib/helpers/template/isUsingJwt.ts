export default (value: any) => {
  return (Object.keys(value.security[0])[0].startsWith('jwtToken'));
};
