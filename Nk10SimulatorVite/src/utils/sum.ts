export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}
