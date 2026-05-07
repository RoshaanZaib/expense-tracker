type MonthlySummaryProps = {
  monthlyTotal: number;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function MonthlySummary({ monthlyTotal, loading = false }: MonthlySummaryProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <h2 className="text-base font-semibold text-white">Monthly Summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <dt className="text-slate-400">Total This Month</dt>
          <dd className="font-semibold text-cyan-400">
            {loading ? "Loading..." : formatCurrency(monthlyTotal)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
