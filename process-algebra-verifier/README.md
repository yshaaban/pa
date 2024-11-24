# Process Algebra Verifier

A TypeScript implementation of process algebra verification tools supporting CCS, CSP, and ACP semantics.

## Architecture

```mermaid
graph TB
    subgraph Core
        LTS[LTS Core]
        Terms[Process Terms]
        SOS[SOS Engine]
    end

    subgraph Semantics
        CCS[CCS Model]
        CSP[CSP Model]
        ACP[ACP Model]
    end

    subgraph Verification
        Equiv[Equivalence Checker]
        POR[Partial Order Reduction]
        Symb[Symbolic State Space]
    end

    subgraph Analysis
        Bench[Benchmarking]
        Test[Testing]
        Metrics[Metrics Collection]
    end

    Core --> Semantics
    Semantics --> Verification
    Verification --> Analysis
```

## Process Algebra Concepts

```mermaid
graph LR
    subgraph Foundations
        LTS[Labelled Transition System]
        Terms[Process Terms]
        Actions[Actions]
    end

    subgraph Operators
        Prefix[Prefix]
        Choice[Choice]
        Parallel[Parallel Composition]
        Hide[Hiding]
        Restrict[Restriction]
    end

    subgraph Semantics
        SOS[Structural Operational Semantics]
        Bisim[Bisimulation]
        Trace[Traces]
        Fail[Failures]
    end

    Terms --> Operators
    Actions --> LTS
    Terms --> LTS
    LTS --> Semantics
```

## Verification Pipeline

```mermaid
graph LR
    subgraph Input
        Spec[Specification]
        Impl[Implementation]
    end

    subgraph Processing
        Parse[Parser]
        Build[LTS Builder]
        Reduce[State Space Reduction]
        Check[Equivalence Checking]
    end

    subgraph Output
        Result[Verification Result]
        Counter[Counter Example]
        Proof[Proof]
    end

    Spec --> Parse
    Impl --> Parse
    Parse --> Build
    Build --> Reduce
    Reduce --> Check
    Check --> Result
    Result --> Counter
    Result --> Proof
```

## Class Hierarchy

```mermaid
classDiagram
    class ProcessTerm {
        <<interface>>
        +substitute()
        +derive()
        +equals()
    }

    class SOSRule {
        <<interface>>
        +canApply()
        +deriveTransitions()
    }

    class EquivalenceChecker {
        <<abstract>>
        +areEquivalent()
        +computePartitions()
    }

    ProcessTerm <|-- PrefixTerm
    ProcessTerm <|-- ChoiceTerm
    ProcessTerm <|-- ParallelTerm
    ProcessTerm <|-- RecursiveTerm

    EquivalenceChecker <|-- BisimulationChecker
    EquivalenceChecker <|-- TracesChecker
    EquivalenceChecker <|-- FailuresChecker
```

## Behavioral Equivalences Hierarchy

```mermaid
graph BT
    Traces[Traces Equivalence]
    Testing[Testing Equivalence]
    Failures[Failures Equivalence]
    WeakBisim[Weak Bisimulation]
    StrongBisim[Strong Bisimulation]
    BranchBisim[Branching Bisimulation]

    Traces --> Testing
    Testing --> Failures
    Failures --> WeakBisim
    WeakBisim --> StrongBisim
    WeakBisim --> BranchBisim
```

## Features

- Support for CCS, CSP, and ACP semantic models
- Multiple behavioral equivalence checking algorithms
- State space reduction techniques
- Symbolic state space representation
- Comprehensive testing and benchmarking tools

## Implementation Status

- [x] Core LTS infrastructure
- [x] Basic process terms
- [x] SOS engine
- [x] CCS semantics
- [ ] CSP semantics
- [ ] ACP semantics
- [x] Strong bisimulation
- [x] Weak bisimulation
- [ ] Testing equivalence
- [ ] Failures equivalence
- [x] Partial order reduction
- [ ] Symbolic state space
- [x] Basic testing framework
- [ ] Performance benchmarks

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

- [Introduction to Process Algebras](../intro-to-pa.md)
- [Implementation Guide](../pas-implementation-guide.md)
- [Project Plan](../dafny-like-process-algebra-project-plan.md)

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
