import data from '../data_sets/review_data.json';
import { PieChart } from '@mui/x-charts/PieChart';
import { filterByDateRange, type DateRange } from './helpers';

function ReviewsCounts({ dateRange }: { dateRange?: DateRange }) {
  type ReviewSentiment = 'angry' | 'sad' | 'happy' | 'delighted';

  function getCountData(reviews: Array<{ sentiment: string }>) {
    const countData: Record<ReviewSentiment, number> = {
      angry: 0,
      sad: 0,
      happy: 0,
      delighted: 0,
    };

    for (const review of reviews) {
      const sentiment = review.sentiment as ReviewSentiment;
      countData[sentiment]++;
    }
    return countData;
  }

  const filtered = filterByDateRange(data, dateRange);

  return (
    <section className="reviews card">
      <h2>Reviews received in 2023 (per sentiment)</h2>
      <br />
      <PieChart
        series={[
          {
            data: Object.entries(getCountData(filtered)).map(([sentiment, value]) => ({
              id: sentiment,
              value: value,
              label: `${value} ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}`,
              color: sentiment === 'angry'
                ? '#F23947'
                : sentiment === 'sad'
                  ? '#0CA3FC'
                  : sentiment === 'happy'
                    ? '#A33AFF'
                    : '#FAB74C',
            })),
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        width={200}
        height={200}
      />
    </section>
  )
}

export default ReviewsCounts;
