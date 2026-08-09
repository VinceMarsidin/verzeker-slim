import { createServerFn } from '@tanstack/react-start'
import {
    premieCalculatorSchema,
    type PremieCalculatorResult,
} from '@/lib/validators/premie.schema'


export const berekenPremie = createServerFn({ method: 'POST' })
    .validator(premieCalculatorSchema)
    .handler(async ({ data }): Promise<PremieCalculatorResult> => {
        switch (data.categorie) {
            case 'motor': {
                const basisPercentage = 0.025
                const minimum = 1500

                const typeFactor: Record<string, number> = {
                    auto: 1,
                    elektrische_auto: 0.95,
                    motorfiets: 1.2,
                    bromfiets: 0.6,
                    bus: 1.4,
                    pickup_truck: 1.25,
                    zwaar_materieel: 1.5,
                }
                const gebruikFactor: Record<string, number> = {
                    prive: 1,
                    taxi: 1.6,
                    verhuur: 1.5,
                    lease: 1.15,
                    rijles: 1.3,
                }
                const voertuigLeeftijd = new Date().getFullYear() - data.bouwjaar
                const ouderdomsFactor = 1 + Math.min(voertuigLeeftijd, 20) * 0.01

                const basispremie =
                    data.dagwaarde *
                    basisPercentage *
                    typeFactor[data.voertuigtype] *
                    gebruikFactor[data.gebruiksdoel] *
                    ouderdomsFactor

                const extraDekkingen =
                    (data.miniCasco ? 300 : 0) + (data.inzittendenverzekering ? 150 : 0)

                const totaal = basispremie + extraDekkingen

                const breakdown = [
                    { label: 'Basispremie (dagwaarde, type, leeftijd, gebruik)', bedrag: Math.round(basispremie) },
                ]
                if (data.miniCasco) breakdown.push({ label: 'Mini Casco', bedrag: 300 })
                if (data.inzittendenverzekering) {
                    breakdown.push({ label: 'Ongevallen inzittenden', bedrag: 150 })
                }

                return {
                    premie: Math.round(Math.max(totaal, minimum)),
                    minimumToegepast: totaal < minimum,
                    toelichting: `${(basisPercentage * 100).toFixed(1)}% van de dagwaarde, aangepast voor voertuigtype, leeftijd en gebruiksdoel${extraDekkingen > 0 ? ', plus gekozen extra dekkingen' : ''
                        }. Minimum SRD ${minimum.toLocaleString('nl-NL')}.`,
                    breakdown,
                }
            }

            case 'reis': {
                const perDag = 15
                const perPersoon = 10
                const minimum = 250
                const dagenDeel = data.aantalDagen * perDag
                const personenDeel = data.aantalPersonen * perPersoon
                const berekend = dagenDeel + personenDeel
                return {
                    premie: Math.round(Math.max(berekend, minimum)),
                    minimumToegepast: berekend < minimum,
                    toelichting: `SRD ${perDag} per dag + SRD ${perPersoon} per persoon, met een minimum van SRD ${minimum.toLocaleString('nl-NL')}.`,
                    breakdown: [
                        { label: `${data.aantalDagen} dagen × SRD ${perDag}`, bedrag: dagenDeel },
                        { label: `${data.aantalPersonen} personen × SRD ${perPersoon}`, bedrag: personenDeel },
                    ],
                }
            }

            case 'woon': {
                const perVierkanteMeter = 8
                const minimum = 500
                const berekend = data.vierkanteMeters * perVierkanteMeter
                return {
                    premie: Math.round(Math.max(berekend, minimum)),
                    minimumToegepast: berekend < minimum,
                    toelichting: `SRD ${perVierkanteMeter} per m², met een minimum van SRD ${minimum.toLocaleString('nl-NL')}.`,
                    breakdown: [
                        {
                            label: `${data.vierkanteMeters} m² × SRD ${perVierkanteMeter}`,
                            bedrag: Math.round(berekend),
                        },
                    ],
                }
            }

            case 'leven': {
                const minimum = 300
                const leeftijdsFactor = 1 + Math.max(0, data.leeftijd - 18) * 0.01
                const basisJaarlijks = (data.verzekerdBedrag * 0.004) / data.looptijdJaren
                const berekend = basisJaarlijks * leeftijdsFactor
                return {
                    premie: Math.round(Math.max(berekend, minimum)),
                    minimumToegepast: berekend < minimum,
                    toelichting: `Gebaseerd op verzekerd bedrag, leeftijd en looptijd, met een minimum van SRD ${minimum.toLocaleString('nl-NL')}.`,
                    breakdown: [
                        { label: 'Basisbedrag (verzekerd bedrag ÷ looptijd)', bedrag: Math.round(basisJaarlijks) },
                        {
                            label: `Leeftijdscorrectie (×${leeftijdsFactor.toFixed(2)})`,
                            bedrag: Math.round(berekend - basisJaarlijks),
                        },
                    ],
                }
            }
        }
    })