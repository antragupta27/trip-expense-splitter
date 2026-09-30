import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../components/TripCard';
import EmptyTripsState from '../components/EmptyTripsState';
import { calculateTripTotal } from '../services/mockTrips';

function DashboardPage({ trips }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');

  const filteredTrips = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    const filtered = trips.filter((trip) => {
      if (!normalized) return true;
      return trip.name.toLowerCase().includes(normalized);
    });

    const sorted = [...filtered];

    if (sortBy === 'highest-expenses') {
      sorted.sort((a, b) => calculateTripTotal(b.expenses) - calculateTripTotal(a.expenses));
    }

    if (sortBy === 'recent') {
      sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    return sorted;
  }, [sortBy, search, trips]);

  return (
    <main className="page dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>My Trips</h1>
          <p className="subheading">Keep track of your trips, expenses and settlements.</p>
        </div>

        <div className="header-tools">
          <label className="search-field" htmlFor="trip-search">
            <span>Search</span>
            <input
              id="trip-search"
              type="text"
              placeholder="Search trips"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="sort-select" htmlFor="trip-sort">
            <span>Sort</span>
            <select id="trip-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="all">All trips</option>
              <option value="recent">Recently created</option>
              <option value="highest-expenses">Highest expenses</option>
            </select>
          </label>

          <Link to="/trips/new" className="primary-btn">
            + Create Trip
          </Link>
        </div>
      </header>

      {filteredTrips.length === 0 ? (
        <EmptyTripsState />
      ) : (
        <section className="card-grid">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
