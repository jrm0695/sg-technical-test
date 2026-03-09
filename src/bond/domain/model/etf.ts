import { Bond } from "./bond";
import { BondWeightChange, EtfCompareResult } from "./etf-compare-result";

export class Etf {
    constructor(
        readonly bonds: Bond[],
        readonly weights: number[],
        readonly cash: number,
    ) {}

    get price(): number {
        return this.bonds.reduce(
            (sum, bond, i) => sum + bond.price * this.weights[i],
            0,
        ) + this.cash;
    }

    getWeightOf(isin: string): number {
        const index = this.bonds.findIndex((bond) => bond.id === isin);
        if (index === -1) {
            throw new Error(`Bond '${isin}' not found in ETF`);
        }
        return this.weights[index];
    }

    getPriceOf(isin: string): number {
        const index = this.bonds.findIndex((bond) => bond.id === isin);
        if (index === -1) {
            throw new Error(`Bond '${isin}' not found in ETF`);
        }
        return this.bonds[index].price;
    }

    compareWith(rhs: Etf): EtfCompareResult {
        const thisIds = new Set(this.bonds.map((b) => b.id));
        const rhsIds = new Set(rhs.bonds.map((b) => b.id));

        const removedBonds = this.bonds.filter((b) => !rhsIds.has(b.id));
        const addedBonds = rhs.bonds.filter((b) => !thisIds.has(b.id));

        const weightChanges: BondWeightChange[] = this.bonds
            .filter((b) => rhsIds.has(b.id)) // takes intersec between this and new ETF
            .map((b) => new BondWeightChange(
                b,
                this.getWeightOf(b.id),
                rhs.getWeightOf(b.id),
            ));

        const cashVariation = rhs.cash - this.cash;

        return new EtfCompareResult(addedBonds, removedBonds, weightChanges, cashVariation);
    }
}
