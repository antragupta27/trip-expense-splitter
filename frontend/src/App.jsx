import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailsPage from './pages/TripDetailsPage';
import { initialTrips } from './services/mockTrips';
import './App.css';

function App() {
  const [trips, setTrips] = useState(initialTrips);

  const handleCreateTrip = (newTrip) => {
    setTrips((currentTrips) => [newTrip, ...currentTrips]);
  };

  const handleUpdateTrip = (tripId, updater) => {
    setTrips((currentTrips) =>
      currentTrips.map((trip) => (trip.id === tripId ? updater(trip) : trip)),
    );
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<DashboardPage trips={trips} />} />
          <Route
            path="/trips/new"
            element={<CreateTripPage onCreateTrip={handleCreateTrip} />}
          />
          <Route
            path="/trips/:tripId"
            element={<TripDetailsPage trips={trips} onUpdateTrip={handleUpdateTrip} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
