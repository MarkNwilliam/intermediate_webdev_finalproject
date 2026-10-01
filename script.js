'use strict';

/**
 * Interest Rate Calculator.
 *
 * Simple interest is calculated as (principal * rate * time) / 100, and the
 * total amount is the principal plus that interest.
 *
 * Every value read from the page is a string, so each one is converted with
 * parseFloat() before it is used. Reading a value that is missing or blank
 * would otherwise throw a TypeError on toFixed(), which is the failure this
 * script is required to prevent.
 */

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Converts a raw field value to a number.
 *
 * @param {string|number} value Raw value, typically input.value.
 * @returns {number} The parsed number.
 * @throws {TypeError} If the value is blank or cannot be parsed as a number.
 */
function toNumber(value) {
  // parseFloat('') is NaN, but an empty string must be rejected with a clear
  // message rather than producing a misleading result.
  if (value === null || value === undefined || String(value).trim() === '') {
    throw new TypeError('Please enter a valid number for every field.');
  }

  const parsed = parseFloat(value);

  if (Number.isNaN(parsed)) {
    throw new TypeError('"' + value + '" is not a valid number.');
  }

  return parsed;
}

/**
 * Calculates simple interest and the total amount.
 *
 * @param {string|number} principal Principal amount.
 * @param {string|number} rate      Annual interest rate as a percentage.
 * @param {string|number} time      Term in years.
 * @returns {{principal: number, simpleInterest: number, amount: number}}
 */
function computeInterest(principal, rate, time) {
  const p = toNumber(principal);
  const r = toNumber(rate);
  const t = toNumber(time);

  if (p < 0 || r < 0 || t < 0) {
    throw new RangeError('Values cannot be negative.');
  }

  const simpleInterest = (p * r * t) / 100;

  // The total amount is the principal plus the interest earned.
  const amount = p + simpleInterest;

  return {
    principal: Math.round(p * 100) / 100,
    simpleInterest: Math.round(simpleInterest * 100) / 100,
    amount: Math.round(amount * 100) / 100,
  };
}

function showError(message) {
  const node = document.getElementById('error-message');
  if (!node) return;
  node.textContent = message;
  node.hidden = message === '';
}

/**
 * Reads the form, calculates the result and renders it into #result.
 *
 * Called by the Calculate button's onclick handler.
 */
function calculate() {
  const resultNode = document.getElementById('result');

  try {
    const p = document.getElementById('principal').value;
    const r = document.getElementById('rate').value;
    const t = document.getElementById('time').value;

    const { principal, simpleInterest, amount } = computeInterest(p, r, t);

    showError('');

    if (resultNode) {
      resultNode.innerHTML =
        '<div class="result-row"><span>Principal Amount:</span><span>' +
        currency.format(principal) +
        '</span></div>' +
        '<div class="result-row"><span>Total Interest:</span><span>' +
        currency.format(simpleInterest) +
        '</span></div>' +
        '<div class="result-row"><span>Total Amount:</span><span>' +
        currency.format(amount) +
        '</span></div>';
    }
  } catch (error) {
    showError(error.message);
    if (resultNode) resultNode.innerHTML = '';
  }
}

// Exported for the Jasmine specs; also a global so onclick="calculate()" works.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculate, computeInterest, toNumber };
}