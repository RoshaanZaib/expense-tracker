export function SummaryCards() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="p-4 bg-white rounded-xl shadow">
        <h2>Total Income</h2>
      </div>

      <div className="p-4 bg-white rounded-xl shadow">
        <h2>Total Expenses</h2>
      </div>

      <div className="p-4 bg-white rounded-xl shadow">
        <h2>Balance</h2>
      </div>
    </div>
  )
}