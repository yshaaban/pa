/**
 * Example: Simple Communication Protocol
 * 
 * This example demonstrates the basic usage of the process algebra verifier
 * with a simple communication protocol between a sender and receiver.
 * It shows the core concepts in a more approachable way than the distributed
 * database example.
 */

import { ProcessTerm, PrefixTerm, ChoiceTerm, ParallelTerm, StopTerm } from '../src/core/process-term';
import { BisimulationChecker } from '../src/verification/bisimulation';
import { EquivalenceChecker, EquivalenceType } from '../src/verification/equivalence-checker';
import { LTSBuilder } from '../src/core/lts-builder';

/**
 * Models a simple sender that can send a message and wait for acknowledgment.
 */
class Sender {
    static create(): ProcessTerm {
        // send.receive_ack.STOP
        return new PrefixTerm(
            'send',
            new PrefixTerm('receive_ack', StopTerm.get())
        );
    }

    /**
     * Creates a faulty sender that might timeout instead of receiving ack
     */
    static createFaulty(): ProcessTerm {
        // send.(receive_ack.STOP + timeout.STOP)
        return new PrefixTerm(
            'send',
            new ChoiceTerm(
                new PrefixTerm('receive_ack', StopTerm.get()),
                new PrefixTerm('timeout', StopTerm.get())
            )
        );
    }
}

/**
 * Models a simple receiver that receives a message and sends acknowledgment.
 */
class Receiver {
    static create(): ProcessTerm {
        // receive.send_ack.STOP
        return new PrefixTerm(
            'receive',
            new PrefixTerm('send_ack', StopTerm.get())
        );
    }

    /**
     * Creates a faulty receiver that might drop the message
     */
    static createFaulty(): ProcessTerm {
        // receive.(send_ack.STOP + drop.STOP)
        return new PrefixTerm(
            'receive',
            new ChoiceTerm(
                new PrefixTerm('send_ack', StopTerm.get()),
                new PrefixTerm('drop', StopTerm.get())
            )
        );
    }
}

/**
 * Demonstrates various verification scenarios with the simple protocol.
 */
class SimpleProtocolExample {
    private verifier: EquivalenceChecker;
    private bisimulationChecker: BisimulationChecker;

    constructor() {
        const initialTerm = Sender.create();
        const lts = LTSBuilder.fromProcessTerm(initialTerm);
        this.verifier = new EquivalenceChecker(lts);
        this.bisimulationChecker = new BisimulationChecker();
    }

    /**
     * Verifies that the basic protocol works correctly.
     */
    verifyBasicProtocol(): boolean {
        const sender = Sender.create();
        const receiver = Receiver.create();
        const protocol = new ParallelTerm(sender, receiver);

        // Expected behavior: send -> receive -> send_ack -> receive_ack -> STOP
        const specification = new PrefixTerm(
            'send',
            new PrefixTerm(
                'receive',
                new PrefixTerm(
                    'send_ack',
                    new PrefixTerm('receive_ack', StopTerm.get())
                )
            )
        );

        return this.bisimulationChecker.checkWeakBisimulation(protocol, specification);
    }

    /**
     * Demonstrates how faulty components affect the protocol.
     */
    verifyFaultyProtocol(): boolean {
        const sender = Sender.createFaulty();
        const receiver = Receiver.createFaulty();
        const faultyProtocol = new ParallelTerm(sender, receiver);

        // Check if the faulty protocol is equivalent to the basic one
        const basicProtocol = new ParallelTerm(Sender.create(), Receiver.create());

        return this.bisimulationChecker.checkWeakBisimulation(faultyProtocol, basicProtocol);
    }

    /**
     * Shows how to verify specific properties using different equivalence relations.
     */
    verifyProperties(): void {
        const sender = Sender.create();
        const receiver = Receiver.create();
        const protocol = new ParallelTerm(sender, receiver);

        // Check trace equivalence
        const traceEquiv = this.verifier.checkEquivalence(
            protocol,
            this.createIdealBehavior(),
            EquivalenceType.TRACE
        );
        console.log('Trace equivalence:', traceEquiv);

        // Check bisimulation equivalence
        const bisimEquiv = this.verifier.checkEquivalence(
            protocol,
            this.createIdealBehavior(),
            EquivalenceType.BISIMULATION
        );
        console.log('Bisimulation equivalence:', bisimEquiv);

        // Check testing equivalence
        const testingEquiv = this.verifier.checkEquivalence(
            protocol,
            this.createIdealBehavior(),
            EquivalenceType.TESTING
        );
        console.log('Testing equivalence:', testingEquiv);
    }

    private createIdealBehavior(): ProcessTerm {
        // Ideal behavior is a simple sequential protocol execution
        return new PrefixTerm(
            'send',
            new PrefixTerm(
                'receive',
                new PrefixTerm(
                    'send_ack',
                    new PrefixTerm('receive_ack', StopTerm.get())
                )
            )
        );
    }
}

// Example usage:
const example = new SimpleProtocolExample();

console.log('Verifying basic protocol...');
const basicCorrect = example.verifyBasicProtocol();
console.log(`Basic protocol verification result: ${basicCorrect}`);

console.log('\nVerifying faulty protocol...');
const faultyCorrect = example.verifyFaultyProtocol();
console.log(`Faulty protocol verification result: ${faultyCorrect}`);

console.log('\nVerifying properties using different equivalences...');
example.verifyProperties();
