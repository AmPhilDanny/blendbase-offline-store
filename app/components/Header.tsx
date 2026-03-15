import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          BlendBase
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-medium hover:text-gray-600 transition-colors">
            Catalog
          </Link>
          <Link href="/cart" className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </Link>
        </nav>
      </div>
    </header>
  )
}
