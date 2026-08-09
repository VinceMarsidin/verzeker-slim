import type { InsuranceType, Quote, Region } from '@/lib/types/insurance'
import { getCompanyBySlug } from '@/lib/data/companies'

export const quoteData: Record<Region, Record<InsuranceType, Quote[]>> = {
  suriname: {
    motor: [
      { companySlug: 'assuria-suriname', insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 145, currency: 'SRD', deductible: 500, rating: 4.7, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'self-reliance', insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 132, currency: 'SRD', deductible: 450, rating: 4.5, coverage: ['WA', 'Diefstal'], badge: 'beste prijs' },
      { companySlug: 'fatum-suriname', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 158, currency: 'SRD', deductible: 400, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'parsasco', insurer: 'Parsasco', logoInitial: 'P', monthlyPremium: 149, currency: 'SRD', deductible: 500, rating: 4.3, coverage: ['WA', 'Brand'] },
    ],
    reis: [
      { companySlug: 'fatum-suriname', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 38, currency: 'SRD', deductible: 50, rating: 4.6, coverage: ['Medische kosten', 'Bagage'], badge: 'populair' },
      { companySlug: 'assuria-suriname', insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 34, currency: 'SRD', deductible: 50, rating: 4.5, coverage: ['Medische kosten'], badge: 'beste prijs' },
      { companySlug: 'self-reliance', insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 42, currency: 'SRD', deductible: 40, rating: 4.4, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
    ],
    woon: [
      { companySlug: 'assuria-suriname', insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 65, currency: 'SRD', deductible: 250, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'fatum-suriname', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 72, currency: 'SRD', deductible: 200, rating: 4.7, coverage: ['Brand', 'Storm', 'Inbraak', 'Waterschade'], badge: 'beste dekking' },
      { companySlug: 'parsasco', insurer: 'Parsasco', logoInitial: 'P', monthlyPremium: 58, currency: 'SRD', deductible: 300, rating: 4.2, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { companySlug: 'fatum-suriname', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 95, currency: 'SRD', deductible: 0, rating: 4.8, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'assuria-suriname', insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 88, currency: 'SRD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'self-reliance', insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 99, currency: 'SRD', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico', 'Arbeidsongeschiktheid'], badge: 'populair' },
    ],
  },
  aruba: {
    motor: [
      { companySlug: 'ennia-aruba', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 62, currency: 'AWG', deductible: 250, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'nagico-aruba', insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 58, currency: 'AWG', deductible: 200, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'guardian-group-aruba', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 68, currency: 'AWG', deductible: 150, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'pan-american-life-aruba', insurer: 'Pan-American Life', logoInitial: 'P', monthlyPremium: 64, currency: 'AWG', deductible: 220, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'] },
      { companySlug: 'bsure-aruba', insurer: 'Bsure', logoInitial: 'B', monthlyPremium: 59, currency: 'AWG', deductible: 180, rating: 4.2, coverage: ['WA', 'Brand'] },
      { companySlug: 'sagicor-life-aruba', insurer: 'Sagicor Life', logoInitial: 'S', monthlyPremium: 66, currency: 'AWG', deductible: 200, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'] },
    ],
    reis: [
      { companySlug: 'nagico-aruba', insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 18, currency: 'AWG', deductible: 25, rating: 4.4, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'ennia-aruba', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 21, currency: 'AWG', deductible: 20, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'bsure-aruba', insurer: 'Bsure', logoInitial: 'B', monthlyPremium: 19, currency: 'AWG', deductible: 22, rating: 4.3, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'guardian-group-aruba', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 34, currency: 'AWG', deductible: 100, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'ennia-aruba', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 31, currency: 'AWG', deductible: 120, rating: 4.4, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
      { companySlug: 'pan-american-life-aruba', insurer: 'Pan-American Life', logoInitial: 'P', monthlyPremium: 36, currency: 'AWG', deductible: 90, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
    ],
    leven: [
      { companySlug: 'guardian-group-aruba', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 48, currency: 'AWG', deductible: 0, rating: 4.7, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'ennia-aruba', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 44, currency: 'AWG', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'sagicor-life-aruba', insurer: 'Sagicor Life', logoInitial: 'S', monthlyPremium: 46, currency: 'AWG', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Sparen'], badge: 'populair' },
    ],
  },
  curacao: {
    motor: [
      { companySlug: 'ennia-curacao', insurer: 'Ennia Insurance', logoInitial: 'E', monthlyPremium: 60, currency: 'ANG', deductible: 250, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'guardian-group-fatum-curacao', insurer: 'Guardian Group Fatum', logoInitial: 'G', monthlyPremium: 65, currency: 'ANG', deductible: 200, rating: 4.6, coverage: ['WA', 'Diefstal', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'nagico-curacao', insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 57, currency: 'ANG', deductible: 300, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'fatum-curacao', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 62, currency: 'ANG', deductible: 220, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'] },
      { companySlug: 'guardian-group-curacao', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 63, currency: 'ANG', deductible: 210, rating: 4.5, coverage: ['WA', 'Brand', 'Cascoschade'] },
    ],
    reis: [
      { companySlug: 'fatum-curacao', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 17, currency: 'ANG', deductible: 25, rating: 4.5, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'ennia-curacao', insurer: 'Ennia Insurance', logoInitial: 'E', monthlyPremium: 20, currency: 'ANG', deductible: 20, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'nagico-curacao', insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 18, currency: 'ANG', deductible: 22, rating: 4.4, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'fatum-curacao', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 33, currency: 'ANG', deductible: 150, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
      { companySlug: 'guardian-group-curacao', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 29, currency: 'ANG', deductible: 180, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
      { companySlug: 'guardian-group-fatum-curacao', insurer: 'Guardian Group Fatum', logoInitial: 'G', monthlyPremium: 32, currency: 'ANG', deductible: 160, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
    ],
    leven: [
      { companySlug: 'ennia-curacao', insurer: 'Ennia Insurance', logoInitial: 'E', monthlyPremium: 46, currency: 'ANG', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'fatum-curacao', insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 42, currency: 'ANG', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'guardian-group-fatum-curacao', insurer: 'Guardian Group Fatum', logoInitial: 'G', monthlyPremium: 44, currency: 'ANG', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'populair' },
    ],
  },
  bonaire: {
    motor: [
      { companySlug: 'ennia-bonaire', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 55, currency: 'USD', deductible: 200, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'guardian-group-bonaire', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 59, currency: 'USD', deductible: 150, rating: 4.5, coverage: ['WA', 'Diefstal', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'boogaard-insurance', insurer: 'Boogaard Insurance', logoInitial: 'B', monthlyPremium: 52, currency: 'USD', deductible: 180, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'bsure-bonaire', insurer: 'Bsure Bonaire', logoInitial: 'B', monthlyPremium: 54, currency: 'USD', deductible: 170, rating: 4.2, coverage: ['WA', 'Diefstal'] },
      { companySlug: 'mcb-insurance-services', insurer: 'MCB Insurance Services', logoInitial: 'M', monthlyPremium: 57, currency: 'USD', deductible: 160, rating: 4.4, coverage: ['WA', 'Brand', 'Cascoschade'] },
    ],
    reis: [
      { companySlug: 'ennia-bonaire', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 19, currency: 'USD', deductible: 25, rating: 4.5, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'boogaard-insurance', insurer: 'Boogaard Insurance', logoInitial: 'B', monthlyPremium: 21, currency: 'USD', deductible: 20, rating: 4.4, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'bsure-bonaire', insurer: 'Bsure Bonaire', logoInitial: 'B', monthlyPremium: 20, currency: 'USD', deductible: 22, rating: 4.3, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'guardian-group-bonaire', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 27, currency: 'USD', deductible: 150, rating: 4.4, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'boogaard-insurance', insurer: 'Boogaard Insurance', logoInitial: 'B', monthlyPremium: 25, currency: 'USD', deductible: 160, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
      { companySlug: 'mcb-insurance-services', insurer: 'MCB Insurance Services', logoInitial: 'M', monthlyPremium: 28, currency: 'USD', deductible: 140, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
    ],
    leven: [
      { companySlug: 'ennia-bonaire', insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 40, currency: 'USD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'bsure-bonaire', insurer: 'Bsure Bonaire', logoInitial: 'B', monthlyPremium: 43, currency: 'USD', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'mcb-insurance-services', insurer: 'MCB Insurance Services', logoInitial: 'M', monthlyPremium: 41, currency: 'USD', deductible: 0, rating: 4.3, coverage: ['Overlijdensrisico'], badge: 'populair' },
    ],
  },
  trinidad: {
    motor: [
      { companySlug: 'guardian-group-trinidad', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 410, currency: 'TTD', deductible: 1500, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'sagicor-trinidad', insurer: 'Sagicor Trinidad', logoInitial: 'S', monthlyPremium: 385, currency: 'TTD', deductible: 1200, rating: 4.4, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'nagico-trinidad', insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 430, currency: 'TTD', deductible: 1000, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'gulf-insurance-trinidad', insurer: 'Gulf Insurance Limited', logoInitial: 'G', monthlyPremium: 395, currency: 'TTD', deductible: 1300, rating: 4.3, coverage: ['WA', 'Diefstal'] },
      { companySlug: 'maritime-financial-group', insurer: 'Maritime Financial Group', logoInitial: 'M', monthlyPremium: 420, currency: 'TTD', deductible: 1100, rating: 4.5, coverage: ['WA', 'Brand', 'Cascoschade'] },
    ],
    reis: [
      { companySlug: 'sagicor-trinidad', insurer: 'Sagicor Trinidad', logoInitial: 'S', monthlyPremium: 120, currency: 'TTD', deductible: 150, rating: 4.4, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'guardian-group-trinidad', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 135, currency: 'TTD', deductible: 100, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'gulf-insurance-trinidad', insurer: 'Gulf Insurance Limited', logoInitial: 'G', monthlyPremium: 125, currency: 'TTD', deductible: 120, rating: 4.3, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'sagicor-trinidad', insurer: 'Sagicor Trinidad', logoInitial: 'S', monthlyPremium: 210, currency: 'TTD', deductible: 800, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'gulf-insurance-trinidad', insurer: 'Gulf Insurance Limited', logoInitial: 'G', monthlyPremium: 198, currency: 'TTD', deductible: 850, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
      { companySlug: 'maritime-financial-group', insurer: 'Maritime Financial Group', logoInitial: 'M', monthlyPremium: 220, currency: 'TTD', deductible: 750, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
    ],
    leven: [
      { companySlug: 'sagicor-trinidad', insurer: 'Sagicor Trinidad', logoInitial: 'S', monthlyPremium: 260, currency: 'TTD', deductible: 0, rating: 4.7, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'guardian-group-trinidad', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 245, currency: 'TTD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'maritime-financial-group', insurer: 'Maritime Financial Group', logoInitial: 'M', monthlyPremium: 255, currency: 'TTD', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Sparen'], badge: 'populair' },
    ],
  },
  jamaica: {
    motor: [
      { companySlug: 'sagicor-jamaica', insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 9500, currency: 'JMD', deductible: 25000, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'guardian-group-jamaica', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 10200, currency: 'JMD', deductible: 20000, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
      { companySlug: 'advantage-general-jamaica', insurer: 'Advantage General', logoInitial: 'A', monthlyPremium: 9200, currency: 'JMD', deductible: 22000, rating: 4.5, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'british-caribbean-insurance', insurer: 'British Caribbean Insurance', logoInitial: 'B', monthlyPremium: 9800, currency: 'JMD', deductible: 23000, rating: 4.3, coverage: ['WA', 'Diefstal'] },
      { companySlug: 'jn-general-insurance', insurer: 'JN General Insurance', logoInitial: 'J', monthlyPremium: 9600, currency: 'JMD', deductible: 24000, rating: 4.4, coverage: ['WA', 'Brand', 'Cascoschade'] },
    ],
    reis: [
      { companySlug: 'sagicor-jamaica', insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 2800, currency: 'JMD', deductible: 3000, rating: 4.3, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'advantage-general-jamaica', insurer: 'Advantage General', logoInitial: 'A', monthlyPremium: 3100, currency: 'JMD', deductible: 2500, rating: 4.5, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'jn-general-insurance', insurer: 'JN General Insurance', logoInitial: 'J', monthlyPremium: 2900, currency: 'JMD', deductible: 2800, rating: 4.4, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'guardian-group-jamaica', insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 4900, currency: 'JMD', deductible: 15000, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'british-caribbean-insurance', insurer: 'British Caribbean Insurance', logoInitial: 'B', monthlyPremium: 4600, currency: 'JMD', deductible: 16000, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
      { companySlug: 'advantage-general-jamaica', insurer: 'Advantage General', logoInitial: 'A', monthlyPremium: 5100, currency: 'JMD', deductible: 14000, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
    ],
    leven: [
      { companySlug: 'sagicor-jamaica', insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 6200, currency: 'JMD', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'jn-general-insurance', insurer: 'JN General Insurance', logoInitial: 'J', monthlyPremium: 5900, currency: 'JMD', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'advantage-general-jamaica', insurer: 'Advantage General', logoInitial: 'A', monthlyPremium: 6100, currency: 'JMD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico', 'Sparen'], badge: 'populair' },
    ],
  },
  guyana: {
    motor: [
      { companySlug: 'assuria-guyana', insurer: 'Assuria Guyana', logoInitial: 'A', monthlyPremium: 18500, currency: 'GYD', deductible: 50000, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'cg-united-insurance', insurer: 'CG United Insurance', logoInitial: 'C', monthlyPremium: 17200, currency: 'GYD', deductible: 45000, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'hand-in-hand-guyana', insurer: 'Hand in Hand Mutual', logoInitial: 'H', monthlyPremium: 19800, currency: 'GYD', deductible: 40000, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { companySlug: 'cg-united-insurance', insurer: 'CG United Insurance', logoInitial: 'C', monthlyPremium: 4500, currency: 'GYD', deductible: 5000, rating: 4.3, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'assuria-guyana', insurer: 'Assuria Guyana', logoInitial: 'A', monthlyPremium: 5200, currency: 'GYD', deductible: 4000, rating: 4.5, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'hand-in-hand-guyana', insurer: 'Hand in Hand Mutual', logoInitial: 'H', monthlyPremium: 4800, currency: 'GYD', deductible: 4500, rating: 4.4, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'hand-in-hand-guyana', insurer: 'Hand in Hand Mutual', logoInitial: 'H', monthlyPremium: 8200, currency: 'GYD', deductible: 25000, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
      { companySlug: 'assuria-guyana', insurer: 'Assuria Guyana', logoInitial: 'A', monthlyPremium: 7800, currency: 'GYD', deductible: 28000, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'cg-united-insurance', insurer: 'CG United Insurance', logoInitial: 'C', monthlyPremium: 7400, currency: 'GYD', deductible: 30000, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { companySlug: 'assuria-guyana', insurer: 'Assuria Guyana', logoInitial: 'A', monthlyPremium: 11000, currency: 'GYD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'cg-united-insurance', insurer: 'CG United Insurance', logoInitial: 'C', monthlyPremium: 10200, currency: 'GYD', deductible: 0, rating: 4.3, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'hand-in-hand-guyana', insurer: 'Hand in Hand Mutual', logoInitial: 'H', monthlyPremium: 10800, currency: 'GYD', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Sparen'], badge: 'populair' },
    ],
  },
  'french-guiana': {
    motor: [
      { companySlug: 'groupama-antilles-guyane', insurer: 'Groupama Antilles-Guyane', logoInitial: 'G', monthlyPremium: 72, currency: 'EUR', deductible: 300, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { companySlug: 'allianz-guyane', insurer: 'Allianz Guyane', logoInitial: 'A', monthlyPremium: 68, currency: 'EUR', deductible: 280, rating: 4.4, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { companySlug: 'gmf-assurances', insurer: 'GMF Assurances', logoInitial: 'G', monthlyPremium: 78, currency: 'EUR', deductible: 250, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { companySlug: 'allianz-guyane', insurer: 'Allianz Guyane', logoInitial: 'A', monthlyPremium: 22, currency: 'EUR', deductible: 30, rating: 4.4, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { companySlug: 'groupama-antilles-guyane', insurer: 'Groupama Antilles-Guyane', logoInitial: 'G', monthlyPremium: 25, currency: 'EUR', deductible: 25, rating: 4.5, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
      { companySlug: 'gmf-assurances', insurer: 'GMF Assurances', logoInitial: 'G', monthlyPremium: 23, currency: 'EUR', deductible: 28, rating: 4.3, coverage: ['Medische kosten', 'Bagage'] },
    ],
    woon: [
      { companySlug: 'gmf-assurances', insurer: 'GMF Assurances', logoInitial: 'G', monthlyPremium: 38, currency: 'EUR', deductible: 150, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
      { companySlug: 'groupama-antilles-guyane', insurer: 'Groupama Antilles-Guyane', logoInitial: 'G', monthlyPremium: 35, currency: 'EUR', deductible: 180, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { companySlug: 'allianz-guyane', insurer: 'Allianz Guyane', logoInitial: 'A', monthlyPremium: 32, currency: 'EUR', deductible: 200, rating: 4.4, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { companySlug: 'groupama-antilles-guyane', insurer: 'Groupama Antilles-Guyane', logoInitial: 'G', monthlyPremium: 52, currency: 'EUR', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { companySlug: 'allianz-guyane', insurer: 'Allianz Guyane', logoInitial: 'A', monthlyPremium: 48, currency: 'EUR', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { companySlug: 'gmf-assurances', insurer: 'GMF Assurances', logoInitial: 'G', monthlyPremium: 50, currency: 'EUR', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Sparen'], badge: 'populair' },
    ],
  },
}

export function getQuotes(region: Region, type: InsuranceType): Quote[] {
  return (quoteData[region]?.[type] ?? []).filter((quote) =>
    Boolean(getCompanyBySlug(quote.companySlug)),
  )
}

export function getQuotesForCompany(companySlug: string): Quote[] {
  const results: Quote[] = []
  for (const regionData of Object.values(quoteData)) {
    for (const [type, typeQuotes] of Object.entries(regionData)) {
      for (const quote of typeQuotes) {
        if (quote.companySlug === companySlug && getCompanyBySlug(quote.companySlug)) {
          results.push({ ...quote, insuranceType: type as InsuranceType })
        }
      }
    }
  }
  return results
}
