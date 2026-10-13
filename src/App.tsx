import { useState } from 'react'
import './App.css'
import Reviews from './components/reviews'
import ReviewsChart from './components/reviewsCounts'
import OrdersPlaced from './components/ordersPlaced'
import MoneyMade, { type Order, type PriceList } from './components/moneyMade'
import orders from './data_sets/order_data.json'
import prices from './data_sets/pricing_data.json'
import { calculateTotal, filterByDateRange, type DateRange } from './components/helpers'

// Actual date bounds of the dataset, used to clamp the date-range inputs so a
// user can't select a range that contains no data.
const orderDates = (orders as Order[]).map((order) => order.date);
const MIN_DATE = orderDates.reduce((min, date) => (date < min ? date : min), orderDates[0]);
const MAX_DATE = orderDates.reduce((max, date) => (date > max ? date : max), orderDates[0]);

function App() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: MIN_DATE, end: MAX_DATE });

  const filteredOrders = filterByDateRange(orders as Order[], dateRange);
  const totalMoneyMade = calculateTotal(filteredOrders, prices as PriceList);
  const formatterCAD = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">🍕</span>
          <span className="brand-name">A Slice of Pi</span>
        </div>
        <nav className="nav">
          <a className="nav-item" href="#overview">Overview</a>
          <a className="nav-item" href="#orders">Orders</a>
          <a className="nav-item" href="#money-made">Money Made</a>
          <a className="nav-item" href="#reviews">Reviews</a>
        </nav>
        <div className="sidebar-footer">
          <div className="who">
            <span className="who-name">John Doe</span>
            <span className="who-role">Owner</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="grid" id="overview">
          <div>
            <h2>2023 Pizza Sales Performance</h2>
            <p>Total money made in 2023: <strong>{formatterCAD.format(totalMoneyMade)}</strong></p>
          </div>
          <div className="date-filters">
            <label className="date-filter">
              <span>Start date</span>
              <input
                type="date"
                value={dateRange.start}
                min={MIN_DATE}
                max={dateRange.end || MAX_DATE}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              />
            </label>
            <label className="date-filter">
              <span>End date</span>
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start || MIN_DATE}
                max={MAX_DATE}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              />
            </label>
            {(dateRange.start !== MIN_DATE || dateRange.end !== MAX_DATE) && (
              <button
                type="button"
                className="date-filter-clear"
                onClick={() => setDateRange({ start: MIN_DATE, end: MAX_DATE })}
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="grid-2" id="money-made">
          <MoneyMade dateRange={dateRange} />
        </div>
        <div className="grid">
          <div id="reviews">
            <ReviewsChart dateRange={dateRange} />
          </div>
          <div id="orders">
            <OrdersPlaced dateRange={dateRange} />
          </div>
          <Reviews />
        </div>
      </main>
    </div>
  )
}

export default App
