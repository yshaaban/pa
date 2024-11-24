// CSP (Communicating Sequential Processes) Specific SOS Rules

import { ProcessTerm, PrefixTerm, ChoiceTerm, ParallelTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';
import { SOSRule } from './sos-engine';

// CSP Prefix Rule
export class CSPPrefixRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof PrefixTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof PrefixTerm)) return new Set();

        const prefixTerm = term as PrefixTerm;
        const transition = new Transition(
            'initial',
            prefixTerm.getAction(),
            'continuation'
        );
        return new Set([transition]);
    }
}

// CSP External Choice Rule (Non-deterministic Choice)
export class CSPExternalChoiceRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ChoiceTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ChoiceTerm)) return new Set();

        const choiceTerm = term as ChoiceTerm;
        const leftTransitions = choiceTerm.getLeft().derive();
        const rightTransitions = choiceTerm.getRight().derive();

        return new Set([...leftTransitions, ...rightTransitions]);
    }
}

// CSP Parallel Composition Rule (Interleaving)
export class CSPParallelRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const parallelTerm = term as ParallelTerm;
        const leftTransitions = parallelTerm.getLeft().derive();
        const rightTransitions = parallelTerm.getRight().derive();

        const combinedTransitions = new Set<Transition>();

        // Interleaving semantics: actions can occur independently
        leftTransitions.forEach(leftTrans => {
            combinedTransitions.add(new Transition(
                'initial',
                leftTrans.action,
                'left-action'
            ));
        });

        rightTransitions.forEach(rightTrans => {
            combinedTransitions.add(new Transition(
                'initial',
                rightTrans.action,
                'right-action'
            ));
        });

        return combinedTransitions;
    }
}

// CSP Synchronization Rule (Rendezvous Communication)
export class CSPSynchronizationRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const parallelTerm = term as ParallelTerm;
        const transitions = new Set<Transition>();

        // Rendezvous communication: processes must synchronize on common actions
        const leftTransitions = parallelTerm.getLeft().derive();
        const rightTransitions = parallelTerm.getRight().derive();

        // Placeholder for synchronization logic
        // In CSP, processes must synchronize on exactly matching actions
        leftTransitions.forEach(leftTrans => {
            rightTransitions.forEach(rightTrans => {
                if (this.canSynchronize(leftTrans.action, rightTrans.action)) {
                    transitions.add(new Transition(
                        'initial',
                        this.synchronizedAction(leftTrans.action, rightTrans.action),
                        'synchronized-action'
                    ));
                }
            });
        });

        return transitions;
    }

    // Check if two actions can synchronize (rendezvous)
    private canSynchronize(action1: Action, action2: Action): boolean {
        // In CSP, synchronization requires exact action match
        return action1 === action2;
    }

    // Create a synchronized action (could be a tau or a combined action)
    private synchronizedAction(action1: Action, action2: Action): Action {
        // For now, return a tau (silent) action to represent synchronization
        return 'tau';
    }
}

// Initialize CSP-specific SOS rules
export function createCSPSOSRules(): SOSRule[] {
    return [
        new CSPPrefixRule(),
        new CSPExternalChoiceRule(),
        new CSPParallelRule(),
        new CSPSynchronizationRule()
    ];
}
