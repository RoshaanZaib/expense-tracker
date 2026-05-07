export type IncomeFormValues = {
  category: string
  amount: string
  date: string
  notes: string
}

export type Income = {
  id: string
  userId: string
  category: string
  amount: number
  date: string
  notes: string
}
