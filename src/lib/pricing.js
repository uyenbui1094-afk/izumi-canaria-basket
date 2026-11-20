export const ROUNDING_UNIT = 1000;

export function roundToExcelThousand(value) {
  // Excel ROUND(value,-3) rounds half away from zero; prices are non-negative.
  return Math.floor((Number(value) + ROUNDING_UNIT / 2) / ROUNDING_UNIT) * ROUNDING_UNIT;
}

export function calculatePrice(listPrice, discounts) {
  let running = Number(listPrice) || 0;
  const lines = discounts.map(({ id, label, rate, note }) => {
    const before = running;
    running = before * (1 - rate);
    return { id, label, rate, discount: roundToExcelThousand(before - running), note };
  });
  return { listPrice: Number(listPrice) || 0, finalPrice: roundToExcelThousand(running), lines };
}

export function formatVND(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0));
}
