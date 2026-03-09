import React from "react";
import { EtfCompareResultItem } from "./model/EtfCompareResultItem";
import "./ComparisonBlock.css";

interface ComparisonBlockProps {
    labelA: string;
    labelB: string;
    item: EtfCompareResultItem;
}

export function ComparisonBlock({ labelA, labelB, item }: ComparisonBlockProps) {
    return (
        <div className="comparison-block">
            <h3 className="comparison-title">{labelA} → {labelB}</h3>

            <section className="comparison-section">
                <h4>Weight Changes</h4>
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Bond</th>
                            <th>{labelA}</th>
                            <th>{labelB}</th>
                            <th>Delta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.weightChanges.map((wc) => (
                            <tr key={wc.bondId}>
                                <td className="bond-id">{wc.bondId}</td>
                                <td>{wc.previousWeight}</td>
                                <td>{wc.currentWeight}</td>
                                <td className={wc.deltaClassName}>{wc.delta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {item.hasAddedBonds && (
                <section className="comparison-section">
                    <h4>Added Bonds</h4>
                    <div className="bond-tags">
                        {item.addedBonds.map((b) => (
                            <span key={b.id} className="tag tag-added">{b.label}</span>
                        ))}
                    </div>
                </section>
            )}

            {item.hasRemovedBonds && (
                <section className="comparison-section">
                    <h4>Removed Bonds</h4>
                    <div className="bond-tags">
                        {item.removedBonds.map((b) => (
                            <span key={b.id} className="tag tag-removed">{b.label}</span>
                        ))}
                    </div>
                </section>
            )}

            <section className="comparison-section cash-section">
                <h4>Cash Variation</h4>
                <span className={item.cashVariationClassName}>{item.cashVariation}</span>
            </section>
        </div>
    );
}
