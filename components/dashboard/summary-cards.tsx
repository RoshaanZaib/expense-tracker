type SummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function SummaryCards({ totalIncome, totalExpenses, loading = false }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses;

  const cardItems = [
    { label: "Total Income", value: formatCurrency(totalIncome), accent: "text-emerald-400" },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      accent: "text-rose-400",
    },
    { label: "Balance", value: formatCurrency(balance), accent: "text-cyan-400" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cardItems.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40 transition hover:-translate-y-0.5 hover:border-slate-700"
        >
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className={`mt-2 text-2xl font-semibold ${item.accent}`}>
            {loading ? "Loading..." : item.value}
          </p>
          <p className="mt-1 text-xs text-slate-500">Updated just now</p>
        </article>
      ))}
    </section>
  );
}
