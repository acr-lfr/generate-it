export default (time1: number, time2: number) => {
  const diff = Math.round((time2 - time1) / 1000);
  console.log(`Seconds passed: ${diff}`);
};
