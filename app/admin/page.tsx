import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, and remove products</p>
        </Link>
        
        <Link href="/admin/orders" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>
        
        <Link href="/admin/users" className="card p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View user accounts</p>
        </Link>
      </div>
    </div>
  )
}

