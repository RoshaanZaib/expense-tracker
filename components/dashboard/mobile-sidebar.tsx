"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type MobileSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Expenses", href: "/expenses" },
    { label: "Reports", href: "/reports" },
  ]
  const pathname = usePathname()

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close mobile sidebar overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="relative z-10 h-full w-72 max-w-[85vw] border-r border-slate-800 bg-slate-950 p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            type="button"
            className="rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-200 hover:bg-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <nav className="mt-6 space-y-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`w-full rounded-md px-3 py-2 text-left transition ${
                pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )
}
