/**
 * Example: Verifying a Distributed Database System
 * 
 * This example demonstrates how to use the process algebra verifier to model and verify
 * a distributed database system with two-phase commit protocol. It shows:
 * 
 * 1. How to model complex distributed systems
 * 2. How to verify critical properties like serializability and deadlock freedom
 * 3. How to use different equivalence relations for verification
 */

import { ProcessTerm, PrefixTerm, ChoiceTerm, ParallelTerm, StopTerm } from '../src/core/process-term';
import { BisimulationChecker } from '../src/verification/bisimulation';
import { EquivalenceChecker } from '../src/verification/equivalence-checker';
import { LTSBuilder } from '../src/core/lts-builder';

/**
 * Models a Transaction Manager that can begin transactions,
 * perform read/write operations, and commit or abort.
 */
class TransactionManager {
    static create(): ProcessTerm {
        // BeginTx.(ReadOp + WriteOp).(Commit + Abort)
        return new PrefixTerm(
            'begin',
            new PrefixTerm(
                'operation',
                new ChoiceTerm(
                    new PrefixTerm('commit', StopTerm.get()),
                    new PrefixTerm('abort', StopTerm.get())
                )
            )
        );
    }
}

/**
 * Models a Two-Phase Commit Coordinator that manages
 * the distributed commit protocol.
 */
class Coordinator {
    static create(): ProcessTerm {
        // PreparePhase.(AllPrepared.CommitPhase + AnyAborted.AbortPhase).CollectAcks
        return new PrefixTerm(
            'prepare',
            new ChoiceTerm(
                new PrefixTerm(
                    'all_prepared',
                    new PrefixTerm('commit', new PrefixTerm('collect_acks', StopTerm.get()))
                ),
                new PrefixTerm(
                    'any_aborted',
                    new PrefixTerm('abort', new PrefixTerm('collect_acks', StopTerm.get()))
                )
            )
        );
    }
}

/**
 * Models a Participant node in the distributed system
 * that can participate in the two-phase commit protocol.
 */
class Participant {
    static create(): ProcessTerm {
        // ReceivePrepare.(Ready.WaitCommit + NotReady.WaitAbort).SendAck
        return new PrefixTerm(
            'receive_prepare',
            new ChoiceTerm(
                new PrefixTerm(
                    'ready',
                    new PrefixTerm('wait_commit', new PrefixTerm('send_ack', StopTerm.get()))
                ),
                new PrefixTerm(
                    'not_ready',
                    new PrefixTerm('wait_abort', new PrefixTerm('send_ack', StopTerm.get()))
                )
            )
        );
    }
}

/**
 * Example usage demonstrating how to verify properties
 * of the distributed database system.
 */
class DistributedDatabaseExample {
    private verifier: EquivalenceChecker;
    private bisimulationChecker: BisimulationChecker;

    constructor() {
        // Create initial LTS for the verifier
        const initialTerm = TransactionManager.create();
        const lts = LTSBuilder.fromProcessTerm(initialTerm);
        this.verifier = new EquivalenceChecker(lts);
        this.bisimulationChecker = new BisimulationChecker();
    }

    /**
     * Verifies that the implementation of the two-phase commit protocol
     * is correct with respect to its specification.
     */
    verifyTwoPhaseCommit(): boolean {
        // Create the implementation
        const coordinator = Coordinator.create();
        const participant1 = Participant.create();
        const participant2 = Participant.create();

        // Compose the system
        const implementation = new ParallelTerm(
            coordinator,
            new ParallelTerm(participant1, participant2)
        );

        // Create the specification (expected behavior)
        const specification = this.createTwoPhaseCommitSpec();

        // Verify using weak bisimulation
        return this.bisimulationChecker.checkWeakBisimulation(
            implementation,
            specification
        );
    }

    /**
     * Demonstrates how to verify serializability of concurrent transactions.
     */
    verifySerializability(): boolean {
        const tm1 = TransactionManager.create();
        const tm2 = TransactionManager.create();

        // Create concurrent composition
        const concurrent = new ParallelTerm(tm1, tm2);

        // Create serialized version (one after another)
        const serialized = new PrefixTerm(
            'begin',
            new PrefixTerm(
                'operation',
                new PrefixTerm(
                    'commit',
                    new PrefixTerm(
                        'begin',
                        new PrefixTerm('operation', new PrefixTerm('commit', StopTerm.get()))
                    )
                )
            )
        );

        // Check if concurrent execution is equivalent to serialized execution
        return this.bisimulationChecker.checkWeakBisimulation(
            concurrent,
            serialized
        );
    }

    /**
     * Shows how to verify deadlock freedom in the protocol.
     */
    verifyDeadlockFreedom(): boolean {
        const system = this.createCompleteSystem();

        // A deadlock-free system should always be able to make progress
        // We can verify this by checking if the system is equivalent to
        // a specification that can always proceed
        const deadlockFreeSpec = this.createDeadlockFreeSpec();

        return this.bisimulationChecker.checkWeakBisimulation(
            system,
            deadlockFreeSpec
        );
    }

    private createCompleteSystem(): ProcessTerm {
        const coordinator = Coordinator.create();
        const participant1 = Participant.create();
        const participant2 = Participant.create();
        const tm = TransactionManager.create();

        // Compose all components
        return new ParallelTerm(
            new ParallelTerm(coordinator, participant1),
            new ParallelTerm(participant2, tm)
        );
    }

    private createTwoPhaseCommitSpec(): ProcessTerm {
        // Simplified specification that captures the essential behavior
        return new PrefixTerm(
            'prepare',
            new ChoiceTerm(
                new PrefixTerm('commit', StopTerm.get()),
                new PrefixTerm('abort', StopTerm.get())
            )
        );
    }

    private createDeadlockFreeSpec(): ProcessTerm {
        // A specification that can always make progress
        return new ChoiceTerm(
            new PrefixTerm('progress', StopTerm.get()),
            new PrefixTerm('complete', StopTerm.get())
        );
    }
}

// Example usage:
const example = new DistributedDatabaseExample();

// Verify different properties
console.log('Verifying two-phase commit correctness...');
const tpcCorrect = example.verifyTwoPhaseCommit();
console.log(`Two-phase commit verification result: ${tpcCorrect}`);

console.log('\nVerifying transaction serializability...');
const serializable = example.verifySerializability();
console.log(`Serializability verification result: ${serializable}`);

console.log('\nVerifying deadlock freedom...');
const deadlockFree = example.verifyDeadlockFreedom();
console.log(`Deadlock freedom verification result: ${deadlockFree}`);
