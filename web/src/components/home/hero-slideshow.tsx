import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Company } from '@/lib/types/insurance'
import { CompanyLogo } from '@/components/companies/company-logo'

interface HeroSlideshowProps {
  companies: Company[]
}

const AUTO_ADVANCE_MS = 5000

export function HeroSlideshow({ companies }: HeroSlideshowProps) {
  const slides = companies.filter((c) => c.homepageImage)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  function goTo(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length)
  }

  const active = slides[index]

  return (
    <div className="relative overflow-hidden rounded-[8px] border border-line shadow-[0_20px_40px_-24px_rgba(30,47,69,0.35)]">
      <a
        href={active.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Bezoek de website van ${active.name}`}
        className="relative block h-[380px] w-full sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[680px]"
      >
        {slides.map((company, i) => (
          <img
            key={company.slug}
            src={company.homepageImage}
            alt={`Homepage van ${company.name}`}
            className={`slideshow-slide absolute inset-0 h-full w-full object-cover object-top ${i === index ? 'is-active' : ''}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                goTo(index - 1)
              }}
              aria-label="Vorige maatschappij"
              className="absolute inset-y-0 left-0 z-10 flex w-1/5 items-center justify-start pl-3 opacity-0 transition-opacity hover:opacity-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-raised/90 text-ink shadow">
                <ChevronLeft className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                goTo(index + 1)
              }}
              aria-label="Volgende maatschappij"
              className="absolute inset-y-0 right-0 z-10 flex w-1/5 items-center justify-end pr-3 opacity-0 transition-opacity hover:opacity-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-raised/90 text-ink shadow">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-paper-raised">
          <div className="flex items-center gap-3">
            <CompanyLogo
              name={active.name}
              logoInitial={active.logoInitial}
              logoUrl={active.logoUrl}
              size="md"
            />
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-paper-raised/80">
                Bekijk de website van
              </p>
              <h3 className="font-slab text-2xl font-bold">{active.name}</h3>
            </div>
          </div>
        </div>
      </a>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-line bg-paper-raised py-3">
          {slides.map((company, i) => (
            <button
              key={company.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ga naar ${company.name}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-stamp-dark' : 'w-1.5 bg-line hover:bg-slate'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
