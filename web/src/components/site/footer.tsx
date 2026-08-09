export function Footer() {
  const jaar = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <span>
          © {jaar} Verzeker<span className="text-orange-500 font-medium">Slim</span>. Alle rechten voorbehouden.
        </span>
        <span>info@verzekerslim.sr</span>
      </div>
    </footer>
  )
}
