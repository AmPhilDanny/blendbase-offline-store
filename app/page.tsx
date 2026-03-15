import Link from "next/link"
import { Button } from "./components/ui/button"
import { prisma } from "@/lib/db"

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          BlendBase
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Premium unisex basics. Made for everyone. 
        </p>
        <Link href="/catalog">
          <Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full font-medium">
            Shop the Collection
          </Button>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">New Arrivals</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="bg-gray-100 aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
            </Link>
          ))}
        </div>
        
        {featuredProducts.length === 0 && (
          <p className="text-center text-gray-500">No products available yet.</p>
        )}
      </section>
    </div>
  )
}
