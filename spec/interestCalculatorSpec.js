// script.js is CommonJS so it can be loaded with a plain <script> tag in the
// browser; the spec therefore pulls it in with require.
const { computeInterest } = require('../script.js');

describe('Interest Rate Calculator', () => {
  it('correctly calculates simple interest and the total amount', () => {
    // 1000 at 5% for 1 year: interest = (1000 * 5 * 1) / 100 = 50.
    const result = computeInterest(1000, 5, 1);

    expect(result.simpleInterest).toBeCloseTo(50, 2);
    expect(result.principal).toBeCloseTo(1000, 2);

    // The total amount is the principal plus the interest earned.
    expect(result.amount).toBeCloseTo(1050, 2);
    expect(result.amount).toBeCloseTo(result.principal + result.simpleInterest, 2);

    // A longer term at a higher rate earns proportionally more.
    const longer = computeInterest(1000, 5, 3);
    expect(longer.simpleInterest).toBeCloseTo(150, 2);
    expect(longer.amount).toBeCloseTo(1150, 2);
  });

  it('accepts string inputs from the DOM and rejects non-numeric values', () => {
    // Values read from inputs arrive as strings; they must still work.
    const fromStrings = computeInterest('1000', '5', '1');
    const fromNumbers = computeInterest(1000, 5, 1);

    expect(fromStrings).toEqual(fromNumbers);
    expect(fromStrings.simpleInterest).toBeCloseTo(50, 2);

    // A missing or malformed value must be reported, not silently coerced.
    expect(() => computeInterest('abc', 5, 1)).toThrowError(TypeError);
    expect(() => computeInterest(1000, 5, undefined)).toThrowError(TypeError);
    expect(() => computeInterest(1000, 5, null)).toThrowError(TypeError);

    // A cleared field must be rejected explicitly rather than read as 0.
    expect(() => computeInterest('', 5, 1)).toThrowError(TypeError);
    expect(() => computeInterest(1000, '', 1)).toThrowError(TypeError);
    expect(() => computeInterest(1000, 5, '')).toThrowError(TypeError);

    // Negative values are out of domain.
    expect(() => computeInterest(-1000, 5, 1)).toThrowError(RangeError);
  });
});