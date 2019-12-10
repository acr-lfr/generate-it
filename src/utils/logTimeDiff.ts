import 'colors';
export default (time1: number, time2: number, green?: boolean) => {
  const diff = Math.round((time2 - time1) / 1000);
  const str = `Seconds passed: ${diff}`;
  if (green) {
    // @ts-ignore
    console.log(str.green);
  } else {
    console.log(str);
  }
};
