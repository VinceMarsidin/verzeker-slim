import { createServerFn } from '@tanstack/react-start'
import {
    premieCalculatorSchema,
    type PremieCalculatorResult,
} from '@/lib/validators/premie.schema'

// Percentage en minimumpremie per categorie. Motor komt overeen met de regel
// uit V1 (2,5% van de dagwaarde, met een minimum van SRD 1.500). De andere
// categorieën zijn placeholder-percentages tot de echte tarieven bekend zijn.
const TARIEVEN: Record<string, { percentage: number; minimum: number }> = {
    motor: { percentage: 0.025, minimum: 1500 },
    reis: { percentage: 0.015, minimum: 250 },
    woon: { percentage: 0.008, minimum: 500 },
    leven: { percentage: 0.012, minimum: 300 },
}

export const berekenPremie = createServerFn({ method: 'POST' })
    .validator(premieCalculatorSchema)
    .handler(async ({ data }): Promise<PremieCalculatorResult> => {
        const tarief = TARIEVEN[data.categorie]
        const berekend = data.dagwaarde * tarief.percentage
        const premie = Math.max(berekend, tarief.minimum)

        return {
            premie: Math.round(premie),
            minimumToegepast: berekend < tarief.minimum,
        }
    })