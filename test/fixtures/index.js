// @ts-check
import { add } from './add';

/** @param {number[]} values */
export function total(...values) {
  return values.reduce((total, value) => add(total, value), 0);
}

export { add };
