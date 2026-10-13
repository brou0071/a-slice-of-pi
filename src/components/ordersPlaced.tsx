import { useState } from 'react';
import data from '../data_sets/order_data.json';
import { BarChart } from '@mui/x-charts/BarChart';
import { filterByDateRange, type DateRange } from './helpers';

interface Order {
  order_id: number;
  store: string;
  items: Array<{
    type: string;
    size: string;
  }>;
  date: string;
}
type OrderLocation = 'Kanata' | 'Orleans' | 'Downtown' | 'Sandy Hill' | 'The Glebe';

const STORES: OrderLocation[] = ['Kanata', 'Orleans', 'Downtown', 'Sandy Hill', 'The Glebe'];
const PIZZA_TYPES = ['Cheese', 'Pepperoni', 'Deluxe', 'Hawaiian', 'Meatlovers'];
const PIZZA_SIZES = ['S', 'M', 'L'];

const ALL = 'All';

function OrdersPlaced({ dateRange }: { dateRange?: DateRange }) {
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [sizeFilter, setSizeFilter] = useState<string>(ALL);

  function getCountData(orders: Order[]) {
    const countData: Record<OrderLocation, number> = {
      'Kanata': 0,
      'Orleans': 0,
      'Downtown': 0,
      'Sandy Hill': 0,
      'The Glebe': 0,
    };

    for (const order of orders) {
      if (!(order.store in countData)) {
        continue;
      }

      const matches = order.items.some((item) => {
        const typeMatch = typeFilter === ALL || item.type === typeFilter;
        const sizeMatch = sizeFilter === ALL || item.size === sizeFilter;
        return typeMatch && sizeMatch;
      });

      if (matches) {
        countData[order.store as OrderLocation]++;
      }
    }
    return countData;
  }

  const dateFilteredOrders = filterByDateRange(data, dateRange);
  const counts = getCountData(dateFilteredOrders);
  const seriesData = STORES.map((store) => counts[store]);

  const tickLabelStyle = {
    fill: '#fff',
    fontSize: 14,
  };

  return (
    <section className="reviews card">
      <h2>Orders Placed in 2023 (per store)</h2>

      <div className="orders-filters">
        <label className="orders-filter">
          <span>Pizza type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value={ALL}>All types</option>
            {PIZZA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="orders-filter">
          <span>Pizza size</span>
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
          >
            <option value={ALL}>All sizes</option>
            {PIZZA_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <BarChart
        xAxis={[{
          data: [...STORES],
          colorMap: {
            type: "ordinal",
            values: [...STORES],
            colors: ['#F23947', '#0CA3FC', '#A33AFF', '#FAB74C', '#EF5835'],
          },
          tickLabelStyle,
        }]}
        yAxis={[{
          tickLabelStyle,
        }]}
        series={[{ data: seriesData }]}
        height={300}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: '#fff',
            strokeWidth: 2,
          },
          '& .MuiChartsAxis-tick': {
            stroke: '#fff',
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: '#fff',
          },
          '& .MuiChartsAxis-label': {
            fill: '#fff',
          },
        }}
      />
    </section>
  )
}

export default OrdersPlaced;
