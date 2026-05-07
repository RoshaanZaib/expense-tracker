"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Expenses", href: "/expenses" },
    { label: "Reports", href: "/reports" },
  ]
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-950/95 p-6 backdrop-blur lg:block">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Fintrack</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Expense Tracker</h2>
      </div>
      <nav className="mt-8 space-y-2 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
              pathname === item.href
                ? "bg-slate-800 text-white shadow-lg shadow-slate-900/60"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:-translate-y-0.5"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
