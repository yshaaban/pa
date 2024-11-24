# Process Algebra Verifier

A comprehensive TypeScript implementation of a process algebra verification system, supporting multiple semantic models and verification techniques for analyzing concurrent and distributed systems.

## Features

### Core Capabilities

- Labelled Transition System (LTS) infrastructure
- Multiple process term representations (prefix, choice, parallel, recursive)
- Structural Operational Semantics (SOS) engine
- Advanced equivalence checking techniques
- Tau-reachable transitions support for weak bisimulation

### Supported Equivalence Relations

- Trace Equivalence: Compares visible sequences of actions
- Bisimulation Equivalence: Both strong and weak variants
- Testing Equivalence: May and must testing
- Failures Equivalence: For CSP-style refinement checking

### Semantic Models

- CCS (Calculus of Communicating Systems)
- CSP (Communicating Sequential Processes)
- ACP (Algebra of Communicating Processes)

## Installation

```bash
git clone https://github.com/yourusername/process-algebra-verifier.git
cd process-algebra-verifier
npm install
```

## Usage

### Basic Process Term Creation

```typescript
import { PrefixTerm, ChoiceTerm, StopTerm } from "./core/process-term";

// Create a simple prefix term: a.b.STOP
const prefixTerm = new PrefixTerm("a", new PrefixTerm("b", StopTerm.get()));

// Create a choice term: (a.STOP + b.STOP)
const choiceTerm = new ChoiceTerm(
  new PrefixTerm("a", StopTerm.get()),
  new PrefixTerm("b", StopTerm.get())
);
```

### Equivalence Checking

```typescript
import {
  EquivalenceChecker,
  EquivalenceType,
} from "./verification/equivalence-checker";
import { LTSBuilder } from "./core/lts-builder";

// Create process terms
const term1 = new PrefixTerm("a", StopTerm.get());
const term2 = new PrefixTerm("a", StopTerm.get());

// Create LTS and checker
const lts = LTSBuilder.fromProcessTerm(term1);
const checker = new EquivalenceChecker(lts);

// Check equivalence
const areEquivalent = checker.checkEquivalence(
  term1,
  term2,
  EquivalenceType.BISIMULATION
);
```

### Weak Bisimulation with Tau Transitions

```typescript
import { BisimulationChecker } from "./verification/bisimulation";

const checker = new BisimulationChecker();

// Check weak bisimulation (handles tau transitions)
const areWeaklyBisimilar = checker.checkWeakBisimulation(term1, term2);
```

### Complete Example: Simple Protocol

Here's a simple example verifying a communication protocol:

```typescript
import { PrefixTerm, ParallelTerm, StopTerm } from "./core/process-term";

// Create sender: send.receive_ack.STOP
const sender = new PrefixTerm(
  "send",
  new PrefixTerm("receive_ack", StopTerm.get())
);

// Create receiver: receive.send_ack.STOP
const receiver = new PrefixTerm(
  "receive",
  new PrefixTerm("send_ack", StopTerm.get())
);

// Compose the protocol
const protocol = new ParallelTerm(sender, receiver);

// Verify protocol correctness
const checker = new BisimulationChecker();
const isCorrect = checker.checkWeakBisimulation(protocol, expectedBehavior);
```

See the `examples` directory for more comprehensive examples:

- `simple-protocol.ts`: Basic communication protocol verification
- `distributed-db.ts`: Complex distributed database system verification

## Advanced Usage

### Verifying Complex Systems

For complex systems like distributed databases or communication protocols:

1. Model each component as a ProcessTerm
2. Compose components using parallel composition
3. Define expected behavior
4. Verify using appropriate equivalence relation

Example:

```typescript
// Model components
const coordinator = createCoordinator();
const participant1 = createParticipant();
const participant2 = createParticipant();

// Compose system
const system = new ParallelTerm(
  coordinator,
  new ParallelTerm(participant1, participant2)
);

// Verify properties
const checker = new BisimulationChecker();
const isCorrect = checker.checkWeakBisimulation(system, specification);
```

### Custom Properties

You can verify custom properties by:

1. Defining the property as a ProcessTerm
2. Using appropriate equivalence relation
3. Checking refinement or equivalence

```typescript
const property = new PrefixTerm(
  "action",
  new ChoiceTerm(
    new PrefixTerm("success", StopTerm.get()),
    new PrefixTerm("retry", StopTerm.get())
  )
);

const satisfiesProperty = checker.checkEquivalence(
  system,
  property,
  EquivalenceType.FAILURES
);
```

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

## License

[Specify your license]

## Acknowledgements

Inspired by foundational work in process algebras and concurrent system verification.
