const avatarKleuren = [
  'bg-blue-100 text-blue-700',
  'bg-orange-100 text-orange-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
]

// Geeft een consistente kleur terug op basis van de eerste letter van een naam,
// zodat dezelfde naam altijd dezelfde avatar-kleur krijgt.
export function avatarKleur(naam: string) {
  const index = naam.charCodeAt(0) % avatarKleuren.length
  return avatarKleuren[index] ?? avatarKleuren[0]
}
