export function formatLargeNumber(n: number) {
  const abbreviations = ['K', 'M', 'B', 'T'];

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const factor = Math.pow(10, (i + 1) * 3);
    if (Number(n) >= factor) {
      return (
        parseFloat((Number(n) / factor).toFixed(1)).toString() +
        abbreviations[i]
      );
    }
  }

  return Math.floor(n).toString();
}
