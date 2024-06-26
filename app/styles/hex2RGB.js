/* eslint-disable no-bitwise */

/*
 * Taken from:
 * https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a#gistcomment-2615849
 */

const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;

export default str => {
  const [, short, long] = String(str).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff];
  }
  if (short) {
    return Array.from(short, s => Number.parseInt(s, 16)).map(
      n => (n << 4) | n,
    );
  }
  return undefined;
};
