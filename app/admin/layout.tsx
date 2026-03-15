import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    // We could render a custom login page here instead, but
    // for simplicity, NextAuth handles it when we configure signIn
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10 tracking-tight">Admin</h2>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded hover:bg-white/10 transition-colors">
            Orders
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded hover:bg-white/10 transition-colors">
            Products
          </Link>
        </nav>
        
        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="text-sm text-gray-400 mb-4">{session?.user?.email}</div>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}>
            <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 rounded transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
