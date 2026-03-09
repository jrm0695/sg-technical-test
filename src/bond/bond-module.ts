import { BondData } from "./data/bond-data";
import { BondUseCases } from "./domain/bond-use-cases";

const dataSource = new BondData.LocalFileDataSource();
const repository = new BondData.BondRepository(dataSource);
const bondUseCases = new BondUseCases(repository);

export { bondUseCases };
