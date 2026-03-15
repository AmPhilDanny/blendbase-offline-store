import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

type Params = {
  id: string
}

export async function DELETE(req: Request, context: { params: Promise<Params> }) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value
    
    if (!sessionId) {
        return NextResponse.json({ error: "No active session" }, { status: 400 })
    }

    const { id } = await context.params
    
    // Verify it belongs to the session
    const cartItem = await prisma.cartItem.findUnique({ where: { id: id } })
    if (!cartItem || cartItem.sessionId !== sessionId) {
       return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
  }
}
