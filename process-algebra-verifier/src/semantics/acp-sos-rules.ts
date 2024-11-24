// ACP (Algebra of Communicating Processes) Specific SOS Rules

import { ProcessTerm, PrefixTerm, ChoiceTerm, ParallelTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';
import { SOSRule } from './sos-engine';

// ACP Prefix Rule
export class ACPPrefixRule implements SOSRule {
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

// ACP Choice Rule (Merge Operator)
export class ACPChoiceMergeRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ChoiceTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ChoiceTerm)) return new Set();

        const choiceTerm = term as ChoiceTerm;
        const leftTransitions = choiceTerm.getLeft().derive();
        const rightTransitions = choiceTerm.getRight().derive();

        const mergedTransitions = new Set<Transition>();

        // ACP merge semantics: combine transitions with priority rules
        leftTransitions.forEach(leftTrans => {
            mergedTransitions.add(new Transition(
                'initial',
                leftTrans.action,
                'left-merge'
            ));
        });

        rightTransitions.forEach(rightTrans => {
            // Check if right transition should be added based on merge priority
            if (this.shouldAddRightTransition(leftTransitions, rightTrans)) {
                mergedTransitions.add(new Transition(
                    'initial',
                    rightTrans.action,
                    'right-merge'
                ));
            }
        });

        return mergedTransitions;
    }

    // Determine if a right transition should be added based on ACP merge semantics
    private shouldAddRightTransition(leftTransitions: Set<Transition>, rightTrans: Transition): boolean {
        // Placeholder for merge priority logic
        // In ACP, this could involve:
        // 1. Checking action compatibility
        // 2. Applying merge priority rules
        return true;
    }
}

// ACP Parallel Composition Rule (Communication Merge)
export class ACPParallelCommunicationRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const parallelTerm = term as ParallelTerm;
        const leftTransitions = parallelTerm.getLeft().derive();
        const rightTransitions = parallelTerm.getRight().derive();

        const communicationTransitions = new Set<Transition>();

        // ACP communication merge semantics
        leftTransitions.forEach(leftTrans => {
            rightTransitions.forEach(rightTrans => {
                const communicationAction = this.communicationMerge(leftTrans.action, rightTrans.action);

                if (communicationAction !== null) {
                    communicationTransitions.add(new Transition(
                        'initial',
                        communicationAction,
                        'communication-merge'
                    ));
                }
            });
        });

        return communicationTransitions;
    }

    // Implement ACP communication merge logic
    private communicationMerge(action1: Action, action2: Action): Action | null {
        // Placeholder for communication merge
        // In ACP, this involves:
        // 1. Checking if actions can communicate
        // 2. Producing a merged/combined action
        // 3. Handling communication restrictions

        // Simple example: if actions are the same, return a merged action
        if (action1 === action2) {
            return `${action1}-merged`;
        }

        // If actions cannot communicate, return null
        return null;
    }
}

// Initialize ACP-specific SOS rules
export function createACPSOSRules(): SOSRule[] {
    return [
        new ACPPrefixRule(),
        new ACPChoiceMergeRule(),
        new ACPParallelCommunicationRule()
    ];
}
