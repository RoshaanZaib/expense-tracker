"use client"

import { useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ExpenseBarChart } from "@/components/dashboard/expense-bar-chart"
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart"
import { MonthlySummary } from "@/components/dashboard/monthly-summary"
import { useAuth } from "@/components/auth/auth-provider"
import type { Expense } from "@/src/types/expense"

const getMonthKey = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})/)
  if (match) return `${match[1]}-${match[2]}`
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setExpenses([])
      setLoading(false)
      return
    }

    const expensesQuery = query(collection(db, "expenses"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const nextExpenses: Expense[] = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data()
        return {
          id: snapshotDoc.id,
          userId: data.userId,
          category: data.category ?? "Uncategorized",
          amount: Number(data.amount ?? 0),
          date: data.date ?? "",
          notes: data.notes ?? "",
        }
      })
      setExpenses(nextExpenses)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const monthlyTotal = useMemo(() => {
    const now = new Date()
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    return expenses.reduce((sum, expense) => {
      const monthKey = getMonthKey(expense.date)
      if (monthKey === currentKey) return sum + expense.amount
      return sum
    }, 0)
  }, [expenses])

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-slate-400">
            Visualize expenses by category and monthly spending trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExpenseBarChart expenses={expenses} loading={loading} />
          <ExpensePieChart expenses={expenses} loading={loading} />
        </div>

        <MonthlySummary monthlyTotal={monthlyTotal} loading={loading} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
