import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, roundToExcelThousand } from './pricing.js';

describe('pricing calculation', () => {
  it('rounds to the nearest 1,000 VND', () => {
    assert.equal(roundToExcelThousand(1_234_499), 1_234_000);
    assert.equal(roundToExcelThousand(1_234_500), 1_235_000);
  });
  it('applies discounts sequentially instead of adding percentages', () => {
    const result = calculatePrice(10_000_000, [
      { id: 'a', label: 'A', rate: 0.12 },
      { id: 'b', label: 'B', rate: 0.005 },
    ]);
    assert.equal(result.finalPrice, 8_751_000);
    assert.equal(result.lines.length, 2);
  });
  it('keeps accepted bank guarantee at zero discount', () => {
    const result = calculatePrice(10_000_000, [{ id: 'bank', label: 'Nhận bảo lãnh', rate: 0 }]);
    assert.equal(result.finalPrice, 10_000_000);
    assert.equal(result.lines[0].discount, 0);
  });
});
