'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  total: number
  status: string
  paymentStatus: string
  shippingAddress: string
  phoneNumber: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }>
}

export default function OrdersAdminList({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setUpdating(null)
    }
  }

  const handleQuickAction = async (orderId: string, action: string) => {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setUpdating(null)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phoneNumber && order.phoneNumber.includes(searchTerm)) ||
      order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-rose-200">
          <div className="text-3xl font-extrabold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.total}</div>
          <div className="text-sm text-gray-600 font-semibold">Total</div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-yellow-200">
          <div className="text-3xl font-extrabold text-yellow-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.pending}</div>
          <div className="text-sm text-gray-600 font-semibold">Pending</div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-blue-200">
          <div className="text-3xl font-extrabold text-blue-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.processing}</div>
          <div className="text-sm text-gray-600 font-semibold">Processing</div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-purple-200">
          <div className="text-3xl font-extrabold text-purple-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.shipped}</div>
          <div className="text-sm text-gray-600 font-semibold">Shipped</div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-200">
          <div className="text-3xl font-extrabold text-green-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.delivered}</div>
          <div className="text-sm text-gray-600 font-semibold">Delivered</div>
        </div>
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-red-200">
          <div className="text-3xl font-extrabold text-red-600 mb-1 group-hover:scale-110 transition-transform duration-300">{stats.cancelled}</div>
          <div className="text-sm text-gray-600 font-semibold">Cancelled</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Orders</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, email, phone, or address..."
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-2xl text-rose-400"></i>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      {orders.length === 0 ? 'No orders found' : 'No orders match your search'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-rose-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-rose-600 hover:text-rose-700 font-mono text-sm font-bold hover:scale-110 transition-transform duration-200 inline-block"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{order.user.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`tel:${order.phoneNumber}`} className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">
                      {order.phoneNumber}
                    </a>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-600 truncate" title={order.shippingAddress}>
                      {order.shippingAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {order.total.toFixed(2)} EGP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="border-2 border-gray-300 rounded-lg px-3 py-1.5 text-sm disabled:opacity-50 flex-1 font-semibold hover:border-rose-300 transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleQuickAction(order.id, 'PROCESSING')}
                          disabled={updating === order.id}
                          className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 font-bold border border-blue-300 hover:scale-110 transition-transform duration-200"
                          title="Mark as Processing"
                        >
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      )}
                      {order.status === 'PROCESSING' && (
                        <button
                          onClick={() => handleQuickAction(order.id, 'SHIPPED')}
                          disabled={updating === order.id}
                          className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 font-bold border border-purple-300 hover:scale-110 transition-transform duration-200"
                          title="Mark as Shipped"
                        >
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => handleQuickAction(order.id, 'DELIVERED')}
                          disabled={updating === order.id}
                          className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 font-bold border border-green-300 hover:scale-110 transition-transform duration-200"
                          title="Mark as Delivered"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : order.paymentStatus === 'FAILED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-rose-600 hover:text-rose-700 text-sm font-semibold flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                    >
                      <i className="fas fa-eye"></i>
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}

