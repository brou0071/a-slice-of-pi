import type { Order, PriceList } from "./moneyMade";

export function calculateTotal(orders: Order | Order[], prices: PriceList): number {
  const orderList = Array.isArray(orders) ? orders : [orders];

  return orderList.reduce((total, order) => {
    const orderTotal = order.items.reduce((sum, item) => {
      const price = prices[item.type]?.[item.size];
      if (price === undefined) {
        console.warn(`No price found for ${item.type} (${item.size})`);
        return sum;
      }
      return sum + price;
    }, 0);
    return total + orderTotal;
  }, 0);
}

export interface DateRange {
  start: string;
  end: string;
}

export function filterByDateRange<T extends { date: string }>(
  items: T[],
  range?: DateRange
): T[] {
  if (!range || (!range.start && !range.end)) {
    return items;
  }

  return items.filter((item) => {
    if (range.start && item.date < range.start) {
      return false;
    }
    if (range.end && item.date > range.end) {
      return false;
    }
    return true;
  });
}
