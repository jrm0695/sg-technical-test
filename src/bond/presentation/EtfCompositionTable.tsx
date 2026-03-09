import React from "react";
import { Etf } from "../domain/model/etf";

interface EtfCompositionTableProps {
    etf: Etf;
}

export function EtfCompositionTable({ etf }: EtfCompositionTableProps) {
    return (
        <table className="composition-table">
            <thead>
                <tr>
                    <th>Bond ID</th>
                    <th>Price (€)</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody>
                {etf.bonds.map((bond, i) => (
                    <tr key={bond.id}>
                        <td className="bond-id">{bond.id}</td>
                        <td>{bond.price.toFixed(2)}</td>
                        <td>{etf.weights[i].toFixed(4)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
