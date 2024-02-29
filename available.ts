/**
 * 判断值是否有意义
 * @param {any} value
 * @returns {boolean}
 * @example
 * isMainless('') true
 * isMainless(null) true
 * isMainless(undefined) true
 * isMainless(0) false
 * isMainless(false) false
 */
export const isMainless = (value: any): boolean => {
  if (value === '' || value === null || value === undefined) {
    return true;
  }
  return false;
};
