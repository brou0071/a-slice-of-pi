import { useState } from 'react'
import './App.css'
import Reviews from './components/reviews'
import ReviewsChart from './components/reviewsCounts'
import OrdersPlaced from './components/ordersPlaced'
import MoneyMade, { type Order, type PriceList } from './components/moneyMade'
import orders from './data_sets/order_data.json'
import prices from './data_sets/pricing_data.json'
import { calculateTotal, filterByDateRange, type DateRange } from './components/helpers'

function App() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: '2023-01-01', end: '2023-12-31' });

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
          <span className="brand-mark">🇮🇹</span>
          <span className="brand-name">A Slice of Pi</span>
        </div>
        <nav className="nav">
          <a className="nav-item active" href="#">Overview</a>
          <a className="nav-item" href="#">Orders</a>
          <a className="nav-item" href="#">Menu &amp; Pricing</a>
          <a className="nav-item" href="#">Reviews</a>
          <a className="nav-item" href="#">Settings</a>
        </nav>
        <div className="sidebar-footer">
          <div className="who">
            <span className="who-name">John Doe</span>
            <span className="who-role">Owner</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="grid">
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
                max={dateRange.end || undefined}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              />
            </label>
            <label className="date-filter">
              <span>End date</span>
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start || undefined}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              />
            </label>
            {(dateRange.start || dateRange.end) && (
              <button
                type="button"
                className="date-filter-clear"
                onClick={() => setDateRange({ start: '', end: '' })}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="grid-2">
          <MoneyMade dateRange={dateRange} />
        </div>
        <div className="grid">
          <ReviewsChart dateRange={dateRange} />
          <OrdersPlaced dateRange={dateRange} />
          <Reviews />
        </div>
      </main>
    </div>
  )
}

export default App
