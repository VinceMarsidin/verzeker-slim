import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Car,
  Plane,
  Home as HomeIcon,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Star,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const quickSelect = [
  { icon: Car, label: 'Motor' },
  { icon: Plane, label: 'Reis' },
  { icon: HomeIcon, label: 'Woon' },
  { icon: ShieldCheck, label: 'Leven' },
]

const insuranceCards = [
  {
    icon: Car,
    title: 'Motorrijtuigverzekering',
    description:
      'Verzeker je auto of motor tegen schade, diefstal en aansprakelijkheid.',
  },
  {
    icon: Plane,
    title: 'Reisverzekering',
    description:
      'Goed verzekerd tegen pech, schade en medische kosten op reis.',
  },
  {
    icon: HomeIcon,
    title: 'Woonverzekering',
    description: 'Zekerheid voor je huis en alles wat erin zit.',
  },
  {
    icon: ShieldCheck,
    title: 'Levensverzekering',
    description: 'Zekerheid voor later, rust voor nu.',
  },
]

const testimonials = [
  {
    quote:
      'Binnen tien minuten had ik alle premies naast elkaar. Geen gedoe, gewoon duidelijkheid.',
    name: 'Michael',
    role: 'VerzekerSlim klant',
  },
  {
    quote:
      'Ik voelde me niet onder druk gezet om snel te kiezen. Fijn dat het echt onafhankelijk is.',
    name: 'Priscilla',
    role: 'VerzekerSlim klant',
  },
  {
    quote:
      'Simpel proces, en ik betaalde exact dezelfde premie als rechtstreeks bij de verzekeraar.',
    name: 'Randy',
    role: 'VerzekerSlim klant',
  },
]

const stats = [
  { value: '4', label: 'verzekeringsmaatschappijen vergeleken' },
  { value: '100%', label: 'gratis voor consumenten' },
  { value: '0', label: 'wachttijd' },
]

const steps = [
  {
    number: 1,
    title: 'Kies je verzekering',
    description: 'Selecteer motor, reis, woon of leven.',
  },
  {
    number: 2,
    title: 'Vul je gegevens in',
    description: 'Zo vinden we de premie die bij jou past.',
  },
  {
    number: 3,
    title: 'Vergelijk de aanbieders',
    description: 'Zie premies van alle maatschappijen naast elkaar.',
  },
  {
    number: 4,
    title: 'Kies je polis',
    description: 'Ga rechtstreeks naar de verzekeraar van je keuze.',
  },
]

const faqs = [
  {
    question:
      'Zijn jullie verbonden aan een specifieke verzekeringsmaatschappij?',
    answer:
      'Nee, VerzekerSlim is volledig onafhankelijk. Wij tonen de premies en dekkingen van maatschappijen zoals Assuria, Fatum, Self Reliance en Parsasco objectief naast elkaar, zodat jij de keuze maakt die het beste bij je past.',
  },
  {
    question: 'Kan ik meerdere verzekeringen tegelijk vergelijken?',
    answer:
      'Ja, je kunt meerdere verzekeringen naast elkaar vergelijken om de beste keuze te maken.',
  },
  {
    question: 'Hoe vaak worden de tarieven bijgewerkt?',
    answer:
      'Wij controleren onze data regelmatig en staan in direct contact met de verzekeraars. Hierdoor heb je altijd een actueel overzicht van de laatste acties en premiewijzigingen in Suriname.',
  },
  {
    question: 'Kost het gebruik van VerzekerSlim extra geld?',
    answer:
      'Nee, onze vergelijkingstool is volledig gratis voor consumenten. Je betaalt bij de verzekeraar exact dezelfde premie als wanneer je rechtstreeks naar hen toe zou gaan.',
  },
]

function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-[#142c42] antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e3ebf5] bg-white/95 px-8 py-4 backdrop-blur-md">
        <img src="/logo.png" alt="VerzekerSlim" className="h-9" />
        <nav className="flex items-center gap-9">
          <a href="#" className="text-sm font-medium hover:text-[#1f6fb2]">
            Home
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#1f6fb2]">
            Vergelijkingen
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#1f6fb2]">
            Contact
          </a>
          <a href="#" className="text-sm font-medium hover:text-[#1f6fb2]">
            Inloggen
          </a>
          <a
            href="#"
            className="rounded-lg bg-[#e0983e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(224,152,62,0.32)] hover:bg-[#c77f2b]"
          >
            Vergelijk nu
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-8 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.15] tracking-[-0.5px] text-[#0d3b66] md:text-5xl">
          Een{' '}
          <span className="font-serif italic text-[#2e9e63]">slimme</span>{' '}
          aanpak van verzekeren.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#55677c]">
          Vergelijk premies van Assuria, Fatum, Self Reliance en Parsasco in
          Suriname. Onafhankelijk, gratis en zonder wachttijden.
        </p>

        <div className="relative mx-auto mt-10 w-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-10px_rgba(13,59,102,0.18)]">
          <img
            src="/About-foto.jpg"
            alt="VerzekerSlim"
            className="block w-full h-[600px]"
          />
        </div>

        <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-[#6c7f92]">
          Waarmee kunnen we je helpen?
        </p>
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {quickSelect.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="group flex items-center gap-2 text-base font-semibold text-[#0d3b66] hover:text-[#1f6fb2]"
            >
              <Icon className="h-5 w-5 text-[#e0983e]" />
              {label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ))}
        </div>

        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 rounded-[10px] bg-[#e0983e] px-8 py-4 text-base font-bold text-white shadow-[0_12px_24px_rgba(224,152,62,0.32)] hover:bg-[#c77f2b]"
        >
          Vergelijk nu gratis <ArrowRight className="h-[18px] w-[18px]" />
        </a>
      </section>

      {/* Trust row */}
      <section className="mx-auto mt-24 max-w-4xl px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#1f6fb2]">
          Geen wachtrijen. Altijd echte hulp.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-10">
          <div className="flex items-center gap-2">
            <div className="flex text-[#e0983e]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-[#55677c]">
              4,8 uit 3.900+ beoordelingen
            </span>
          </div>
        </div>
        <p className="font-serif mt-10 text-6xl italic text-[#0d3b66]">
          10.000+
        </p>
        <p className="mt-2 text-sm text-[#6c7f92]">
          Surinamers geholpen bij het vinden van de juiste verzekering
        </p>
      </section>

      {/* Testimonials */}
      <section className="mx-auto mt-24 max-w-5xl px-8">
        <h2 className="text-center text-2xl font-bold tracking-[-0.5px] text-[#0d3b66]">
          Echte klanten, echte verhalen.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[#55677c]">
          Onafhankelijk advies en heldere vergelijkingen, zodat jij met
          vertrouwen kunt kiezen.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[#e3ebf5] bg-[#f8fafd] p-7"
            >
              <p className="text-[0.95rem] leading-relaxed text-[#142c42]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce8f7] text-sm font-bold text-[#1f6fb2]">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0d3b66]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#6c7f92]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-24 border-y border-[#e3ebf5] bg-[#f8fafd] px-8 py-16">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 text-center md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-[#0d3b66]">{s.value}</p>
              <p className="mt-2 text-sm text-[#6c7f92]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-24 max-w-4xl px-8">
        <h2 className="text-center text-2xl font-bold tracking-[-0.5px] text-[#0d3b66]">
          We maken het proces{' '}
          <span className="font-serif italic text-[#2e9e63]">simpel</span>.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[#55677c]">
          Vier stappen tussen jou en de juiste polis, zonder verrassingen.
        </p>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-10 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="font-serif text-3xl italic text-[#e0983e]">
                {step.number}
              </span>
              <div>
                <h4 className="font-semibold text-[#0d3b66]">{step.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-[#55677c]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Insurance types */}
      <section className="mx-auto mt-24 max-w-5xl px-8">
        <h2 className="text-center text-2xl font-bold tracking-[-0.5px] text-[#0d3b66]">
          Kies jouw gewenste verzekering
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#e3ebf5] bg-[#e3ebf5] md:grid-cols-4">
          {insuranceCards.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white p-7 text-left">
              <Icon className="h-6 w-6 text-[#1f6fb2]" />
              <h3 className="mt-4 text-base font-semibold text-[#0d3b66]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#55677c]">
                {description}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1f6fb2] hover:text-[#0d3b66]"
              >
                Vergelijk nu <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-2xl px-8">
        <h2 className="text-center text-2xl font-bold tracking-[-0.5px] text-[#0d3b66]">
          Veelgestelde vragen.
        </h2>
        <div className="mt-10">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div key={faq.question} className="border-b border-[#e7eef8]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-[#0d3b66]"
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[#1f6fb2] transition-transform duration-[250ms] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="pb-5 text-[0.92rem] leading-relaxed text-[#55677c]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto my-24 max-w-5xl px-8">
        <div className="flex flex-col items-center gap-10 rounded-3xl border border-[#e3ebf5] bg-[#f8fafd] p-10 md:flex-row md:p-14">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-[-0.5px] text-[#0d3b66]">
              Klaar met scrollen? Begin met besparen.
            </h2>
            <p className="mt-3 text-[#55677c]">
              Vind de verzekering die bij je past en vergelijk premies van de
              meest vertrouwde maatschappijen in Suriname.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-[#e0983e] px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_24px_rgba(224,152,62,0.32)] hover:bg-[#c77f2b]"
            >
              Vergelijk nu gratis <ArrowRight className="h-[18px] w-[18px]" />
            </a>
          </div>
          <div className="w-full overflow-hidden rounded-2xl">
            <img
              src="/About-foto.jpg"
              alt="VerzekerSlim"
              className="block w-full h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e3ebf5] bg-[#0a2540] px-8 py-14 text-[#b6c4d4]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="VerzekerSlim" className="h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Producten</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Motorverzekering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Reisverzekering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Woonverzekering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Levensverzekering
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Bedrijf</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Over ons
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Beoordelingen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Vacatures
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>info@verzekerslim.sr</li>
              <li>+597 000-0000</li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-5xl text-xs text-[#7d93ab]">
          &copy; 2026 VerzekerSlim. Alle rechten voorbehouden.
        </p>
      </footer>
    </div>
  )
}