"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Expense } from "@/src/types/expense"

type ExpensePieChartProps = {
  expenses: Expense[]
  loading?: boolean
}

const COLORS = ["#22d3ee", "#34d399", "#818cf8", "#fbbf24", "#f472b6", "#f87171", "#60a5fa"]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function ExpensePieChart({ expenses, loading = false }: ExpensePieChartProps) {
  const totalsByCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (expense.amount <= 0) return acc
    const category = expense.category?.trim() || "Uncategorized"
    acc[category] = (acc[category] ?? 0) + expense.amount
    return acc
  }, {})

  const data = Object.entries(totalsByCategory).map(([name, value]) => ({ name, value }))

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <h2 className="text-base font-semibold text-white">Expense Breakdown</h2>
      <p className="mt-1 text-sm text-slate-400">By category</p>
      <div className="mt-4 h-72 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Add expenses to see category breakdown.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => value ? formatCurrency(Number(Array.isArray(value) ? value[0] : value)) : ''}
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
              />
              <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
