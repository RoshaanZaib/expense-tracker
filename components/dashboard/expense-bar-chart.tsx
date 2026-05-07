"use client"

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Expense } from "@/src/types/expense"

type ExpenseBarChartProps = {
  expenses: Expense[]
  loading?: boolean
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)

const BAR_COLORS = ["#22d3ee", "#34d399", "#818cf8", "#fbbf24", "#f472b6", "#f87171"]

const formatMonthLabel = (value: string) => {
  const [year, month] = value.split("-")
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleString("en-US", { month: "short" })
}

const getLastSixMonthKeys = () => {
  const now = new Date()
  const keys: string[] = []

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    keys.push(key)
  }

  return keys
}

const getMonthKeyFromDate = (value: string) => {
  const safeValue = value.trim()
  if (!safeValue) {
    return null
  }

  const directMatch = safeValue.match(/^(\d{4})-(\d{2})/)
  if (directMatch) {
    return `${directMatch[1]}-${directMatch[2]}`
  }

  const parsed = new Date(safeValue)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`
}

export function ExpenseBarChart({ expenses, loading = false }: ExpenseBarChartProps) {
  const totalsByMonth = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (!expense.date || expense.amount <= 0) {
      return acc
    }

    const monthKey = getMonthKeyFromDate(expense.date)
    if (!monthKey) {
      return acc
    }

    acc[monthKey] = (acc[monthKey] ?? 0) + expense.amount
    return acc
  }, {})

  const data = getLastSixMonthKeys().map((month, index) => ({
    month,
    total: totalsByMonth[month] ?? 0,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }))

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <h2 className="text-base font-semibold text-white">Monthly Spending</h2>
      <p className="mt-1 text-sm text-slate-400">Last 6 months</p>
      <div className="mt-4 h-72 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
                tickFormatter={(value: number) => `$${value}`}
              />
              <Tooltip
                labelFormatter={(label) => {
                  const [year, month] = String(label).split("-")
                  const date = new Date(Number(year), Number(month) - 1, 1)
                  return date.toLocaleString("en-US", { month: "long", year: "numeric" })
                }}
                formatter={(value: number | string | undefined, name?: string | number | undefined) => value ? formatCurrency(Number(value)) : ''}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-slate-300">{String(value)}</span>
                )}
                payload={data.map((entry) => ({
                  value: formatMonthLabel(entry.month),
                  type: "square",
                  color: entry.fill,
                }))}
              />
              <Bar dataKey="total" name="Spending" radius={[6, 6, 0, 0]} minPointSize={3}>
                {data.map((entry) => (
                  <Cell key={entry.month} fill={entry.fill} stroke={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
