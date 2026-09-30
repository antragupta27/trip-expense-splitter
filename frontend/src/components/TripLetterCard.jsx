function TripLetterCard({ trip }) {
  return (
    <section className="letter-card">
      <div className="letter-card__topline">
        <span className="letter-card__label">Trip Details</span>
        <span className="letter-card__stamp">✈</span>
      </div>

      <div className="letter-card__content">
        <p className="letter-card__greeting">Dear Traveler,</p>
        <p>
          Your trip to <strong>{trip.destination}</strong> is scheduled from{' '}
          <strong>{trip.startDate}</strong> to <strong>{trip.endDate}</strong>.
        </p>
        <p>
          Destination: <strong>{trip.destination}</strong>
        </p>
        <p>
          Members: <strong>{trip.members.length}</strong>
        </p>
        <p>
          Total Expenses: <strong>{trip.expenses.reduce((sum, item) => sum + item.amount, 0)}</strong>
        </p>
        <p className="letter-card__closing">Happy Travels!</p>
      </div>
    </section>
  );
}

export default TripLetterCard;
