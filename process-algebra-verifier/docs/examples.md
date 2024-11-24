# Process Algebra Examples and Use Cases

This document provides practical examples and visualizations of common process algebra verification scenarios.

## Simple Protocol Verification

```mermaid
sequenceDiagram
    participant Sender
    participant Channel
    participant Receiver

    Sender->>Channel: send
    Channel->>Receiver: receive
    Receiver->>Channel: ack
    Channel->>Sender: ack

    note over Sender,Receiver: Protocol Specification
```

### CCS Implementation

```
Sender = send.ack.Sender
Channel = send.receive.ack.ack.Channel
Receiver = receive.ack.Receiver
System = (Sender | Channel | Receiver) \ {send, receive, ack}
```

### Verification Flow

```mermaid
graph TD
    Spec[Protocol Specification]
    Impl[Implementation]
    LTS[Generate LTS]
    Bisim[Check Bisimulation]
    Result[Verification Result]

    Spec --> LTS
    Impl --> LTS
    LTS --> Bisim
    Bisim --> Result
```

## Distributed Database Example

```mermaid
graph LR
    subgraph Client
        Read[Read Request]
        Write[Write Request]
    end

    subgraph Replicas
        R1[Replica 1]
        R2[Replica 2]
        R3[Replica 3]
    end

    Read --> R1
    Read --> R2
    Read --> R3

    Write --> R1
    Write --> R2
    Write --> R3

    R1 <--> R2
    R2 <--> R3
    R1 <--> R3
```

### CSP Implementation

```
Client = (read?x -> response!x -> Client) [] (write?x -> ack -> Client)
Replica = (read!data -> Replica) [] (write?x -> sync!x -> Replica)
System = (Client [|{read, write}|] Replica) \ {sync}
```

## Vending Machine Example

```mermaid
stateDiagram-v2
    [*] --> Ready
    Ready --> Coin1: coin
    Coin1 --> Coin2: coin
    Coin2 --> Coffee: select_coffee
    Coin2 --> Tea: select_tea
    Coffee --> Ready: dispense
    Tea --> Ready: dispense
```

### ACP Implementation

```
VM = coin.coin.(coffee.VM + tea.VM)
```

### Equivalence Classes

```mermaid
graph TB
    subgraph Traces
        VM1[VM Implementation 1]
        VM2[VM Implementation 2]
        VM3[VM Implementation 3]
    end

    subgraph Testing
        VM2_T[VM 2]
        VM3_T[VM 3]
    end

    subgraph Bisimulation
        VM1_B[VM 1]
        VM2_B[VM 2]
        VM3_B[VM 3]
    end

    VM1 --- VM2
    VM2 --- VM3

    VM2_T --- VM3_T

    VM1_B
    VM2_B
    VM3_B
```

## Resource Allocation System

```mermaid
stateDiagram-v2
    [*] --> Free
    Free --> Allocated: request
    Allocated --> Free: release
    Allocated --> Error: request
    Error --> Free: reset
```

### Implementation and Verification

```mermaid
graph TB
    subgraph Specification
        Spec[Safety Properties]
        Live[Liveness Properties]
    end

    subgraph Implementation
        Alloc[Allocation Logic]
        Sync[Synchronization]
        Error[Error Handling]
    end

    subgraph Verification
        Safety[Safety Checking]
        Progress[Progress Checking]
        Dead[Deadlock Freedom]
    end

    Spec --> Safety
    Live --> Progress
    Alloc --> Safety
    Sync --> Dead
    Error --> Safety
```

## Mutual Exclusion Example

```mermaid
sequenceDiagram
    participant P1 as Process 1
    participant CS as Critical Section
    participant P2 as Process 2

    P1->>CS: request
    CS->>P1: grant
    P1->>CS: release
    CS->>P2: grant
    P2->>CS: release
```

### CCS Implementation

```
Process = request.enter.critical.exit.release.Process
Mutex = request.grant.release.Mutex
System = (Process | Mutex) \ {request, grant, release}
```

## Network Protocol Verification

```mermaid
graph TB
    subgraph Protocol
        Init[Initialize]
        Hand[Handshake]
        Data[Data Transfer]
        Close[Close]
    end

    subgraph Properties
        Auth[Authentication]
        Conf[Confidentiality]
        Int[Integrity]
    end

    subgraph Verification
        Model[Model Checking]
        Equiv[Equivalence Checking]
        Ref[Refinement]
    end

    Protocol --> Properties
    Properties --> Verification
```

## Usage Examples

### Basic Verification

```typescript
// Define processes
const spec = parser.parse("coin.coin.(coffee.STOP + tea.STOP)");
const impl = parser.parse("coin.coin.coffee.STOP + coin.coin.tea.STOP");

// Check equivalence
const checker = new BisimulationChecker();
const result = checker.areEquivalent(spec, impl);
```

### Advanced Analysis

```typescript
// Define system with partial order reduction
const system = new VerificationSystem({
  reduction: "partial-order",
  equivalence: "weak-bisimulation",
  maxStates: 10000,
});

// Verify properties
const result = await system.verify(spec, impl, {
  checkDeadlocks: true,
  checkLiveness: true,
});
```

These examples demonstrate common verification scenarios and how to use the process algebra verifier to model and verify concurrent systems. Each example includes:

1. Visual representation of the system
2. Process algebra implementation
3. Verification approach
4. Example code

The examples progress from simple to complex scenarios, showing how different features of the verifier can be combined to handle various verification tasks.
