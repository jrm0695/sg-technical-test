# SocGen Bond ETF Project

## Getting started

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

## Architecture

This project follows Clean Architecture, applied to a React frontend. Each module (here `bond/`) is split into three layers: **data**, **domain**, and **presentation**. Each layer has its own model classes that never leak into another layer.

### Data layer (`data/`)

The data layer is responsible for retrieving raw data. It contains:

- **DTOs** (`data/model/`): raw classes that mirror the shape of a data source (e.g. `BondLocalFileDto`, `EtfLocalFileDto`). A DTO knows how to parse itself from a raw object (`fromObject`) and convert itself to an entity (`toEntity`).
- **DataSources**: each datasource implementation fetches from a single source (here `LocalFileDataSource` reads JSON files) and returns DTOs. It does not know about entities.
- **Repositories**: the repository wires one or several datasources together. It calls datasources, receives DTOs, and assembles them into domain entities. For example, `BondRepository.getEtf()` fetches the ETF composition and the bond list from two separate datasource calls, then combines them into a single `Etf` entity.

### Domain layer (`domain/`)

The domain layer holds pure business logic. It contains:

- **Entities** (`domain/model/`): business classes like `Bond`, `Etf`, `EtfCompareResult`. They carry business rules (e.g. `Etf.price` computes the scalar product, `Etf.compareWith()` produces a comparison). Entities have no dependency on the data layer or the presentation layer.
- **Use cases** (`domain/bond-use-cases.ts`): orchestrate business operations by calling repository interfaces. In this project the use case is mostly a passthrough because there is no complex business logic that requires coordinating multiple repositories. If there were (e.g. combining data from different modules), the use case would be the place for it.
- **Repository interfaces**: defined in the domain layer so that the domain never depends on data implementations. The data layer provides concrete implementations.

### Presentation layer (`presentation/`)

The presentation layer is the React UI. It contains:

- **Items** (`presentation/model/`): formatting classes like `EtfCompareResultItem`. An Item has a static `fromEntity()` that takes a domain entity and returns pre-formatted values (strings, CSS class names) ready to be plugged directly into a component. All formatting logic (number formatting, sign prefixes, color decisions) lives here, never in the component.
- **Components** (`presentation/`): React components that only wire Item properties into JSX. They contain zero formatting logic and zero business logic.

The presentation layer only calls use cases. It never imports repositories or datasources.

### Summary

```
JSON files → DataSource (DTOs) → Repository (Entities) → UseCase → Component (via Items)
```

Each arrow is a boundary where the model class changes: DTOs in data, entities in domain, items in presentation.
