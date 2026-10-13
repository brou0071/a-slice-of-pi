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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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

  const monthlyData = months.map((_, index) => {
    const monthKey = `2023-${String(index + 1).padStart(2, '0')}`;
    return monthlyMoneyMade[monthKey] ?? 0;
  });

  return (
    <>
      <section className="money-made card">
        <h2>Money Made 2023 (per month)</h2>
        <LineChart
          height={220}
          series={[{ data: monthlyData, }]}
          xAxis={[{ scaleType: 'point', data: months, height: 28 }]}
          yAxis={[{ width: 50 }]}
        />
      </section>
    </>
  );
}

export default MoneyMade;