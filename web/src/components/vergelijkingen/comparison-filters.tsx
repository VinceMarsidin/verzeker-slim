import type { ChangeEvent } from 'react'
import { Car, Plane, Home as HomeIcon, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { insuranceTypes, regions, type InsuranceType, type Region, type SortKey } from '@/lib/types/insurance'

const icons = {
  motor: Car,
  reis: Plane,
  woon: HomeIcon,
  leven: ShieldCheck,
} as const

interface ComparisonFiltersProps {
  type: InsuranceType
  region: Region
  sort: SortKey
  onTypeChange: (type: InsuranceType) => void
  onRegionChange: (region: Region) => void
  onSortChange: (sort: SortKey) => void
}

export function ComparisonFilters({
  type,
  region,
  sort,
  onTypeChange,
  onRegionChange,
  onSortChange,
}: ComparisonFiltersProps) {
  return (
    <Card className="border-line bg-paper-raised p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">Type verzekering</p>
          <Tabs value={type} onValueChange={(v) => onTypeChange(v as InsuranceType)}>
            <TabsList className="flex-wrap">
              {insuranceTypes.map(({ value, label }) => {
                const Icon = icons[value]
                return (
                  <TabsTrigger key={value} value={value}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-2 gap-4 md:w-[420px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Regio</label>
            <Select
              value={region}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onRegionChange(e.target.value as Region)
              }
            >
              {regions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.flag} {r.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">Sorteer op</label>
            <Select
              value={sort}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onSortChange(e.target.value as SortKey)
              }
            >
              <option value="price-asc">Laagste premie</option>
              <option value="price-desc">Hoogste premie</option>
              <option value="rating-desc">Beste beoordeling</option>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  )
}
