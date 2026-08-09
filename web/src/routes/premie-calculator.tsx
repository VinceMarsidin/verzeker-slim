import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { Car, Plane, Home as HomeIcon, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    schemaPerCategorie,
    voertuigTypes,
    gebruiksdoelen,
    type Categorie,
    type PremieCalculatorResult,
} from '@/lib/validators/premie.schema'
import { berekenPremie } from '@/lib/server/premie'

const voertuigTypeLabels: Record<(typeof voertuigTypes)[number], string> = {
    auto: 'Auto',
    elektrische_auto: 'Elektrische auto',
    motorfiets: 'Motorfiets',
    bromfiets: 'Bromfiets',
    bus: 'Bus',
    pickup_truck: 'Pick-up / Truck',
    zwaar_materieel: 'Zwaar materieel',
}

const gebruiksdoelLabels: Record<(typeof gebruiksdoelen)[number], string> = {
    prive: 'Privégebruik',
    taxi: 'Taxi',
    verhuur: 'Autoverhuur',
    lease: 'Lease',
    rijles: 'Rijles',
}

export const Route = createFileRoute('/premie-calculator')({
    component: PremieCalculatorPage,
})

const categorieen = [
    { value: 'motor', label: 'Motor', icon: Car },
    { value: 'reis', label: 'Reis', icon: Plane },
    { value: 'woon', label: 'Woon', icon: HomeIcon },
    { value: 'leven', label: 'Leven', icon: ShieldCheck },
] as const

// Zelfde set als heroImages in vergelijkingen.tsx, bewust hergebruikt zodat
// dezelfde categorie overal hetzelfde beeld toont.
const heroImages: Record<Categorie, string> = {
    motor:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80&auto=format&fit=crop',
    reis:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80&auto=format&fit=crop',
    woon:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80&auto=format&fit=crop',
    leven:
        'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1400&q=80&auto=format&fit=crop',
}

// Alle mogelijke velden staan hier optioneel in één form-type; welke ervan
// verplicht zijn hangt af van de gekozen categorie (zie de dynamische
// resolver hieronder).
type FormValues = {
    categorie: Categorie
    dagwaarde?: number
    voertuigtype?: (typeof voertuigTypes)[number]
    bouwjaar?: number
    gebruiksdoel?: (typeof gebruiksdoelen)[number]
    miniCasco?: boolean
    inzittendenverzekering?: boolean
    aantalDagen?: number
    aantalPersonen?: number
    vierkanteMeters?: number
    leeftijd?: number
    looptijdJaren?: number
    verzekerdBedrag?: number
}

// Kiest per submit/validatie het juiste zod-schema op basis van de op dat
// moment geselecteerde categorie, zodat één form-instance toch per categorie
// andere verplichte velden kan afdwingen.
const dynamicResolver: Resolver<FormValues> = (values, context, options) => {
    const schema = schemaPerCategorie[values.categorie]
    const resolver = zodResolver(schema) as unknown as Resolver<FormValues>
    return resolver(values, context, options)
}

const categorieTips: Record<Categorie, string> = {
    motor:
        'Een hoger eigen risico verlaagt vaak de premie — check bij het vergelijken wat voor jou opweegt.',
    reis:
        'Sluit een reisverzekering bij voorkeur af vóór vertrek, zodat je vanaf dag één gedekt bent.',
    woon:
        'Woonverzekeringen dekken meestal het pand zelf — inboedel is vaak een aparte, losse dekking.',
    leven:
        'Hoe eerder je een levensverzekering afsluit, hoe lager de premie doorgaans per jaar uitvalt.',
}

function formatSrd(amount: number) {
    return `SRD ${amount.toLocaleString('nl-NL')}`
}

function PremieCalculatorPage() {
    const [result, setResult] = useState<PremieCalculatorResult | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [livePreview, setLivePreview] = useState<number | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: dynamicResolver,
        defaultValues: { categorie: 'motor' },
    })

    const categorie = watch('categorie')
    const alleWaardes = watch()

    // Live voorbeeld: zodra de ingevulde velden voor de huidige categorie
    // geldig zijn, berekenen we (gedebounced) een indicatie op de achtergrond,
    // los van de "officiële" berekening via de submit-knop.
    useEffect(() => {
        const schema = schemaPerCategorie[alleWaardes.categorie]
        const parsed = schema.safeParse(alleWaardes)

        if (!parsed.success) {
            setLivePreview(null)
            return
        }

        const timeout = setTimeout(() => {
            berekenPremie({ data: parsed.data as never })
                .then((res) => setLivePreview(res.premie))
                .catch(() => setLivePreview(null))
        }, 500)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(alleWaardes)])

    function selecteerCategorie(nieuw: Categorie) {
        setValue('categorie', nieuw)
        setResult(null)
        setSubmitError(null)
        setLivePreview(null)
    }

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        setSubmitError(null)
        try {
            // values is op dit punt al gevalideerd tegen het juiste sub-schema,
            // dus veilig te casten naar het discriminated-union input-type.
            const data = await berekenPremie({ data: values as never })
            setResult(data)
        } catch {
            setSubmitError('Er ging iets mis bij het berekenen. Probeer het opnieuw.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-8 py-16 md:grid md:grid-cols-[1fr_320px] md:gap-16">
            <div className="max-w-2xl">
                <div className="mb-2 font-mono text-xs uppercase tracking-wide text-stamp-dark">
                    Premie-indicatie
                </div>
                <h1 className="font-slab text-3xl font-bold text-ink">Bereken je premie</h1>
                <p className="mt-3 max-w-md text-ink-soft">
                    Een snelle schatting, per categorie op basis van andere gegevens. Voor
                    een exacte premie vergelijk je de aanbieders zelf op de
                    vergelijkingspagina.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {categorieen.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => selecteerCategorie(value)}
                                className={`flex flex-col items-center gap-2 rounded-[4px] border p-4 text-sm font-semibold transition-colors ${categorie === value
                                        ? 'border-stamp-dark bg-stamp-dark/10 text-stamp-dark'
                                        : 'border-line bg-paper-raised text-ink-soft hover:border-stamp-dark/40'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="mb-8 overflow-hidden rounded-[4px] border border-line">
                        <img
                            key={categorie}
                            src={heroImages[categorie]}
                            alt={`${categorieen.find((c) => c.value === categorie)?.label ?? ''}verzekering`}
                            className="block h-[200px] w-full object-cover md:h-[260px]"
                        />
                    </div>

                    {/* Motor */}
                    {categorie === 'motor' && (
                        <>
                            <Veld label="Dagwaarde voertuig" prefix="SRD">
                                <input
                                    type="number"
                                    placeholder="Bijv. 150000"
                                    className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                    {...register('dagwaarde', { valueAsNumber: true })}
                                />
                            </Veld>
                            {errors.dagwaarde && <Foutmelding message={errors.dagwaarde.message} />}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-ink">
                                        Voertuigtype
                                    </label>
                                    <select
                                        className="w-full rounded-[4px] border border-line bg-paper-raised px-4 py-3 font-mono text-sm text-ink outline-none"
                                        {...register('voertuigtype')}
                                    >
                                        <option value="">Kies een type</option>
                                        {voertuigTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {voertuigTypeLabels[type]}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.voertuigtype && (
                                        <Foutmelding message={errors.voertuigtype.message} />
                                    )}
                                </div>

                                <div>
                                    <Veld label="Bouwjaar">
                                        <input
                                            type="number"
                                            placeholder="Bijv. 2019"
                                            className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                            {...register('bouwjaar', { valueAsNumber: true })}
                                        />
                                    </Veld>
                                    {errors.bouwjaar && <Foutmelding message={errors.bouwjaar.message} />}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-ink">
                                    Gebruiksdoel
                                </label>
                                <select
                                    className="mb-4 w-full rounded-[4px] border border-line bg-paper-raised px-4 py-3 font-mono text-sm text-ink outline-none"
                                    {...register('gebruiksdoel')}
                                >
                                    <option value="">Kies een gebruiksdoel</option>
                                    {gebruiksdoelen.map((doel) => (
                                        <option key={doel} value={doel}>
                                            {gebruiksdoelLabels[doel]}
                                        </option>
                                    ))}
                                </select>
                                {errors.gebruiksdoel && (
                                    <Foutmelding message={errors.gebruiksdoel.message} />
                                )}
                            </div>

                            <div className="mb-6 flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 text-sm text-ink-soft">
                                    <input type="checkbox" {...register('miniCasco')} />
                                    Mini Casco (+SRD 300)
                                </label>
                                <label className="flex items-center gap-2 text-sm text-ink-soft">
                                    <input type="checkbox" {...register('inzittendenverzekering')} />
                                    Ongevallen inzittenden (+SRD 150)
                                </label>
                            </div>
                        </>
                    )}

                    {/* Reis */}
                    {categorie === 'reis' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Veld label="Aantal dagen">
                                    <input
                                        type="number"
                                        placeholder="Bijv. 14"
                                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                        {...register('aantalDagen', { valueAsNumber: true })}
                                    />
                                </Veld>
                                {errors.aantalDagen && <Foutmelding message={errors.aantalDagen.message} />}
                            </div>
                            <div>
                                <Veld label="Aantal personen">
                                    <input
                                        type="number"
                                        placeholder="Bijv. 2"
                                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                        {...register('aantalPersonen', { valueAsNumber: true })}
                                    />
                                </Veld>
                                {errors.aantalPersonen && (
                                    <Foutmelding message={errors.aantalPersonen.message} />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Woon */}
                    {categorie === 'woon' && (
                        <>
                            <Veld label="Woonoppervlakte" prefix="m²">
                                <input
                                    type="number"
                                    placeholder="Bijv. 120"
                                    className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                    {...register('vierkanteMeters', { valueAsNumber: true })}
                                />
                            </Veld>
                            {errors.vierkanteMeters && (
                                <Foutmelding message={errors.vierkanteMeters.message} />
                            )}
                        </>
                    )}

                    {/* Leven */}
                    {categorie === 'leven' && (
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Veld label="Leeftijd">
                                    <input
                                        type="number"
                                        placeholder="Bijv. 35"
                                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                        {...register('leeftijd', { valueAsNumber: true })}
                                    />
                                </Veld>
                                {errors.leeftijd && <Foutmelding message={errors.leeftijd.message} />}
                            </div>
                            <div>
                                <Veld label="Looptijd (jaar)">
                                    <input
                                        type="number"
                                        placeholder="Bijv. 20"
                                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                        {...register('looptijdJaren', { valueAsNumber: true })}
                                    />
                                </Veld>
                                {errors.looptijdJaren && (
                                    <Foutmelding message={errors.looptijdJaren.message} />
                                )}
                            </div>
                            <div>
                                <Veld label="Verzekerd bedrag" prefix="SRD">
                                    <input
                                        type="number"
                                        placeholder="Bijv. 50000"
                                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                                        {...register('verzekerdBedrag', { valueAsNumber: true })}
                                    />
                                </Veld>
                                {errors.verzekerdBedrag && (
                                    <Foutmelding message={errors.verzekerdBedrag.message} />
                                )}
                            </div>
                        </div>
                    )}

                    {livePreview !== null && (
                        <div className="mb-4 flex items-center justify-between rounded-[4px] border border-dashed border-stamp-dark/40 bg-stamp-dark/5 px-4 py-3">
                            <span className="text-sm text-ink-soft">Live voorbeeld</span>
                            <span className="font-mono text-lg font-semibold text-stamp-dark">
                                {formatSrd(livePreview)}
                            </span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 w-full bg-stamp-dark py-3.5 text-sm font-semibold hover:bg-stamp-dark/90"
                    >
                        {isSubmitting ? 'Bezig met berekenen...' : 'Bereken nu'}
                    </Button>

                    {submitError && <Foutmelding message={submitError} />}
                </form>

                {result && (
                    <div className="mt-8 rounded-[4px] border border-trust bg-trust/5 p-6">
                        <p className="font-mono text-xs uppercase tracking-wide text-trust">
                            Geschatte jaarpremie
                        </p>
                        <p className="mt-1 font-mono text-3xl font-bold text-ink">
                            {formatSrd(result.premie)}
                        </p>

                        <div className="mt-4 space-y-1.5 border-t border-dashed border-trust/30 pt-4">
                            {result.breakdown.map((regel) => (
                                <div
                                    key={regel.label}
                                    className="flex items-center justify-between text-sm text-ink-soft"
                                >
                                    <span>{regel.label}</span>
                                    <span className="font-mono">{formatSrd(regel.bedrag)}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-ink-soft">{result.toelichting}</p>
                    </div>
                )}
            </div>

            <aside className="mt-12 md:mt-0">
                <div className="sticky top-24 space-y-6">
                    <div className="rounded-[4px] border border-line bg-paper-raised p-6">
                        <p className="font-mono text-xs uppercase tracking-wide text-stamp-dark">
                            Wist je dat?
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                            {categorieTips[categorie]}
                        </p>
                    </div>

                    <div className="rounded-[4px] border border-line bg-paper-raised p-6">
                        <p className="font-mono text-xs uppercase tracking-wide text-stamp-dark">
                            Waarom vergelijken?
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-ink-soft">
                            <li>Onafhankelijk, geen verplichtingen</li>
                            <li>Premies van meerdere maatschappijen naast elkaar</li>
                            <li>Altijd gratis om te vergelijken</li>
                        </ul>
                    </div>

                    <div className="rounded-[4px] border border-stamp-dark/40 bg-stamp-dark/5 p-6">
                        <p className="font-slab text-base font-bold text-ink">
                            Klaar om te vergelijken?
                        </p>
                        <p className="mt-2 text-sm text-ink-soft">
                            Bekijk de echte aanbieders voor{' '}
                            {categorieen.find((c) => c.value === categorie)?.label.toLowerCase()}.
                        </p>
                        <Link
                            to="/vergelijkingen/$type"
                            params={{ type: categorie }}
                            className="mt-4 inline-block w-full rounded-[4px] bg-stamp-dark px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-stamp-dark/90"
                        >
                            Vergelijk aanbieders
                        </Link>
                    </div>
                </div>
            </aside>
        </div>
    )
}

function Veld({
    label,
    prefix,
    children,
}: {
    label: string
    prefix?: string
    children: React.ReactNode
}) {
    return (
        <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-ink">{label}</label>
            <div className="flex items-center gap-2 rounded-[4px] border border-line bg-paper-raised px-4 py-3">
                {prefix && <span className="font-mono text-sm text-ink-soft">{prefix}</span>}
                {children}
            </div>
        </div>
    )
}

function Foutmelding({ message }: { message?: string }) {
    if (!message) return null
    return <p className="mb-4 text-sm text-red-600">{message}</p>
}
