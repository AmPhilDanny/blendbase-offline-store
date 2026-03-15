import Link from "next/link"
import { prisma } from "@/lib/db"

export default async function Catalog() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group block">
            <div className="bg-gray-100 aspect-[3/4] mb-4 overflow-hidden rounded-lg relative">
              {product.stock <= 0 && (
                <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                  SOLD OUT
                </div>
              )}
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                  No image
                </div>
              )}
            </div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products available in the catalog yet.</p>
        </div>
      )}
    </div>
  )
}
