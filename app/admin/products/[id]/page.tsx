import ProductEditor from "../ProductEditor"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: id }
  })

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductEditor product={product} />
    </div>
  )
}
