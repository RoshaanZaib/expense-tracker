"use client"

import { useEffect, useState } from "react"
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { db } from "@/src/lib/firebase"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AddExpenseForm } from "@/components/dashboard/add-expense-form"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { useAuth } from "@/components/auth/auth-provider"
import type { Expense, ExpenseFormValues } from "@/src/types/expense"

export default function ExpensesPage() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

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
      nextExpenses.sort((a, b) => b.date.localeCompare(a.date))
      setExpenses(nextExpenses)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const handleAddExpense = async (values: ExpenseFormValues) => {
    if (!user) return
    setSaving(true)
    try {
      await addDoc(collection(db, "expenses"), {
        userId: user.uid,
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
        notes: values.notes,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateExpense = async (values: ExpenseFormValues) => {
    if (!editingExpense) return
    setSaving(true)
    try {
      await updateDoc(doc(db, "expenses", editingExpense.id), {
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
        notes: values.notes,
      })
      setEditingExpense(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteDoc(doc(db, "expenses", expenseId))
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Expenses</h1>
          <p className="mt-1 text-sm text-slate-400">Manage all your expenses in one place.</p>
        </div>

        <AddExpenseForm onSubmit={handleAddExpense} loading={saving} />
        {editingExpense ? (
          <AddExpenseForm
            onSubmit={handleUpdateExpense}
            loading={saving}
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

        <RecentTransactions
          expenses={expenses}
          onEdit={setEditingExpense}
          onDelete={handleDeleteExpense}
          loading={loading}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
