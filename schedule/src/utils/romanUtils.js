/**
 * Converts a positive number to Roman numerals.
 * e.g., 1 -> 'I', 2 -> 'II', 3 -> 'III', 4 -> 'IV', 5 -> 'V', etc.
 * Returns '0' if number is 0 or non-positive.
 */
export function toRoman(num) {
  const n = parseInt(num, 10);
  if (isNaN(n) || n <= 0) return '0';

  const lookup = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  let result = '';
  let remaining = n;
  for (const { value, numeral } of lookup) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}
