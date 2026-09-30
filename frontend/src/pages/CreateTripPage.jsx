import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTripPage({ onCreateTrip }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
  });
  const [members, setMembers] = useState(['Antra', 'Rahul', 'Priya']);
  const [memberInput, setMemberInput] = useState('');

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const addMember = () => {
    const cleanMember = memberInput.trim();

    if (!cleanMember) {
      return;
    }

    if (members.includes(cleanMember)) {
      setMemberInput('');
      return;
    }

    setMembers((current) => [...current, cleanMember]);
    setMemberInput('');
  };

  const removeMember = (nameToRemove) => {
    setMembers((current) => current.filter((member) => member !== nameToRemove));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name || !form.destination || !form.startDate || !form.endDate) {
      return;
    }

    const nextTrip = {
      id: `trip-${Date.now()}`,
      ...form,
      members,
      expenses: [],
      settlements: [],
    };

    onCreateTrip(nextTrip);
    navigate(`/trips/${nextTrip.id}`);
  };

  return (
    <main className="page form-page">
      <div className="section-header section-header--compact">
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← Back to My Trips
        </button>
      </div>

      <div className="form-card">
        <h1>Create New Trip</h1>

        <form onSubmit={handleSubmit} className="trip-form">
          <div className="field-grid">
            <label>
              <span>Trip Name</span>
              <input
                type="text"
                placeholder="Goa Trip"
                value={form.name}
                onChange={updateField('name')}
              />
            </label>

            <label>
              <span>Destination</span>
              <input
                type="text"
                placeholder="Goa"
                value={form.destination}
                onChange={updateField('destination')}
              />
            </label>

            <label>
              <span>Start Date</span>
              <input type="date" value={form.startDate} onChange={updateField('startDate')} />
            </label>

            <label>
              <span>End Date</span>
              <input type="date" value={form.endDate} onChange={updateField('endDate')} />
            </label>
          </div>

          <div className="member-editor">
            <div className="member-editor__header">
              <h2>Members</h2>
            </div>

            <div className="member-list">
              {members.map((member) => (
                <div key={member} className="member-pill">
                  <span>{member}</span>
                  <button type="button" onClick={() => removeMember(member)} aria-label={`Remove ${member}`}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="add-member-row">
              <input
                type="text"
                placeholder="Add a member"
                value={memberInput}
                onChange={(event) => setMemberInput(event.target.value)}
              />
              <button type="button" className="secondary-btn" onClick={addMember}>
                + Add Member
              </button>
            </div>
          </div>

          <button type="submit" className="primary-btn primary-btn--full">
            Create Trip
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateTripPage;
