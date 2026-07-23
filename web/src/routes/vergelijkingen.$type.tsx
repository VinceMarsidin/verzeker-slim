import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vergelijkingen/$type')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vergelijkingen/$type"!</div>
}
