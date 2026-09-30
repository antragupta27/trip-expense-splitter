export const initialTrips = [
  {
    id: 'goa-trip',
    name: 'Goa Trip',
    destination: 'Goa',
    startDate: '2026-09-12',
    endDate: '2026-09-16',
    members: ['Antra', 'Rahul', 'Priya', 'Neha'],
    expenses: [
      {
        id: 'expense-1',
        description: 'Dinner',
        amount: 2000,
        paidBy: 'Rahul',
        splitBetween: ['Antra', 'Rahul', 'Priya', 'Neha'],
      },
      {
        id: 'expense-2',
        description: 'Cab booking',
        amount: 1500,
        paidBy: 'Antra',
        splitBetween: ['Antra', 'Rahul', 'Priya'],
      },
      {
        id: 'expense-3',
        description: 'Beach resort',
        amount: 6400,
        paidBy: 'Neha',
        splitBetween: ['Antra', 'Rahul', 'Priya', 'Neha'],
      },
    ],
    settlements: [
      { id: 'settlement-1', from: 'Priya', to: 'Antra', amount: 1500, paid: false },
      { id: 'settlement-2', from: 'Neha', to: 'Antra', amount: 1000, paid: false },
      { id: 'settlement-3', from: 'Neha', to: 'Rahul', amount: 500, paid: true },
    ],
  },
  {
    id: 'mumbai-weekend',
    name: 'Mumbai Weekend',
    destination: 'Mumbai',
    startDate: '2026-10-05',
    endDate: '2026-10-07',
    members: ['Aarav', 'Meera', 'Riya'],
    expenses: [
      {
        id: 'expense-4',
        description: 'Hotel stay',
        amount: 5400,
        paidBy: 'Meera',
        splitBetween: ['Aarav', 'Meera', 'Riya'],
      },
      {
        id: 'expense-5',
        description: 'Food tour',
        amount: 2200,
        paidBy: 'Riya',
        splitBetween: ['Aarav', 'Meera', 'Riya'],
      },
    ],
    settlements: [],
  },
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const format = (date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

  return `${format(start)} — ${format(end)}`;
};

export const calculateTripTotal = (expenses = []) =>
  expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);

export const buildSettlementSummary = (trip) => {
  const memberBalances = trip.members.reduce((accumulator, member) => {
    accumulator[member] = 0;
    return accumulator;
  }, {});

  trip.expenses.forEach((expense) => {
    const share = expense.splitBetween.length
      ? Number(expense.amount || 0) / expense.splitBetween.length
      : 0;

    expense.splitBetween.forEach((member) => {
      memberBalances[member] -= share;
    });

    if (expense.paidBy) {
      memberBalances[expense.paidBy] += Number(expense.amount || 0);
    }
  });

  const creditors = [];
  const debtors = [];

  Object.entries(memberBalances).forEach(([member, balance]) => {
    if (balance > 0) {
      creditors.push({ member, amount: balance });
    } else if (balance < 0) {
      debtors.push({ member, amount: Math.abs(balance) });
    }
  });

  const settlements = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      settlements.push({
        id: `${debtor.member}-${creditor.member}`,
        from: debtor.member,
        to: creditor.member,
        amount,
        paid: false,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount <= 0) {
      debtorIndex += 1;
    }

    if (creditor.amount <= 0) {
      creditorIndex += 1;
    }
  }

  return settlements;
};
