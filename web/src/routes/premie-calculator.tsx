import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Car, Plane, Home as HomeIcon, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    premieCalculatorSchema,
    type PremieCalculatorInput,
    type PremieCalculatorResult,
} from '@/lib/validators/premie.schema'
import { berekenPremie } from '@/lib/server/premie'

export const Route = createFileRoute('/premie-calculator')({
    component: PremieCalculatorPage,
})

const categorieen = [
    { value: 'motor', label: 'Motor', icon: Car },
    { value: 'reis', label: 'Reis', icon: Plane },
    { value: 'woon', label: 'Woon', icon: HomeIcon },
    { value: 'leven', label: 'Leven', icon: ShieldCheck },
] as const

function formatSrd(amount: number) {
    return `SRD ${amount.toLocaleString('nl-NL')}`
}

function PremieCalculatorPage() {
    const [result, setResult] = useState<PremieCalculatorResult | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PremieCalculatorInput>({
        resolver: zodResolver(premieCalculatorSchema),
        defaultValues: { categorie: 'motor', dagwaarde: undefined },
    })

    const categorie = watch('categorie')

    async function onSubmit(values: PremieCalculatorInput) {
        setIsSubmitting(true)
        try {
            const data = await berekenPremie({ data: values })
            setResult(data)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-8 py-16">
            <div className="mb-2 font-mono text-xs uppercase tracking-wide text-stamp-dark">
                Premie-indicatie
            </div>
            <h1 className="font-slab text-3xl font-bold text-ink">Bereken je premie</h1>
            <p className="mt-3 max-w-md text-ink-soft">
                Een snelle schatting op basis van de dagwaarde. Voor een exacte premie
                vergelijk je de aanbieders zelf op de vergelijkingspagina.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {categorieen.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setValue('categorie', value)}
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

                <label className="mb-2 block text-sm font-semibold text-ink">
                    Dagwaarde ({categorie === 'motor' ? 'voertuig' : 'object'})
                </label>
                <div className="flex items-center gap-2 rounded-[4px] border border-line bg-paper-raised px-4 py-3">
                    <span className="font-mono text-sm text-ink-soft">SRD</span>
                    <input
                        type="number"
                        step="1"
                        placeholder="Bijv. 150000"
                        className="w-full bg-transparent font-mono text-base text-ink outline-none"
                        {...register('dagwaarde', { valueAsNumber: true })}
                    />
                </div>
                {errors.dagwaarde && (
                    <p className="mt-2 text-sm text-red-600">{errors.dagwaarde.message}</p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 w-full bg-stamp-dark py-3.5 text-sm font-semibold hover:bg-stamp-dark/90"
                >
                    {isSubmitting ? 'Bezig met berekenen...' : 'Bereken nu'}
                </Button>
            </form>

            {result && (
                <div className="mt-8 rounded-[4px] border border-trust bg-trust/5 p-6">
                    <p className="font-mono text-xs uppercase tracking-wide text-trust">
                        Geschatte jaarpremie
                    </p>
                    <p className="mt-1 font-mono text-3xl font-bold text-ink">
                        {formatSrd(result.premie)}
                    </p>
                    {result.minimumToegepast && (
                        <p className="mt-2 text-sm text-ink-soft">
                            De minimumpremie voor deze categorie is toegepast.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
