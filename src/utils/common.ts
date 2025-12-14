/**
 * Find closest value index
 *
 * @param arr Sorted array
 * @param target
 * @returns
 */
export const findClosestScrollIndex = (arr: number[], target: number, offset = 120) => {
  const n = arr.length;

  if (target <= arr[0]) return 0;
  if (target >= arr[n - 1]) return n - 1;

  for (let i = 0; i < n; i++) {
    const val = arr[i];
    if (val < target) {
      continue;
    }
    if (val - offset < target) return i;
    else return i > 0 ? i - 1 : 0;
  }

  return n - 1;
};

export const shortenString = (str: string, startLength = 6, endLength = 4) => {
  if (!str || str.length <= startLength + endLength) return str;
  return str.slice(0, startLength) + '...' + str.slice(-endLength);
};
