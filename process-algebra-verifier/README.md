# Process Algebra Verifier

A TypeScript implementation of process algebra verification tools supporting CCS, CSP, and ACP semantics.

## System Overview

```mermaid
graph TB
    subgraph Core[Core Components]
        LTS[LTS Core]
        Terms[Process Terms]
        SOS[SOS Engine]
    end

    subgraph Semantics[Semantic Models]
        CCS[CCS Model]
        CSP[CSP Model]
        ACP[ACP Model]
    end

    subgraph Verification[Verification Tools]
        Equiv[Equivalence Checker]
        POR[Partial Order Reduction]
        Symb[Symbolic State Space]
    end

    subgraph Analysis[Analysis Tools]
        Bench[Benchmarking]
        Test[Testing]
        Metrics[Metrics Collection]
    end

    Core --> Semantics
    Semantics --> Verification
    Verification --> Analysis
```

## Features

- Support for CCS, CSP, and ACP semantic models
- Multiple behavioral equivalence checking algorithms
- State space reduction techniques
- Symbolic state space representation
- Comprehensive testing and benchmarking tools

## Implementation Status

```mermaid
graph LR
    subgraph Complete[Completed]
        Core[Core LTS]
        Terms[Process Terms]
        SOS[SOS Engine]
        CCS[CCS Semantics]
        Bisim[Bisimulation]
        POR[Partial Order]
        Test[Testing]
    end

    subgraph Progress[In Progress]
        CSP[CSP Semantics]
        ACP[ACP Semantics]
        Failures[Failures Equiv]
        Testing[Testing Equiv]
        Symbolic[Symbolic State]
        Bench[Benchmarks]
    end

    Complete --> Progress
```

## Development

### Prerequisites

- Node.js >= 14
- TypeScript >= 4.5

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Benchmarks

```bash
npm run benchmark
```

## Documentation

Detailed documentation is available in the following files:

- [Theory and Semantic Models](docs/theory.md)
- [Architecture Details](docs/architecture.md)
- [Examples and Use Cases](docs/examples.md)
- [Implementation Guide](docs/index.md)

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
