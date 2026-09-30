import { Link } from 'react-router-dom';
import { formatCurrency, calculateTripTotal } from '../services/mockTrips';

function TripCard({ trip }) {
  const totalExpenses = calculateTripTotal(trip.expenses);

  return (
    <article className="trip-card">
      <div className="trip-card__header">
        <div>
          <p className="eyebrow">Trip</p>
          <h3>{trip.name}</h3>
        </div>
        <span className="trip-badge">{trip.members.length} Members</span>
      </div>

      <div className="trip-card__details">
        <p>{trip.destination}</p>
        <p>{trip.members.length} Members</p>
        <p>{formatCurrency(totalExpenses)} Total Expenses</p>
      </div>

      <Link to={`/trips/${trip.id}`} className="primary-btn trip-card__action">
        View Trip <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default TripCard;
