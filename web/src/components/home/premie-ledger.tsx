// src/components/home/premie-ledger.tsx
import { useEffect, useState } from "react";

type LedgerRow = {
    insurer: string;
    amount: number;
    best?: boolean;
};

const demoRows: LedgerRow[] = [
    { insurer: "Assuria", amount: 4180 },
    { insurer: "Self-Reliance", amount: 3640, best: true },
    { insurer: "Fatum", amount: 4510 },
];

function formatSrd(amount: number) {
    return `SRD ${amount.toLocaleString("nl-NL")}`;
}

/**
 * Hero signature element: een "ledger"-kaart met een voorbeeld-premievergelijking,
 * met een stempel die inanimeert op de laagste premie.
 * Vervang `demoRows` later door een live query (bijv. useQuery op /api/vergelijking/motor)
 * zodra echte verzekeraarsdata is aangesloten.
 */
export function PremieLedger() {
    const [showStamp, setShowStamp] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowStamp(true), 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative rounded-[4px] border border-line bg-paper-raised p-7 shadow-[0_1px_0_var(--line)]">
            <div className="mb-3.5 flex items-baseline justify-between border-b border-dashed border-line pb-3.5">
                <h3 className="font-slab text-base font-bold text-ink">
                    Autoverzekering &middot; Casco
                </h3>
                <span className="font-mono text-xs text-ink-soft">Toyota Corolla 2019</span>
            </div>

            {demoRows.map((row) => (
                <div
                    key={row.insurer}
                    className="relative flex items-center justify-between border-b border-line py-3 text-sm last:border-none"
                >
                    <span className="font-semibold text-ink">{row.insurer}</span>
                    <span
                        className={`font-mono text-[15px] ${row.best ? "font-semibold text-trust" : "text-ink"
                            }`}
                    >
                        {formatSrd(row.amount)}
                    </span>

                    {row.best && (
                        <div
                            className={`absolute -right-1.5 -top-3.5 flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-trust bg-trust/5 text-center font-mono text-[10px] font-semibold leading-tight tracking-wide text-trust transition-all duration-500 ${showStamp
                                    ? "rotate-[-14deg] scale-100"
                                    : "rotate-[-14deg] scale-0"
                                }`}
                            style={{ transitionTimingFunction: "cubic-bezier(.2,.9,.3,1.3)" }}
                        >
                            BESTE
                            <br />
                            PREMIE
                        </div>
                    )}
                </div>
            ))}

            <p className="mt-3.5 text-[11px] text-ink-soft">
                Voorbeelddata ter illustratie &mdash; echte premies verschijnen na het
                invullen van je gegevens.
            </p>
        </div>
    );
}