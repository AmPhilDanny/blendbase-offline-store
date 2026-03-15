import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { put } from "@vercel/blob"

type Params = {
  id: string
}

export async function GET(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function POST(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id } = await context.params
    const formData = await req.formData()
    const _action = formData.get("_action") as string // "status" or "proof"

    if (_action === "status") {
      const session = await auth()
      if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      
      const status = formData.get("status") as string
      const updatedOrder = await prisma.order.update({
        where: { id: id },
        data: { paymentStatus: status }
      })
      
      return NextResponse.json(updatedOrder)
    } 
    
    if (_action === "proof") {
      const file = formData.get("file") as File
      if (!file) {
         return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }
      
      const blob = await put(file.name, file, { access: 'public' })
      
      const updatedOrder = await prisma.order.update({
        where: { id: id },
        data: { proofUrl: blob.url }
      })
      
      return NextResponse.json(updatedOrder)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })

  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
