import React, { useEffect, useState } from "react";
import { bondUseCases } from "./bond/bond-module";
import { Etf } from "./bond/domain/model/etf";
import { ComparisonBlock } from "./bond/presentation/ComparisonBlock";
import { EtfCompareResultItem } from "./bond/presentation/model/EtfCompareResultItem";
import { EtfCompositionTable } from "./bond/presentation/EtfCompositionTable";
import "./App.css";

interface DatedEtf {
    date: Date;
    etf: Etf;
}

const DATES = [
    new Date("2025-05-08"),
    new Date("2025-05-09"),
];

function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export default function App() {
    const [datedEtfs, setDatedEtfs] = useState<DatedEtf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [expandedDate, setExpandedDate] = useState<string | undefined>(undefined);

    useEffect(() => {
        Promise.all(DATES.map((date) =>
            bondUseCases.getEtf(date).then((etf) => ({ date, etf })),
        ))
            .then(setDatedEtfs)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="app">
            <h1>ETF Bond Dashboard</h1>

            <h2>Summary</h2>
            <table className="summary-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Price (€)</th>
                        <th>Cash (€)</th>
                        <th>Bonds</th>
                    </tr>
                </thead>
                <tbody>
                    {datedEtfs.map(({ date, etf }) => {
                        const key = formatDate(date);
                        const isExpanded = expandedDate === key;
                        return (
                            <React.Fragment key={key}>
                                <tr
                                    className="summary-row"
                                    onClick={() => setExpandedDate(isExpanded ? undefined : key)}
                                >
                                    <td>
                                        <span className="expand-icon">{isExpanded ? "▾" : "▸"}</span>
                                        {key}
                                    </td>
                                    <td>{etf.price.toFixed(4)}</td>
                                    <td>{etf.cash}</td>
                                    <td>{etf.bonds.length}</td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={4} className="composition-cell">
                                            <EtfCompositionTable etf={etf} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <h2>Comparisons</h2>
            {datedEtfs.slice(0, -1).map((current, i) => {
                const next = datedEtfs[i + 1];
                const item = EtfCompareResultItem.fromEntity(current.etf.compareWith(next.etf));
                return (
                    <ComparisonBlock
                        key={formatDate(current.date)}
                        labelA={formatDate(current.date)}
                        labelB={formatDate(next.date)}
                        item={item}
                    />
                );
            })}
        </div>
    );
}
