import dayjs from "dayjs"
import { Order } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Recent Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b uppercase">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Method</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-mono">{order.id.slice(-8)}</td>
                  <td className="p-4">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {dayjs(order.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="p-4 font-medium">
                    ${(order.total / 100).toFixed(2)}
                  </td>
                  <td className="p-4 text-sm">
                    {order.paymentMethod}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-black font-medium hover:underline text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
