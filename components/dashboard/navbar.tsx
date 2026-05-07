"use client"

type NavbarProps = {
  onMenuToggle: () => void
  isMobileMenuOpen: boolean
  onLogout: () => void
  userEmail?: string
}

export function Navbar({ onMenuToggle, isMobileMenuOpen, onLogout, userEmail }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-900/90 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 lg:hidden"
        >
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Logout
          </button>
          <div className="hidden rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-300 sm:block">
            May 2026
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-200">Signed in</p>
            <p className="max-w-44 truncate text-xs text-slate-400">{userEmail ?? "user@example.com"}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400" />
        </div>
      </div>
    </header>
  )
}
