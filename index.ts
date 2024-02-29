/*
 * @Author: songyan.shi
 * @Date: 2021-04-09 23:06:09
 * @Last Modified by:   songyan.shi
 * @Last Modified time: 2021-04-09 23:06:09
 */
import BigNumber from 'bignumber.js';
import { isMainless } from './available';

/**
 * 千分位分割添加符号
 * @param {string|number} value
 * @param {string} separator 分隔符，默认为 ","
 * @returns {string}
 * @example
 * const number = breakNumber(123456)
 * // 123,456
 * const number = breakNumber(123456, '?')
 * // 123?456
 */
export const breakNumber = (
  value?: string | number,
  separator?: string
): string => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return '';
  }

  /** 科学计数法 */
  if (typeof value === 'number' && value.toString().includes('e')) {
    value = toNonExponential(value);
  }

  const schar = separator || ',';
  return value
    .toString()
    .replace(/[^.-\d]/g, '')
    .replace(/\d+/, (n) =>
      n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => `${$1}${schar}`)
    );
};

/**
 * 千分位分割并添加前后缀
 * @param {string|number} value
 * @param {obj} options
 * @returns {string}
 * @example
 * const number = breakNumberAddfix(123456, {
 *    suffix: '%'
 * })
 * // 123,456%
 * const number = breakNumberAddfix(123456, {
 *    prefix: '$'
 * })
 * // $123,456
 */
export const breakNumberAddfix = (
  value: string | number,
  options?: {
    prefix?: string;
    suffix?: string;
    separator?: string;
  }
): string => {
  const { prefix, suffix, separator } = options || {};
  const breakedNumber = breakNumber(value, separator);
  if (!breakedNumber) return '';
  let number = breakedNumber;
  if (prefix) {
    number = `${prefix}${breakedNumber}`;
  }
  if (suffix) {
    number = `${number}${suffix}`;
  }
  return number;
};

/**
 * 获取数字字符串，负数、小数
 * @param {string} input
 * @returns {string}
 * @example
 * const string = getNumberString('$9.88')
 * // 9.88
 */
export const getNumberString = (input: string): string => {
  if (typeof input === 'number') return `${input}`;
  if (typeof input !== 'string') return '';
  return input.replace(/[^.-\d]/g, '');
};

/**
 * 获取电话号，可能有区号 允许带有 -
 * @param {string} input
 * @returns {string}
 * @example
 * const string = getPhone('--05qw12-8888-88q@#w-e12你好r--')
 * // 0512-88888812
 */
export const getPhone = (input: string | number): string | null => {
  if (typeof input === 'number') {
    return getPhone(`${input}`);
  }
  if (typeof input !== 'string') return null;
  let output = input.replace(/[^0-9-]/gi, '');
  output = output.replace(/^-{0,}|-{0,}$/g, '');
  output = output.replace(/-/, '@');
  output = output.replace(/-/g, '');
  output = output.replace(/@/, '-');
  return output;
};

/**
 * 反科学计数法，避免小数高精度或者大数显示为科学计数法而导致渲染异常
 * @param num
 * @returns
 * @example
 *
 * 0.00000000001 ===> 1e-11
 * toNonExponential(0.00000000001) ===> 0.00000000001
 *
 * 100000000000000000000000 ===> 1e+23
 * toNonExponential(100000000000000000000000) ===> 100000000000000000000000
 *
 */
export const toNonExponential = (num: string | number): string => {
  if (isMainless(num)) {
    return '';
  }

  let number = num;

  if (typeof number === 'number') {
    number = num.toString();
  }

  /** 非科学计数法 */
  if (!number.includes('e')) {
    return number;
  }

  return new BigNumber(num).toFixed();
};
