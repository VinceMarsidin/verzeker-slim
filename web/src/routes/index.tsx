import { createFileRoute, Link } from '@tanstack/react-router'
import { Car, Plane, Home as HomeIcon, ShieldCheck, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { HeroSlideshow } from '@/components/home/hero-slideshow'
import { PremieLedger } from '@/components/home/premie-ledger'
import { getCompaniesFn } from '@/lib/server/insurance'
import { seo, seoLinks } from '@/lib/seo'

export const Route = createFileRoute('/')({
  loader: async () => {
    const companies = await getCompaniesFn({ data: undefined })
    return { companies }
  },
  head: () => ({
    meta: seo({
      title: 'Vergelijk verzekeringspremies in Suriname',
      description:
        'Vergelijk motor-, reis-, woon- en levensverzekeringen van erkende maatschappijen in Suriname en de regio. Bereken je premie en kies de beste dekking.',
      path: '/',
    }),
    links: seoLinks('/'),
  }),
  component: HomePage,
})

const categorieen = [
  {
    icon: Car,
    code: 'M',
    naam: 'Motor',
    slug: 'motor',
    omschrijving: 'WA en casco-dekkingen voor je voertuig.',
    image: '/motor.png',
  },

  {
    icon: Plane,
    code: 'R',
    naam: 'Reis',
    slug: 'reis',
    omschrijving: 'Dekking voor kortere en langere reizen.',
    image: '/reis.png',
  },

  {
    icon: HomeIcon,
    code: 'W',
    naam: 'Woon',
    slug: 'woon',
    omschrijving: 'Inboedel- en opstalverzekeringen.',
    image: '/woon.png',
  },

  {
    icon: ShieldCheck,
    code: 'L',
    naam: 'Leven',
    slug: 'leven',
    omschrijving: 'Levensverzekeringen voor jou en je gezin.',
    image: '/leven.png',
  },
]

const stats = [
  { value: '37+', label: 'verzekeraars in 8 regio\'s' },
  { value: '100%', label: 'gratis voor consumenten' },
  { value: '0', label: 'wachttijd om te vergelijken' },
]

const stappen = [
  { num: '01', titel: 'Kies je categorie', beschrijving: 'Selecteer motor, reis, woon of leven.' },
  { num: '02', titel: 'Vul je gegevens in', beschrijving: 'Zo berekenen we de premie die bij jou past.' },
  { num: '03', titel: 'Vergelijk de aanbieders', beschrijving: 'Zie premies van alle maatschappijen naast elkaar.' },
  { num: '04', titel: 'Kies je polis', beschrijving: 'Ga rechtstreeks naar de verzekeraar van je keuze.' },
]

const faqs = [
  {
    vraag: 'Zijn jullie verbonden aan een specifieke verzekeringsmaatschappij?',
    antwoord:
      'Nee, VerzekerSlim is onafhankelijk. We tonen premies en dekkingen van meerdere maatschappijen, waaronder Assuria, objectief naast elkaar, zodat jij zelf kiest.',
  },
  {
    vraag: 'Kan ik meerdere verzekeringen tegelijk vergelijken?',
    antwoord: 'Ja, je kunt meerdere categorieën na elkaar doorlopen en de resultaten naast elkaar bekijken.',
  },
  {
    vraag: 'Hoe vaak worden de tarieven bijgewerkt?',
    antwoord: 'We werken de premies bij zodra maatschappijen nieuwe tarieven doorgeven.',
  },
  {
    vraag: 'Kost het gebruik van VerzekerSlim extra geld?',
    antwoord:
      'Nee, vergelijken is gratis. Je betaalt bij de verzekeraar dezelfde premie als wanneer je rechtstreeks naar hen toe zou gaan.',
  },
]

function HomePage() {
  const { companies } = Route.useLoaderData()
  return (
    <div className="bg-paper text-ink">
      <section className="px-6 pb-14 pt-6 sm:px-10 sm:pt-8 md:pb-20 md:pt-10 lg:px-16 xl:px-20">
        <div className="rise-in mx-auto max-w-[1520px]">
          <HeroSlideshow companies={companies} />
        </div>

        <div className="rise-in mx-auto mt-12 max-w-2xl text-center">
          <div className="mb-4 font-mono text-xs uppercase tracking-wide text-stamp-dark">
            Verzekeringen vergelijken &middot; Suriname
          </div>
          <h1 className="font-slab text-4xl font-bold leading-tight md:text-[44px]">
            Zie in één oogopslag wie de beste premie biedt.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[17px] text-ink-soft">
            Geen kleine lettertjes of verborgen kosten. VerzekerSlim zet de premies
            van Surinaamse verzekeraars naast elkaar, zodat jij een onderbouwde
            keuze maakt.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-stamp-dark px-7 py-3.5 text-sm font-semibold hover:bg-stamp-dark/90">
              <Link to="/vergelijkingen">Start vergelijking</Link>
            </Button>
            <Button asChild variant="outline" className="border-ink px-7 py-3.5 text-sm font-semibold">
              <a href="#hoe-het-werkt">Hoe het werkt</a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-4">
          {categorieen.map(({ icon: Icon, naam, slug }) => (
            <Link
              key={naam}
              to="/vergelijkingen/$type"
              params={{ type: slug }}
              className="group flex items-center gap-2 text-sm font-semibold text-ink hover:text-stamp-dark"
            >
              <Icon className="h-4 w-4 text-stamp-dark" />
              {naam}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-line bg-paper-raised px-8 py-14">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 text-center md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="count-up">
              <p className="font-slab text-4xl font-bold text-ink">{s.value}</p>
              <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="hoe-het-werkt" className="mx-auto max-w-5xl px-8 py-20">
        <h2 className="text-center font-slab text-[28px] font-bold">Hoe het werkt</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-ink-soft">
          Vier stappen tussen jou en de juiste polis, zonder verrassingen.
        </p>
        <div className="mx-auto mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stappen.map((stap) => (
            <div key={stap.num} className="rise-in flex gap-4">
              <span className="font-mono text-sm font-semibold text-stamp-dark">{stap.num}</span>
              <div>
                <h4 className="font-slab font-bold text-ink">{stap.titel}</h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{stap.beschrijving}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[6px] border border-line">
          <PremieLedger />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-8 py-20">
        <h2 className="text-center font-slab text-[28px] font-bold">Kies jouw verzekering</h2>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-4">
          {categorieen.map(({ icon: Icon, naam, slug, omschrijving, image }) => (
            <Link
              key={naam}
              to="/vergelijkingen/$type"
              params={{ type: slug }}
              className="hover-lift rise-in group relative overflow-hidden rounded-[6px] border border-line bg-paper-raised"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/0" />
              </div>
              <div className="p-6">
                <Icon className="mb-2 h-5 w-5 text-stamp-dark" />
                <h3 className="font-slab text-base font-bold">{naam}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{omschrijving}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-stamp-dark">
                  Vergelijk nu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-8 py-20">
        <h2 className="text-center font-slab text-[28px] font-bold">Veelgestelde vragen</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq) => (
            <AccordionItem key={faq.vraag} value={faq.vraag} className="border-line">
              <AccordionTrigger className="font-slab text-base font-bold text-ink">
                {faq.vraag}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-ink-soft">
                {faq.antwoord}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto my-8 max-w-5xl px-8 pb-20">
        <div className="flex flex-col items-start gap-8 overflow-hidden rounded-[6px] border border-line bg-paper-raised md:flex-row md:items-stretch">
          <div className="relative h-56 w-full md:h-auto md:w-2/5">
            <img
              src="/backgrounds/about-foto.jpg"
              alt="Suriname"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col items-start justify-center gap-6 p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <h2 className="font-slab text-2xl font-bold">Jouw gegevens blijven van jou</h2>
              <p className="mt-3 max-w-md text-ink-soft">
                We vragen nooit meer gegevens dan nodig, en delen niets met derden
                zonder jouw toestemming. Vergelijken kost je niets extra &mdash; je
                betaalt bij de verzekeraar dezelfde premie als rechtstreeks.
              </p>
            </div>
            <Button asChild className="whitespace-nowrap bg-stamp-dark px-7 py-3.5 text-sm font-semibold hover:bg-stamp-dark/90">
              <Link to="/vergelijkingen">
                Vergelijk nu gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}