export default () => {
  let hr = '';
  for (let i = 0; i < process.stdout.columns; ++i) {
    hr += '-';
  }
  console.log(hr);
};
