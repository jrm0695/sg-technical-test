import { Bond } from "../../domain/model/bond";
import { requireString, requireNumber } from "../../../utils";

export class BondLocalFileDto {
    constructor(
        readonly id: string,
        readonly price: number,
    ) {}

    static fromObject(raw: any): BondLocalFileDto {
        return new BondLocalFileDto(
            requireString(raw, "id", "BondLocalFileDto"),
            requireNumber(raw, "price", "BondLocalFileDto"),
        );
    }

    toEntity(): Bond {
        return new Bond(this.id, this.price);
    }
}