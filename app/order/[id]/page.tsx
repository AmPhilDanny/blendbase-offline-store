"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/app/components/ui/button"

export default function OrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (res.ok) {
          setOrder(await res.json())
        }
      } catch (error) {
        console.error("Failed to load order", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append("_action", "proof")
    formData.append("file", file)

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder(updated)
        alert("Proof uploaded successfully!")
      } else {
        alert("Failed to upload proof")
      }
    } catch (error) {
      console.error("Upload error", error)
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  if (loading) return <div className="p-24 text-center">Loading order details...</div>
  if (!order) return <div className="p-24 text-center text-red-500">Order not found</div>

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white border p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Order Confirmed</h1>
            <p className="text-gray-500">Order #{order.id}</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 rounded-full font-medium">
            Status: {order.paymentStatus}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div>
             <h3 className="font-medium text-lg mb-4 text-gray-900 border-b pb-2">Customer Details</h3>
             <ul className="space-y-2 text-gray-600">
               <li>{order.customerName}</li>
               <li>{order.email}</li>
               <li>{order.address}</li>
               <li>{order.city}, {order.country}</li>
             </ul>
          </div>
          <div>
             <h3 className="font-medium text-lg mb-4 text-gray-900 border-b pb-2">Order Summary</h3>
             <ul className="space-y-3 mb-4">
              {order.items.map((item: any) => (
                <li key={item.id} className="flex justify-between text-gray-600 mt-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${((item.unitPrice * item.quantity) / 100).toFixed(2)}</span>
                </li>
              ))}
             </ul>
             <div className="flex justify-between font-bold text-lg pt-4 border-t">
               <span>Total</span>
               <span>${(order.total / 100).toFixed(2)} CAD</span>
             </div>
          </div>
        </div>

        {order.paymentMethod !== 'COD' && order.paymentStatus !== 'PAID' && (
          <div className="bg-gray-50 p-6 rounded-xl border mb-8">
            <h3 className="font-bold text-lg mb-2">Payment Instructions</h3>
            {order.paymentMethod === 'BANK_TRANSFER' ? (
              <p className="text-gray-600 mb-6">
                Please e-transfer <span className="font-bold">${(order.total / 100).toFixed(2)}</span> to <span className="font-bold">payments@blendbase.store</span>.<br/>
                Include your order number <strong>#{order.id.slice(-6)}</strong> in the message.
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                Please transfer exactly <span className="font-bold">${(order.total / 100).toFixed(2)}</span> via Mobile Money to <strong>+1-555-0199</strong>.
              </p>
            )}

            {!order.proofUrl ? (
               <form onSubmit={handleUpload} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium mb-2">Upload Payment Receipt</label>
                   <input 
                     type="file" required
                     accept="image/*,.pdf"
                     onChange={(e) => setFile(e.target.files?.[0] || null)}
                     className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 cursor-pointer" 
                   />
                 </div>
                 <Button type="submit" disabled={!file || uploading}>
                   {uploading ? "Uploading..." : "Submit Proof"}
                 </Button>
               </form>
            ) : (
              <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                Payment proof received. We are verifying it currently.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
