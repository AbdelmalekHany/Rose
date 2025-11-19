'use client'

import Image from 'next/image'
import { SeasonalTheme } from '@/lib/seasonal'
import ScrollAnimation from './ScrollAnimation'

type AnimatedHeroProps = {
  campaign: SeasonalTheme
  seasonalProductCount: number
}

const rotatingHighlights = ['Evergreen gifting', 'Velvet wire art', 'Personal concierge']

export default function AnimatedHero({ campaign, seasonalProductCount }: AnimatedHeroProps) {
  return (
    <section className="relative overflow-hidden text-white py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-500 animate-gradient opacity-95" />
      <div className="absolute inset-0" style={{ backgroundImage: campaign.backgroundPattern, opacity: 0.15 }} />

      <div className="absolute -top-24 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-16 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <ScrollAnimation type="float-up">
          <div className="space-y-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-xs uppercase tracking-[0.35em] font-semibold shadow-lg">
              <i className="fas fa-orbit" />
              {campaign.badge}
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                {campaign.heroHeadline ?? campaign.title}
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto lg:mx-0">
                {campaign.heroSubheadline ?? campaign.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {rotatingHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="px-4 py-2 rounded-full border border-white/20 text-sm bg-white/10 backdrop-blur-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href={campaign.ctaPrimary.href}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-xl hover:-translate-y-1 transition-transform"
              >
                {campaign.ctaPrimary.label}
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={campaign.ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {campaign.ctaSecondary.label}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-1">Spotlight</p>
                <p className="text-2xl font-bold">{campaign.title}</p>
                <p className="text-sm text-white/70">{seasonalProductCount} curated pieces</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-1">Palette</p>
                <div className="flex items-center gap-2">
                  {[campaign.accent, campaign.accentLight, campaign.accentDark].map((color) => (
                    <span
                      key={color}
                      className="w-10 h-10 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation type="float-up" delay={150}>
          <div className="relative w-full max-w-xl mx-auto">
            <div className="absolute -top-8 -right-6 w-24 h-24 bg-white/20 rounded-3xl blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-8 w-28 h-28 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-2000" />

            <div className="relative rounded-[32px] overflow-hidden border border-white/30 shadow-2xl bg-white/5 backdrop-blur-xl">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/70">Campaign</p>
                    <p className="text-2xl font-bold">{campaign.title}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-white/20">
                    {campaign.slug}
                  </span>
                </div>

                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-white/15 group">
                  {campaign.heroImage ? (
                    <>
                      <Image
                        src={campaign.heroImage}
                        alt={campaign.title}
                        fill
                        className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white/60">
                      Upload a hero image from the seasonal admin page
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm text-white">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/70">Status</div>
                      <div className="font-semibold">Live spotlight</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-white/70">Adjust anytime</div>
                      <div className="font-semibold">Admin → Seasonal</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs uppercase tracking-[0.2em] text-white/70">
                  <div>
                    <p className="text-white text-base font-semibold">{campaign.badge}</p>
                    <p className="text-white/70 text-[11px] mt-1">Campaign tag</p>
                  </div>
                  <div>
                    <p className="text-white text-base font-semibold">{campaign.ctaPrimary.label}</p>
                    <p className="text-white/70 text-[11px] mt-1">Primary CTA</p>
                  </div>
                  <div>
                    <p className="text-white text-base font-semibold">{campaign.ctaSecondary.label}</p>
                    <p className="text-white/70 text-[11px] mt-1">Secondary CTA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

