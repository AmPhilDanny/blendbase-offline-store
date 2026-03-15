"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AdminOrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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

  const updateStatus = async (status: string) => {
    setUpdating(true)
    const formData = new FormData()
    formData.append("_action", "status")
    formData.append("status", status)

    try {
       const res = await fetch(`/api/orders/${id}`, {
         method: "POST",
         body: formData
       })
       if (res.ok) {
         setOrder(await res.json())
         router.refresh()
       }
    } catch (error) {
      console.error("Failed to update status", error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div>Loading order...</div>
  if (!order) return <div className="text-red-500">Order not found</div>

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-black flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order #{order.id.slice(-8)}</h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="p-2 border rounded-lg bg-white outline-none"
            value={order.paymentStatus}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Items</h2>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                     <span className="font-medium">{item.quantity} x</span>
                     <Link href={`/product/${item.productId}`} className="hover:underline text-blue-600">
                      {item.name}
                     </Link>
                  </div>
                  <span className="font-medium">
                    ${((item.unitPrice * item.quantity) / 100).toFixed(2)} CAD
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 border-t flex justify-between items-center font-bold text-lg">
               <span>Total</span>
               <span>${(order.total / 100).toFixed(2)} CAD</span>
            </div>
          </div>

          {/* Proof of Payment */}
          {order.paymentMethod !== 'COD' && (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Payment Proof</h2>
              </div>
              <div className="p-6">
                 {order.proofUrl ? (
                   <div>
                     <p className="mb-4 text-green-600 font-medium pb-4 border-b">
                       Customer has uploaded a receipt.
                     </p>
                     <a href={order.proofUrl} target="_blank" rel="noreferrer" className="block max-w-sm rounded-lg overflow-hidden border">
                        <img src={order.proofUrl} alt="Payment Proof" className="w-full h-auto" />
                     </a>
                     <div className="mt-4 flex gap-4">
                       <Button onClick={() => updateStatus('PAID')} disabled={order.paymentStatus === 'PAID' || updating} className="bg-green-600 hover:bg-green-700 text-white">
                         Mark as Paid
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <p className="text-gray-500">No proof uploaded yet.</p>
                 )}
              </div>
            </div>
          )}
        </div>

        <div>
           {/* Customer Details */}
          <div className="bg-white border rounded-xl overflow-hidden mb-8">
             <div className="p-6 border-b">
                <h2 className="text-lg font-bold">Customer Details</h2>
             </div>
             <div className="p-6 space-y-4 text-sm text-gray-700">
               <div>
                  <span className="block text-gray-500 mb-1">Name</span>
                  <span className="font-medium">{order.customerName}</span>
               </div>
               <div>
                  <span className="block text-gray-500 mb-1">Email</span>
                  <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">{order.email}</a>
               </div>
               <div>
                  <span className="block text-gray-500 mb-1">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
               </div>
             </div>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden mb-8">
             <div className="p-6 border-b">
                <h2 className="text-lg font-bold">Shipping Address</h2>
             </div>
             <div className="p-6 space-y-1 text-sm text-gray-700">
               <p>{order.customerName}</p>
               <p>{order.address}</p>
               <p>{order.city}</p>
               <p>{order.country}</p>
             </div>
          </div>

          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-yellow-200">
                  <h2 className="text-sm font-bold text-yellow-800">Order Notes</h2>
               </div>
               <div className="p-4 text-sm text-yellow-900">
                 {order.notes}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
