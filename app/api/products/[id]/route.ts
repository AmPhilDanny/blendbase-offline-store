import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"

type Params = {
  id: string
}

export async function GET(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    const product = await prisma.product.findUnique({
      where: { id: id }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: { params: Promise<Params> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await req.json()
    const { name, slug, description, price, imageUrl, stock } = body

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        slug,
        description,
        price: price ? parseInt(price) : undefined,
        imageUrl,
        stock: stock !== undefined ? parseInt(stock) : undefined,
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<Params> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    await prisma.product.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
