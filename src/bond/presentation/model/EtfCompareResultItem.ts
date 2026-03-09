import { EtfCompareResult } from "../../domain/model/etf-compare-result";

export interface WeightChangeRow {
    bondId: string;
    previousWeight: string;
    currentWeight: string;
    delta: string;
    deltaClassName: string;
}

export interface BondTag {
    id: string;
    label: string;
}

export class EtfCompareResultItem {
    constructor(
        readonly weightChanges: WeightChangeRow[],
        readonly addedBonds: BondTag[],
        readonly removedBonds: BondTag[],
        readonly cashVariation: string,
        readonly cashVariationClassName: string,
        readonly hasAddedBonds: boolean,
        readonly hasRemovedBonds: boolean,
    ) {}

    static fromEntity(result: EtfCompareResult): EtfCompareResultItem {
        const weightChanges = result.weightChanges.map((wc) => ({
            bondId: wc.bond.id,
            previousWeight: wc.previousWeight.toFixed(4),
            currentWeight: wc.currentWeight.toFixed(4),
            delta: (wc.delta >= 0 ? "+" : "") + wc.delta.toFixed(4),
            deltaClassName: wc.delta >= 0 ? "positive" : "negative",
        }));

        const addedBonds = result.addedBonds.map((b) => ({
            id: b.id,
            label: `${b.id} — ${b.price} €`,
        }));

        const removedBonds = result.removedBonds.map((b) => ({
            id: b.id,
            label: `${b.id} — ${b.price} €`,
        }));

        const cashVariation = (result.cashVariation >= 0 ? "+" : "") + result.cashVariation.toFixed(2) + " €";
        const cashVariationClassName = result.cashVariation >= 0 ? "positive" : "negative";

        return new EtfCompareResultItem(
            weightChanges,
            addedBonds,
            removedBonds,
            cashVariation,
            cashVariationClassName,
            addedBonds.length > 0,
            removedBonds.length > 0,
        );
    }
}
