import { FormEvent, useEffect, useState } from "react";
import type { ExpenseFormValues } from "@/src/types/expense";

type AddExpenseFormProps = {
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  loading?: boolean;
  initialValues?: ExpenseFormValues;
  submitLabel?: string;
  onCancel?: () => void;
  entityName?: string;
};

const emptyForm: ExpenseFormValues = {
  category: "",
  amount: "",
  date: "",
  notes: "",
};

export function AddExpenseForm({
  onSubmit,
  loading = false,
  initialValues,
  submitLabel = "Add Expense",
  onCancel,
  entityName = "Expense",
}: AddExpenseFormProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const values = initialValues ?? emptyForm;
    setCategory(values.category);
    setAmount(values.amount);
    setDate(values.date);
    setNotes(values.notes);
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!category.trim() || !amount.trim() || !date.trim()) {
      setError("Category, amount, and date are required.");
      return;
    }

    const normalizedAmount = Number(amount);
    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      setError("Amount must be a number greater than 0.");
      return;
    }

    try {
      await onSubmit({
        category: category.trim(),
        amount: normalizedAmount.toString(),
        date,
        notes: notes.trim(),
      });

      setSuccess(
        initialValues
          ? `${entityName} updated successfully.`
          : `${entityName} added successfully.`,
      );
      if (!initialValues) {
        setCategory("");
        setAmount("");
        setDate("");
        setNotes("");
      }
    } catch {
      setError("Unable to save expense. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 transition hover:border-slate-700"
    >
      <p className="mb-3 text-sm font-semibold text-slate-100">{submitLabel}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Category"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:ring-2"
        />
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:ring-2"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
        />
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Notes"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:ring-2"
        />
      </div>
      {error ? <p className="mt-2 text-xs text-rose-400">{error}</p> : null}
      {success ? <p className="mt-2 text-xs text-emerald-400">{success}</p> : null}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:from-cyan-400 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
