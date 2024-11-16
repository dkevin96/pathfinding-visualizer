export function ensureOdd(size) {
  if (size % 2 === 0) {
    return size - 1;
  } else {
    return size;
  }
}
