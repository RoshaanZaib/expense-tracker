export type ExpenseFormValues = {
  category: string;
  amount: string;
  date: string;
  notes: string;
};

export type Expense = {
  id: string;
  userId: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
};
