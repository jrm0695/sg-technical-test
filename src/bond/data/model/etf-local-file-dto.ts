import { requireNumber, requireString } from "../../../utils";

export class EtfBondEntryDto {
    constructor(
        readonly bondId: string,
        readonly weight: number,
    ) {}

    static fromObject(raw: any): EtfBondEntryDto {
        return new EtfBondEntryDto(
            requireString(raw, "bondId", "EtfBondEntryDto"),
            requireNumber(raw, "weight", "EtfBondEntryDto"),
        );
    }
}

export class EtfLocalFileDto {
    constructor(
        readonly cash: number,
        readonly bonds: EtfBondEntryDto[],
    ) {}

    static fromObject(raw: any): EtfLocalFileDto {
        if (!Array.isArray(raw.bonds)) {
            throw new Error("EtfLocalFileDto: missing or invalid 'bonds' (expected array)");
        }
        return new EtfLocalFileDto(
            requireNumber(raw, "cash", "EtfLocalFileDto"),
            raw.bonds.map(EtfBondEntryDto.fromObject),
        );
    }
}
