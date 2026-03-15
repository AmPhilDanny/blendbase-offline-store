import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from 'uuid'

async function getOrCreateSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    sessionId = uuidv4()
    // In a real app, you might want a longer maxAge
    cookieStore.set("sessionId", sessionId, { 
      httpOnly: true, 
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
  }
  return sessionId
}

export async function GET() {
  try {
    const sessionId = await getOrCreateSessionId()
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true }
    })
    
    return NextResponse.json(cartItems)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const sessionId = await getOrCreateSessionId()
    const body = await req.json()
    const { productId, quantity } = body

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    // Check stock
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || product.stock < quantity) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 })
    }

    // Upsert CartItem
    const cartItem = await prisma.cartItem.upsert({
      where: {
        sessionId_productId: {
          sessionId,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        sessionId,
        productId,
        quantity
      }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const sessionId = await getOrCreateSessionId()
    await prisma.cartItem.deleteMany({
      where: { sessionId }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
