'use client'

import { useState } from 'react'
type Campaign = {
  id: number
  slug: string
  badge: string
  title: string
  subtitle: string | null
  description: string | null
  heroImage: string | null
  heroHeadline: string | null
  heroSubheadline: string | null
  accent: string | null
  accentLight: string | null
  accentDark: string | null
  ctaPrimaryLabel: string | null
  ctaPrimaryHref: string | null
  ctaSecondaryLabel: string | null
  ctaSecondaryHref: string | null
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

type SeasonalManagerProps = {
  campaigns: Campaign[]
}

const blankForm = {
  slug: '',
  badge: '',
  title: '',
  subtitle: '',
  description: '',
  heroImage: '',
  heroHeadline: '',
  heroSubheadline: '',
  accent: '#f43f5e',
  accentLight: '#fecdd3',
  accentDark: '#be185d',
  ctaPrimaryLabel: 'Shop featured',
  ctaPrimaryHref: '#seasonal',
  ctaSecondaryLabel: 'Browse catalog',
  ctaSecondaryHref: '#products',
  isActive: false,
}

export default function SeasonalManager({ campaigns: initialCampaigns }: SeasonalManagerProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [form, setForm] = useState({ ...blankForm })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleEdit = (campaign: Campaign) => {
    setEditingId(campaign.id)
    setForm({
      slug: campaign.slug,
      badge: campaign.badge,
      title: campaign.title,
      subtitle: campaign.subtitle ?? '',
      description: campaign.description ?? '',
      heroImage: campaign.heroImage ?? '',
      heroHeadline: campaign.heroHeadline ?? '',
      heroSubheadline: campaign.heroSubheadline ?? '',
      accent: campaign.accent ?? blankForm.accent,
      accentLight: campaign.accentLight ?? blankForm.accentLight,
      accentDark: campaign.accentDark ?? blankForm.accentDark,
      ctaPrimaryLabel: campaign.ctaPrimaryLabel ?? blankForm.ctaPrimaryLabel,
      ctaPrimaryHref: campaign.ctaPrimaryHref ?? blankForm.ctaPrimaryHref,
      ctaSecondaryLabel: campaign.ctaSecondaryLabel ?? blankForm.ctaSecondaryLabel,
      ctaSecondaryHref: campaign.ctaSecondaryHref ?? blankForm.ctaSecondaryHref,
      isActive: campaign.isActive,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({ ...blankForm })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch(editingId ? `/api/admin/seasonal/${editingId}` : '/api/admin/seasonal', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save campaign')
      }

      if (editingId) {
        setCampaigns((prev) =>
          prev.map((campaign) => (campaign.id === editingId ? { ...campaign, ...data.campaign } : campaign))
        )
      } else {
        setCampaigns((prev) => [data.campaign, ...prev])
      }

      setStatus({ type: 'success', message: editingId ? 'Campaign updated' : 'Campaign created' })
      resetForm()
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (id: number) => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`/api/admin/seasonal/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to activate campaign')
      }
      setCampaigns((prev) =>
        prev.map((campaign) => ({
          ...campaign,
          isActive: campaign.id === id,
        }))
      )
      setStatus({ type: 'success', message: 'Campaign activated' })
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this campaign?')) return
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`/api/admin/seasonal/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete campaign')
      }
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
      if (editingId === id) {
        resetForm()
      }
      setStatus({ type: 'success', message: 'Campaign deleted' })
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {editingId ? 'Edit Seasonal Campaign' : 'Create Seasonal Campaign'}
            </h2>
            <p className="text-gray-500">
              Update hero copy, colors, and CTA targets for the homepage hero. Activate one campaign at a time.
            </p>
          </div>
          {editingId && (
            <button onClick={resetForm} className="btn btn-secondary">
              Cancel edit
            </button>
          )}
        </div>

        {status && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 border text-sm ${
              status.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Slug
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input mt-1"
                placeholder="evergreen-collection"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Badge
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="input mt-1"
                placeholder="Editor's pick"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input mt-1"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Subtitle
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="input mt-1"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input mt-1 min-h-[120px]"
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Hero headline
              <input
                type="text"
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                className="input mt-1"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Hero subheadline
              <input
                type="text"
                value={form.heroSubheadline}
                onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
                className="input mt-1"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Hero image URL
              <input
                type="url"
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                className="input mt-1"
                placeholder="https://..."
              />
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['accent', 'accentLight', 'accentDark'] as const).map((key) => (
                <label key={key} className="block text-sm font-medium text-gray-700">
                  {key}
                  <input
                    type="color"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input mt-1 h-12 p-1"
                  />
                </label>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Primary CTA label
                <input
                  type="text"
                  value={form.ctaPrimaryLabel}
                  onChange={(e) => setForm({ ...form, ctaPrimaryLabel: e.target.value })}
                  className="input mt-1"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Primary CTA href
                <input
                  type="text"
                  value={form.ctaPrimaryHref}
                  onChange={(e) => setForm({ ...form, ctaPrimaryHref: e.target.value })}
                  className="input mt-1"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Secondary CTA label
                <input
                  type="text"
                  value={form.ctaSecondaryLabel}
                  onChange={(e) => setForm({ ...form, ctaSecondaryLabel: e.target.value })}
                  className="input mt-1"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Secondary CTA href
                <input
                  type="text"
                  value={form.ctaSecondaryHref}
                  onChange={(e) => setForm({ ...form, ctaSecondaryHref: e.target.value })}
                  className="input mt-1"
                />
              </label>
            </div>
            <label className="inline-flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-sm text-gray-600">Activate immediately</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary disabled:opacity-60"
          >
            {loading ? 'Saving...' : editingId ? 'Update campaign' : 'Create campaign'}
          </button>
          {!editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Existing campaigns</h3>
            <p className="text-gray-500">One campaign can be active at a time. Drafts stay saved for later.</p>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No campaigns yet. Create your first above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`rounded-2xl border ${
                  campaign.isActive ? 'border-rose-300 bg-rose-50/50' : 'border-gray-100 bg-white'
                } p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{campaign.badge}</p>
                    <h4 className="text-xl font-bold text-gray-900 mt-1">{campaign.title}</h4>
                    <p className="text-sm text-gray-500">{campaign.subtitle}</p>
                  </div>
                  {campaign.isActive && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {[campaign.accent, campaign.accentLight, campaign.accentDark].map((color, idx) => (
                    <span
                      key={`${campaign.id}-${idx}`}
                      className="w-8 h-8 rounded-full border border-white/40 shadow-inner"
                      style={{ backgroundColor: color ?? '#f43f5e' }}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-4 line-clamp-3">{campaign.description}</p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    className="btn btn-primary flex-1"
                    disabled={campaign.isActive || loading}
                    onClick={() => handleActivate(campaign.id)}
                  >
                    {campaign.isActive ? 'Live now' : 'Set active'}
                  </button>
                  <button className="btn btn-secondary flex-1" onClick={() => handleEdit(campaign)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-outline flex-1"
                    onClick={() => handleDelete(campaign.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

