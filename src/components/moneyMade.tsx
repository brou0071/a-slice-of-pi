import { LineChart } from '@mui/x-charts';
import orders from '../data_sets/order_data.json';
import prices from '../data_sets/pricing_data.json';
import { filterByDateRange, type DateRange } from './helpers';

type Size = "S" | "M" | "L";

interface OrderItem {
  type: string;
  size: Size;
}

export interface Order {
  order_id: number;
  store: string;
  items: OrderItem[];
  date: string;
}

export type PriceList = Record<string, Record<string, number>>;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthRange(orders: Order[]): string[] {
  if (orders.length === 0) {
    return [];
  }

  const monthKeys = orders.map((order) => order.date.slice(0, 7));
  const first = monthKeys.reduce((min, key) => (key < min ? key : min), monthKeys[0]);
  const last = monthKeys.reduce((max, key) => (key > max ? key : max), monthKeys[0]);

  const [startYear, startMonth] = first.split('-').map(Number);
  const [endYear, endMonth] = last.split('-').map(Number);

  const range: string[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const from = year === startYear ? startMonth : 1;
    const to = year === endYear ? endMonth : 12;
    for (let month = from; month <= to; month++) {
      range.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }
  return range;
}

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function calculateMonthlyTotal(
  orders: Order | Order[],
  prices: PriceList
): Record<string, number> {
  const orderList = Array.isArray(orders) ? orders : [orders];

  return orderList.reduce((monthlyTotals, order) => {
    const month = order.date.slice(0, 7); // "YYYY-MM"

    const orderTotal = order.items.reduce((sum, item) => {
      const price = prices[item.type]?.[item.size];
      if (price === undefined) {
        console.warn(`No price found for ${item.type} (${item.size})`);
        return sum;
      }
      return sum + price;
    }, 0);

    monthlyTotals[month] = (monthlyTotals[month] ?? 0) + orderTotal;
    return monthlyTotals;
  }, {} as Record<string, number>);
}

function MoneyMade({ dateRange }: { dateRange?: DateRange }) {
  const filteredOrders = filterByDateRange(orders as Order[], dateRange);
  const monthlyMoneyMade = calculateMonthlyTotal(filteredOrders, prices as PriceList);

  const monthKeys = getMonthRange(filteredOrders);
  const monthLabels = monthKeys.map(monthLabel);
  const monthlyData = monthKeys.map((monthKey) => monthlyMoneyMade[monthKey] ?? 0);

  return (
    <>
      <section className="money-made card">
        <h2>Money Made (per month)</h2>
        <LineChart
          height={220}
          series={[{ data: monthlyData, }]}
          xAxis={[{ scaleType: 'point', data: monthLabels, height: 28 }]}
          yAxis={[{ width: 50 }]}
        />
      </section>
    </>
  );
}

export default MoneyMade;