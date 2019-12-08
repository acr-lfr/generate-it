export default (value: any) => {
  return (value.security && value.security.length > 0);
};
