import { Bond } from "../domain/model/bond";
import { Etf } from "../domain/model/etf";
import { BondRepositoryInterface } from "../domain/bond-use-cases";
import { BondLocalFileDto } from "./model/bond-local-file-dto";
import { EtfLocalFileDto } from "./model/etf-local-file-dto";
import { delay } from "../../utils";

export namespace BondData {
    export interface DataSourceInterface {
        getBonds(): Promise<BondLocalFileDto[]>;
        getEtf(at: Date): Promise<EtfLocalFileDto>;
    }

    export class LocalFileDataSource implements DataSourceInterface {
        async getBonds(): Promise<BondLocalFileDto[]> {
            await delay(500); // simulates remote call to debug the loading state of the app
            const response = await fetch("/assets/bond-data.json");
            const raw = await response.json();
            return (raw as any[]).map(BondLocalFileDto.fromObject);
        }

        async getEtf(at: Date): Promise<EtfLocalFileDto> {
            await delay(500);
            const dateStr = at.toISOString().slice(0, 10);
            const response = await fetch(`/assets/etf-${dateStr}.json`);
            const raw = await response.json();
            return EtfLocalFileDto.fromObject(raw);
        }
    }

    export class BondRepository implements BondRepositoryInterface {
        constructor(private readonly dataSource: DataSourceInterface) {}

        async getEtf(at: Date): Promise<Etf> {
            const [etfDto, bondDtos] = await Promise.all([
                this.dataSource.getEtf(at),
                this.dataSource.getBonds(),
            ]);
            const bondMap = new Map(bondDtos.map((dto) => [dto.id, dto.toEntity()]));
            const bonds: Bond[] = [];
            const weights: number[] = [];
            for (const entry of etfDto.bonds) {
                const bond = bondMap.get(entry.bondId);
                if (!bond) {
                    throw new Error(`Bond '${entry.bondId}' not found in bond-data`);
                }
                bonds.push(bond);
                weights.push(entry.weight);
            }
            return new Etf(bonds, weights, etfDto.cash);
        }
    }
}

