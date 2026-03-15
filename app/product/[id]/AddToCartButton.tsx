"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { ShoppingCart } from "lucide-react"

export function AddToCartButton({ productId, stock }: { productId: string, stock: number }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        alert("Failed to add to cart. Maybe out of stock?")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (stock <= 0) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed text-lg py-6">
        Out of Stock
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={loading || success}
      className={`w-full text-lg py-6 flex items-center justify-center gap-2 transition-colors ${
        success ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-black/90 text-white"
      }`}
    >
      {loading ? (
        "Adding..."
      ) : success ? (
        "Added to Cart!"
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
