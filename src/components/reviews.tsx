import data from '../data_sets/review_data.json';

export interface Review {
  review_id: number;
  store: string;
  sentiment: 'angry' | 'sad' | 'happy' | 'delighted';
  message: string;
  date: string;
}

function Reviews() {

  return (
    <section className="reviews card">
      <h2>Reviews in 2023</h2>
      <ul className="review-list">
        {data.map((review) => (
          <li className="review" key={review.review_id}>
            <div className="review-top">
              <span className="review-name">{`${review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}:`}</span>
              <span className="emoji">
                {review.sentiment === 'angry' && '★☆☆☆☆'}
                {review.sentiment === 'sad' && '★★☆☆☆'}
                {review.sentiment === 'happy' && '★★★☆☆'}
                {review.sentiment === 'delighted' && '★★★★☆'}
              </span>
            </div>
            <p className="review-text">{review.message}</p>
            <span className="muted small">{`${review.store} - ${review.date}`}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Reviews;