import { Bond } from "./bond";

export class BondWeightChange {
    constructor(
        readonly bond: Bond,
        readonly previousWeight: number,
        readonly currentWeight: number,
    ) {}

    get delta(): number {
        return this.currentWeight - this.previousWeight;
    }
}

export class EtfCompareResult {
    constructor(
        readonly addedBonds: Bond[],
        readonly removedBonds: Bond[],
        readonly weightChanges: BondWeightChange[],
        readonly cashVariation: number,
    ) {}
}
