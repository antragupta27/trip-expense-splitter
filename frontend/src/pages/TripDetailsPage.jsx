import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TripLetterCard from '../components/TripLetterCard';
import { buildSettlementSummary, calculateTripTotal, formatCurrency, formatDateRange } from '../services/mockTrips';

function TripDetailsPage({ trips, onUpdateTrip }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((item) => item.id === tripId);

  const [memberInput, setMemberInput] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitBetween: [],
  });

  if (!trip) {
    return (
      <main className="page">
        <div className="empty-state">
          <h3>Trip not found</h3>
          <p>The trip you are looking for does not exist.</p>
        </div>
      </main>
    );
  }

  const tripTotal = calculateTripTotal(trip.expenses);
  const settlementRows = trip.settlements?.length
    ? trip.settlements
    : buildSettlementSummary(trip);

  const balanceSummary = useMemo(() => {
    const balances = trip.members.reduce((accumulator, member) => {
      accumulator[member] = 0;
      return accumulator;
    }, {});

    trip.expenses.forEach((expense) => {
      const share = expense.splitBetween.length ? expense.amount / expense.splitBetween.length : 0;

      expense.splitBetween.forEach((member) => {
        balances[member] -= share;
      });

      balances[expense.paidBy] += expense.amount;
    });

    return Object.entries(balances).map(([member, amount]) => ({ member, amount }));
  }, [trip]);

  const addMember = () => {
    const cleanName = memberInput.trim();

    if (!cleanName || trip.members.includes(cleanName)) {
      return;
    }

    onUpdateTrip(trip.id, (currentTrip) => ({
      ...currentTrip,
      members: [...currentTrip.members, cleanName],
    }));
    setMemberInput('');
  };

  const handleExpenseSelection = (memberName) => {
    setExpenseForm((current) => {
      const selected = current.splitBetween.includes(memberName)
        ? current.splitBetween.filter((item) => item !== memberName)
        : [...current.splitBetween, memberName];

      return {
        ...current,
        splitBetween: selected,
      };
    });
  };

  const addExpense = (event) => {
    event.preventDefault();

    if (!expenseForm.description || !expenseForm.amount || !expenseForm.paidBy) {
      return;
    }

    const nextExpense = {
      id: `expense-${Date.now()}`,
      description: expenseForm.description,
      amount: Number(expenseForm.amount),
      paidBy: expenseForm.paidBy,
      splitBetween:
        expenseForm.splitBetween.length > 0 ? expenseForm.splitBetween : trip.members,
    };

    onUpdateTrip(trip.id, (currentTrip) => ({
      ...currentTrip,
      expenses: [...currentTrip.expenses, nextExpense],
    }));

    setExpenseForm({
      description: '',
      amount: '',
      paidBy: trip.members[0] || '',
      splitBetween: trip.members,
    });
    setShowExpenseForm(false);
  };

  const toggleSettlementPaid = (settlementId) => {
    onUpdateTrip(trip.id, (currentTrip) => ({
      ...currentTrip,
      settlements: (currentTrip.settlements || []).map((row) =>
        row.id === settlementId ? { ...row, paid: !row.paid } : row,
      ),
    }));
  };

  return (
    <main className="page detail-page">
      <div className="section-header">
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← Back to My Trips
        </button>
      </div>

      <header className="trip-header">
        <div>
          <p className="eyebrow">Trip journey</p>
          <h1>{trip.name}</h1>
        </div>
        <div className="trip-summary">
          <p>{trip.destination}</p>
          <p>{formatDateRange(trip.startDate, trip.endDate)}</p>
        </div>
      </header>

      <div className="meta-row">
        <span>{trip.members.length} Members</span>
        <span>{formatCurrency(tripTotal)} Total Expenses</span>
      </div>

      <TripLetterCard trip={trip} />

      <section className="info-panel">
        <div className="panel-header">
          <h2>Members ({trip.members.length})</h2>
          <div className="inline-add">
            <input
              type="text"
              value={memberInput}
              placeholder="Add member"
              onChange={(event) => setMemberInput(event.target.value)}
            />
            <button type="button" className="secondary-btn" onClick={addMember}>
              + Add Member
            </button>
          </div>
        </div>

        <div className="member-grid">
          {trip.members.map((member) => (
            <div key={member} className="member-card">
              {member}
            </div>
          ))}
        </div>
      </section>

      <section className="info-panel">
        <div className="panel-header panel-header--stacked">
          <h2>Expenses</h2>
          <button type="button" className="primary-btn" onClick={() => setShowExpenseForm((value) => !value)}>
            + Add Expense
          </button>
        </div>

        {showExpenseForm && (
          <form className="expense-form" onSubmit={addExpense}>
            <div className="field-grid">
              <label>
                <span>Description</span>
                <input
                  type="text"
                  placeholder="Dinner"
                  value={expenseForm.description}
                  onChange={(event) =>
                    setExpenseForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </label>

              <label>
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  placeholder="2000"
                  value={expenseForm.amount}
                  onChange={(event) =>
                    setExpenseForm((current) => ({ ...current, amount: event.target.value }))
                  }
                />
              </label>

              <label>
                <span>Paid by</span>
                <select
                  value={expenseForm.paidBy || trip.members[0]}
                  onChange={(event) =>
                    setExpenseForm((current) => ({ ...current, paidBy: event.target.value }))
                  }
                >
                  {trip.members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="split-row">
              <span>Split between</span>
              <div className="checkbox-group">
                {trip.members.map((member) => (
                  <label key={member} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={expenseForm.splitBetween.includes(member) || expenseForm.splitBetween.length === 0}
                      onChange={() => handleExpenseSelection(member)}
                    />
                    <span>{member}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="primary-btn primary-btn--full">
              Add Expense
            </button>
          </form>
        )}

        <div className="expense-list">
          {trip.expenses.length === 0 ? (
            <p className="muted-text">No expenses recorded yet.</p>
          ) : (
            trip.expenses.map((expense) => (
              <article key={expense.id} className="expense-item">
                <div className="expense-item__main">
                  <div>
                    <h3>{expense.description}</h3>
                    <p className="expense-item__amount">{formatCurrency(expense.amount)}</p>
                  </div>
                  <div className="expense-item__meta">
                    <p>Paid by {expense.paidBy}</p>
                    <p>Shared by {expense.splitBetween.join(', ')}</p>
                    <p>Each share: {formatCurrency(expense.amount / expense.splitBetween.length)}</p>
                  </div>
                </div>
                <div className="expense-item__actions">
                  <button type="button" className="ghost-btn">
                    Edit
                  </button>
                  <button type="button" className="ghost-btn ghost-btn--danger">
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="info-panel">
        <h2>Who Owes Whom?</h2>

        <div className="balances-grid">
          {balanceSummary.map((entry) => (
            <div key={entry.member} className="balance-card">
              <span>{entry.member}</span>
              <strong className={entry.amount >= 0 ? 'balance-positive' : 'balance-negative'}>
                {entry.amount >= 0 ? '+' : ''}
                {formatCurrency(entry.amount)}
              </strong>
            </div>
          ))}
        </div>

        <div className="settlement-list">
          {settlementRows.length === 0 ? (
            <p className="muted-text">Everything is settled.</p>
          ) : (
            settlementRows.map((settlement) => (
              <div key={settlement.id} className={`settlement-item ${settlement.paid ? 'is-settled' : ''}`}>
                <div>
                  <strong>{settlement.from}</strong> → <strong>{settlement.to}</strong>{' '}
                  {formatCurrency(settlement.amount)}
                </div>
                <button type="button" className="secondary-btn" onClick={() => toggleSettlementPaid(settlement.id)}>
                  {settlement.paid ? 'Settled' : 'Mark as Paid'}
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default TripDetailsPage;
