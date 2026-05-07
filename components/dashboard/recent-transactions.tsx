import type { Expense } from "@/src/types/expense";

type RecentTransactionsProps = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => Promise<void>;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function RecentTransactions({
  expenses,
  onEdit,
  onDelete,
  loading = false,
}: RecentTransactionsProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <h2 className="text-base font-semibold text-white">Expenses</h2>
      <ul className="mt-4 space-y-3">
        {loading ? (
          <li className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
            Loading expenses...
          </li>
        ) : null}
        {!loading && expenses.length === 0 ? (
          <li className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
            No expenses yet. Add your first expense above.
          </li>
        ) : null}
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-100">{expense.category}</p>
              <p className="text-xs text-slate-400">
                {expense.date}
                {expense.notes ? ` • ${expense.notes}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="mr-2 text-sm font-semibold text-rose-400">
                -{formatCurrency(expense.amount)}
              </p>
              <button
                type="button"
                onClick={() => onEdit(expense)}
                className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(expense.id)}
                className="rounded-md border border-rose-900 px-2 py-1 text-xs text-rose-300 hover:bg-rose-950/50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
