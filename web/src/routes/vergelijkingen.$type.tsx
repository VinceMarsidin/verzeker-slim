import { createFileRoute, redirect } from '@tanstack/react-router'
import { insuranceTypeSchema } from '@/lib/validators/company.schema'

export const Route = createFileRoute('/vergelijkingen/$type')({
  beforeLoad: ({ params, search }) => {
    const parsed = insuranceTypeSchema.safeParse(params.type)
    if (!parsed.success) {
      throw redirect({ to: '/vergelijkingen' })
    }
    throw redirect({
      to: '/vergelijkingen',
      search: {
        type: parsed.data,
        region: (search as { region?: string }).region,
      },
    })
  },
})
