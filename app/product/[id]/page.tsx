import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { AddToCartButton } from "./AddToCartButton"

export const dynamic = "force-dynamic"

type Params = {
  id: string
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[4/5] relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No product image
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-700 mb-8 border-b pb-8">
            ${(product.price / 100).toFixed(2)}
          </p>
          
          <div className="prose prose-lg text-gray-600 mb-12">
            <p>{product.description}</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Availability</span>
              {product.stock > 0 ? (
                <span className="font-medium text-green-600">{product.stock} in stock</span>
              ) : (
                <span className="font-medium text-red-600">Out of stock</span>
              )}
            </div>
            
            <AddToCartButton productId={product.id} stock={product.stock} />
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Free shipping on orders over $150. Easy returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
