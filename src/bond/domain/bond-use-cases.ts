import { Etf } from "./model/etf";

export interface BondRepositoryInterface {
    getEtf(at: Date): Promise<Etf>;
}

export class BondUseCases {
    constructor(private readonly bondRepository: BondRepositoryInterface) {}

    getEtf(at: Date): Promise<Etf> {
        return this.bondRepository.getEtf(at);
    }
}
