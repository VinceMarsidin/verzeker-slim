import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '#/components/site/navbar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
