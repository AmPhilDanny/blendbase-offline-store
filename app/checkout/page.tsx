"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)
  
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "BANK_TRANSFER",
    notes: ""
  })

  useEffect(() => {
    async function getCartTotal() {
      try {
         const res = await fetch("/api/cart")
         if (res.ok) {
           const items = await res.json()
           const total = items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0)
           setCartTotal(total)
         }
      } catch (error) {
        console.error("Failed to load cart total", error)
      }
    }
    getCartTotal()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push(`/order/${data.orderId}`)
      } else {
        alert(data.error || "Failed to create order")
        setLoading(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An unexpected error occurred during checkout.")
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (cartTotal === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Please add items to your cart before checking out.</p>
        <Button onClick={() => router.push("/catalog")} className="px-8 py-6 text-lg">Shop Now</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-10">Checkout</h1>
      
      <div className="bg-white border rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center mb-8 pb-8 border-b">
          <h2 className="text-2xl font-semibold">Order Total</h2>
          <span className="text-2xl font-bold">${(cartTotal / 100).toFixed(2)} CAD</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <section>
            <h3 className="text-xl font-medium mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  required type="text" id="customerName" name="customerName"
                  value={formData.customerName} onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  required type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h3 className="text-xl font-medium mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address</label>
                <input 
                  required type="text" id="address" name="address"
                  value={formData.address} onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
                  <input 
                    required type="text" id="city" name="city"
                    value={formData.city} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                    placeholder="Toronto"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium text-gray-700">Country</label>
                  <input 
                    required type="text" id="country" name="country"
                    value={formData.country} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                    placeholder="Canada"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h3 className="text-xl font-medium mb-4">Payment Method</h3>
            <div className="space-y-2">
              <select 
                required id="paymentMethod" name="paymentMethod"
                value={formData.paymentMethod} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
              >
                <option value="BANK_TRANSFER">Bank Transfer (e-Transfer)</option>
                <option value="COD">Cash on Delivery</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Note: You will be asked to upload proof of payment on the next page if applicable.
              </p>
            </div>
          </section>
          
          {/* Notes */}
          <section>
            <h3 className="text-xl font-medium mb-4">Order Notes (Optional)</h3>
            <div className="space-y-2">
              <textarea 
                id="notes" name="notes" rows={3}
                value={formData.notes} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" 
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </section>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full py-6 text-lg mt-8"
          >
            {loading ? "Processing..." : `Place Order - ${(cartTotal / 100).toFixed(2)} CAD`}
          </Button>
        </form>
      </div>
    </div>
  )
}
