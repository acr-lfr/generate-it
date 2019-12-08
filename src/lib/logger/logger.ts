export default (o: any) => {
  if (typeof o === 'object') {
    console.log(JSON.stringify(o, undefined, 2));
  } else {
    console.log(o);
  }
};
