import CompanyTable from '#/components/companies/company-table'
import { createFileRoute } from '@tanstack/react-router'

import { requireAdminBeforeLoad } from '#/lib/require-admin-route'

export const Route = createFileRoute('/admin/coompanies')({
  beforeLoad: requireAdminBeforeLoad,
  component: RouteComponent,
})

function RouteComponent() {
  return <CompanyTable />
}