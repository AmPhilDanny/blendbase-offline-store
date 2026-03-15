import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, email, address, city, country, paymentMethod, notes } = body

    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true }
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Calculate total on server
    const total = cartItems.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity)
    }, 0)

    // Create Order and OrderItems in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerName,
          email,
          address,
          city,
          country,
          paymentMethod,
          total,
          notes,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              name: item.product.name,
              unitPrice: item.product.price,
              quantity: item.quantity
            }))
          }
        }
      })

      // Update product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { sessionId }
      })

      return newOrder
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
