export default (): string => {
  let hr = '';
  for (let i = 0; i < process.stdout.columns; ++i) {
    hr += '-';
  }
  return hr;
};
