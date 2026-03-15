import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Product } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b uppercase">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden">
                       {product.imageUrl && (
                         <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                       )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </td>
                  <td className="p-4 font-medium">
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="p-4">
                    {product.stock > 0 ? (
                      <span className="text-green-600 font-medium">{product.stock}</span>
                    ) : (
                      <span className="text-red-600 font-medium">Out of stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 font-medium hover:underline text-sm mr-4">
                      Edit
                    </Link>
                    <Link href={`/product/${product.id}`} target="_blank" className="text-gray-500 hover:text-black font-medium hover:underline text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
