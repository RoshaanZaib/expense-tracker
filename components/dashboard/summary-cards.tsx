"use client"

type SummaryCardsProps = {
  totalIncome: number
  totalExpenses: number
  loading?: boolean
}

const fmt = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function SummaryCards({ totalIncome, totalExpenses, loading = false }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses

  const cards = [
    {
      label: "Total Income",
      value: fmt(totalIncome),
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
      iconBg: "#dcfce7",
      iconColor: "#16a34a",
      valueColor: "#16a34a",
      border: "#bbf7d0",
    },
    {
      label: "Total Expenses",
      value: fmt(totalExpenses),
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      ),
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
      valueColor: "#dc2626",
      border: "#fecaca",
    },
    {
      label: "Balance",
      value: fmt(balance),
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      iconBg: "#ede9fe",
      iconColor: "#7c3aed",
      valueColor: "#7c3aed",
      border: "#ddd6fe",
    },
  ]

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: `1px solid ${card.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, fontWeight: "500" }}>
              {card.label}
            </p>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: card.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: card.iconColor,
            }}>
              {card.icon}
            </div>
          </div>
          <p style={{
            fontSize: "28px",
            fontWeight: "700",
            color: loading ? "#d1d5db" : card.valueColor,
            margin: 0,
          }}>
            {loading ? "$-.--" : card.value}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
            Updated just now
          </p>
        </div>
      ))}
    </div>
  )
}