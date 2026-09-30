const calculateNetBalances = (members, expenses) => {
  const balances = members.reduce((accumulator, member) => {
    accumulator[member] = 0;
    return accumulator;
  }, {});

  expenses.forEach((expense) => {
    const share = expense.splitBetween.length
      ? expense.amount / expense.splitBetween.length
      : 0;

    expense.splitBetween.forEach((member) => {
      balances[member] -= share;
    });

    balances[expense.paidBy] += expense.amount;
  });

  return balances;
};

const buildSettlements = (members, expenses) => {
  const balances = calculateNetBalances(members, expenses);
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([member, balance]) => {
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

module.exports = {
  calculateNetBalances,
  buildSettlements,
};
