interface Args {
  numberOfItems: number;
  index: number;
  gap: 12 | 18;
}

// for two items, it should return "44%" and "56%"
// for three items, it should return "38%", "50%", and "62%"
export function getLeft({ gap, index, numberOfItems }: Args): number {
  return 50 - ((numberOfItems - 1) * gap) / 2 + index * gap;
}
