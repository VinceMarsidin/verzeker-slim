interface CompanyRowProps {
    name: string
    slug: string
    region: string
    logoInitial: string
    logoUrl: string | null
    website: string
}

export default function CompanyRow({
    name,
    slug,
    region,
    logoInitial,
    logoUrl,
    website,
}: CompanyRowProps) {
    return (
        <tr className="border-b border-line last:border-none">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt=""
                            className="h-9 w-9 rounded-[4px] border border-line object-contain bg-white p-1"
                        />
                    ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-line bg-paper-raised font-mono text-xs font-semibold text-stamp-dark">
                            {logoInitial}
                        </span>
                    )}
                    <div>
                        <div className="font-semibold text-ink">{name}</div>
                        <div className="text-xs text-ink-soft">{slug}</div>
                    </div>
                </div>
            </td>
            <td className="p-4 text-sm capitalize text-ink-soft">{region}</td>
            <td className="p-4 text-sm">
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stamp-dark hover:underline"
                >
                    {website.replace(/^https?:\/\//, '')}
                </a>
            </td>
        </tr>
    )
}
