import CompanyTable from '#/components/companies/company-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <CompanyTable/>
}
