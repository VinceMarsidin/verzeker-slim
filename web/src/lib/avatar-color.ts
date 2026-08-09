const avatarKleuren = [
  'bg-[#fdf1e2] text-[#c77f2b]', // stamp-dark tint
  'bg-[#e9f6ef] text-[#2e9e63]', // trust tint
  'bg-[#eef4fb] text-[#1f6fb2]', // ink-adjacent blue
  'bg-[#f3ebfa] text-[#7a4fb0]',
  'bg-[#fbeaea] text-[#b04545]',
]

// Geeft een consistente kleur terug op basis van de eerste letter van een naam.
export function avatarKleur(naam: string) {
  const index = naam.charCodeAt(0) % avatarKleuren.length
  return avatarKleuren[index] ?? avatarKleuren[0]
}
