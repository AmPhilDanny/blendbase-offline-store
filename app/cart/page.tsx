"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Trash2 } from "lucide-react"

type CartItem = {
  id: string
  productId: string
  quantity: number
  product: {
    name: string
    price: number
    imageUrl: string | null
    slug: string
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart")
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Failed to load cart", error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" })
      if (res.ok) {
        setItems(items.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to remove item", error)
    }
  }

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-xl text-gray-500">Loading cart...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/catalog">
          <Button className="px-8 py-6 text-lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 border rounded-xl bg-white">
              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                )}
              </div>
              
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-lg">
                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
                
                <div className="flex justify-start">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 border rounded-xl h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${(total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-500">Calculated at checkout</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-8">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total CAD</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
          
          <Link href="/checkout" className="block w-full">
            <Button className="w-full py-6 text-lg">Proceed to Checkout</Button>
          </Link>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Shipping and taxes will be calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
