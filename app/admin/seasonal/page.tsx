import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SeasonalManager from '@/components/SeasonalManager'
import type { SeasonalCampaign } from '@prisma/client'

export default async function SeasonalAdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.role || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const campaigns = await prisma.seasonalCampaign.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Campaigns</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Manage Seasonal Experience
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Adjust the homepage hero, accent colors, CTAs, and product slug used for seasonal highlights without touching code.
          </p>
        </div>

        <SeasonalManager
          campaigns={campaigns.map((campaign) => ({
            ...campaign,
            createdAt: campaign.createdAt.toISOString(),
            updatedAt: campaign.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}

