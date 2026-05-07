"use client"

import { useEffect, useMemo, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AddExpenseForm } from "@/components/dashboard/add-expense-form"
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart"
import { ExpenseBarChart } from "@/components/dashboard/expense-bar-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { MonthlySummary } from "@/components/dashboard/monthly-summary"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type { Expense, ExpenseFormValues } from "@/src/types/expense"
import type { Income, IncomeFormValues } from "@/src/types/income"

const getMonthKey = (value: string) => {
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

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [isExpensesLoading, setIsExpensesLoading] = useState(true)
  const [isSavingExpense, setIsSavingExpense] = useState(false)
  const [isSavingIncome, setIsSavingIncome] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setExpenses([])
      setIncomes([])
      setIsExpensesLoading(false)
      return
    }
    setIsExpensesLoading(true)

    const expensesQuery = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
    )
    const incomesQuery = query(
      collection(db, "incomes"),
      where("userId", "==", user.uid),
    )

    const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const nextExpenses: Expense[] = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data()

        const rawAmount = Number(data.amount ?? 0)
        const amount = Number.isFinite(rawAmount) ? rawAmount : 0

        const rawCategory = typeof data.category === "string" ? data.category.trim() : ""
        const category = rawCategory || "Uncategorized"

        const rawDate = data.date
        let date = ""
        if (typeof rawDate === "string") {
          date = rawDate.slice(0, 10)
        } else if (
          rawDate &&
          typeof rawDate === "object" &&
          "toDate" in rawDate &&
          typeof rawDate.toDate === "function"
        ) {
          date = rawDate.toDate().toISOString().slice(0, 10)
        }

        const notes = typeof data.notes === "string" ? data.notes : ""

        return {
          id: snapshotDoc.id,
          userId: data.userId,
          category,
          amount,
          date,
          notes,
        }
      })

      nextExpenses.sort((a, b) => b.date.localeCompare(a.date))
      setExpenses(nextExpenses)
      setIsExpensesLoading(false)
    })
    const unsubscribeIncomes = onSnapshot(incomesQuery, (snapshot) => {
      const nextIncomes: Income[] = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data()
        const rawAmount = Number(data.amount ?? 0)
        const amount = Number.isFinite(rawAmount) ? rawAmount : 0
        const rawCategory = typeof data.category === "string" ? data.category.trim() : ""
        const category = rawCategory || "Other"
        const rawDate = data.date
        let date = ""
        if (typeof rawDate === "string") {
          date = rawDate.slice(0, 10)
        } else if (
          rawDate &&
          typeof rawDate === "object" &&
          "toDate" in rawDate &&
          typeof rawDate.toDate === "function"
        ) {
          date = rawDate.toDate().toISOString().slice(0, 10)
        }
        const notes = typeof data.notes === "string" ? data.notes : ""

        return {
          id: snapshotDoc.id,
          userId: data.userId,
          category,
          amount,
          date,
          notes,
        }
      })
      setIncomes(nextIncomes)
    })

    return () => {
      unsubscribe()
      unsubscribeIncomes()
    }
  }, [user])

  const totalIncome = useMemo(
    () => incomes.reduce((sum, income) => sum + income.amount, 0),
    [incomes],
  )

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  )

  const monthlyTotal = useMemo(() => {
    const now = new Date()
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

    return expenses.reduce((sum, expense) => {
      const expenseMonthKey = getMonthKey(expense.date)
      if (expenseMonthKey === currentMonthKey && expense.amount > 0) {
        return sum + expense.amount
      }
      return sum
    }, 0)
  }, [expenses])

  const handleAddExpense = async (values: ExpenseFormValues) => {
    if (!user) {
      return
    }

    setIsSavingExpense(true)
    try {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
        notes: values.notes,
      })
      setShowExpenseForm(false)
      setFeedbackMessage({ type: "success", text: "Expense added successfully." })
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to add expense." })
      throw new Error("add_failed")
    } finally {
      setIsSavingExpense(false)
    }
  }

  const handleAddIncome = async (values: IncomeFormValues) => {
    if (!user) {
      return
    }

    setIsSavingIncome(true)
    try {
      await addDoc(collection(db, "incomes"), {
        userId: user.uid,
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
        notes: values.notes,
      })
      setShowIncomeForm(false)
      setFeedbackMessage({ type: "success", text: "Income added successfully." })
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to add income." })
      throw new Error("income_add_failed")
    } finally {
      setIsSavingIncome(false)
    }
  }

  const handleUpdateExpense = async (values: ExpenseFormValues) => {
    if (!editingExpense) {
      return
    }

    setIsSavingExpense(true)
    try {
      await updateDoc(doc(db, "expenses", editingExpense.id), {
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
        notes: values.notes,
      })
      setEditingExpense(null)
      setFeedbackMessage({ type: "success", text: "Expense updated successfully." })
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to update expense." })
      throw new Error("update_failed")
    } finally {
      setIsSavingExpense(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteDoc(doc(db, "expenses", expenseId))
      setFeedbackMessage({ type: "success", text: "Expense deleted successfully." })
    } catch {
      setFeedbackMessage({ type: "error", text: "Failed to delete expense." })
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400 lg:text-base">
              Track income, expenses, and your balance in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowIncomeForm((prev) => !prev)}
              className="rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20"
            >
              {showIncomeForm ? "Close Income Form" : "Add Income"}
            </button>
            <button
              type="button"
              onClick={() => setShowExpenseForm((prev) => !prev)}
              className="rounded-lg border border-cyan-600/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
            >
              {showExpenseForm ? "Close Expense Form" : "Add Expense"}
            </button>
          </div>
        </div>

        {showIncomeForm ? (
          <AddExpenseForm
            entityName="Income"
            submitLabel="Save Income"
            onSubmit={handleAddIncome}
            loading={isSavingIncome}
          />
        ) : null}

        {showExpenseForm ? (
          <AddExpenseForm
            onSubmit={handleAddExpense}
            loading={isSavingExpense}
          />
        ) : null}

        {feedbackMessage ? (
          <div
            className={`rounded-lg border px-4 py-2 text-sm ${
              feedbackMessage.type === "success"
                ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                : "border-rose-800 bg-rose-950/30 text-rose-300"
            }`}
          >
            {feedbackMessage.text}
          </div>
        ) : null}

        {editingExpense ? (
          <AddExpenseForm
            onSubmit={handleUpdateExpense}
            loading={isSavingExpense}
            submitLabel="Save Changes"
            onCancel={() => setEditingExpense(null)}
            initialValues={{
              category: editingExpense.category,
              amount: editingExpense.amount.toString(),
              date: editingExpense.date,
              notes: editingExpense.notes,
            }}
          />
        ) : null}

        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          loading={isExpensesLoading}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExpenseBarChart expenses={expenses} loading={isExpensesLoading} />
          <ExpensePieChart expenses={expenses} loading={isExpensesLoading} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentTransactions
              expenses={expenses}
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
              loading={isExpensesLoading}
            />
          </div>
          <div>
            <MonthlySummary monthlyTotal={monthlyTotal} loading={isExpensesLoading} />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
