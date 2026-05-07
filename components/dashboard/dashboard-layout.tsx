"use client"

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/src/lib/firebase"
import { useAuth } from "@/components/auth/auth-provider"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { Navbar } from "@/components/dashboard/navbar"

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    await signOut(auth)
    router.replace("/login")
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100">
      <Sidebar />
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="lg:pl-64">
        <Navbar
          onMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={isMobileMenuOpen}
          onLogout={handleLogout}
          userEmail={user?.email ?? undefined}
        />
        <main className="space-y-8 p-4 lg:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  )
}
