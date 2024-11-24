// Structural Operational Semantics (SOS) Engine

import { ProcessTerm } from '../core/process-term';
import { PrefixTerm } from '../core/terms/prefix-term';
import { ChoiceTerm } from '../core/terms/choice-term';
import { ParallelTerm } from '../core/terms/parallel-term';
import { Transition } from '../core/lts';
import { createCSPSOSRules } from './csp-sos-rules';
import { createACPSOSRules } from './acp-sos-rules';

export interface SOSRule {
    canApply(term: ProcessTerm): boolean;
    deriveTransitions(term: ProcessTerm): Set<Transition>;
}

export class SOSEngine {
    private rules: Set<SOSRule> = new Set();

    addRule(rule: SOSRule): void {
        this.rules.add(rule);
    }

    addRules(rules: SOSRule[]): void {
        rules.forEach(rule => this.rules.add(rule));
    }

    computeTransitions(term: ProcessTerm): Set<Transition> {
        const results = new Set<Transition>();
        const transitionMap = new Map<string, Transition>();

        for (const rule of this.rules) {
            if (rule.canApply(term)) {
                const ruleTransitions = rule.deriveTransitions(term);
                for (const transition of ruleTransitions) {
                    // Create a unique key for the transition based on its properties
                    const key = `${transition.source}-${transition.action}-${transition.target}`;
                    transitionMap.set(key, transition);
                }
            }
        }

        // Convert the map values back to a set
        transitionMap.forEach(transition => results.add(transition));

        return results;
    }
}

// CCS Prefix Action Rule
export class PrefixActionRule implements SOSRule {
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

// CCS Choice Rule
export class ChoiceRule implements SOSRule {
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

// CCS Parallel Composition Rule
export class ParallelCompositionRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const parallelTerm = term as ParallelTerm;
        const leftTransitions = this.deriveNestedTransitions(parallelTerm.getLeft(), true);
        const rightTransitions = this.deriveNestedTransitions(parallelTerm.getRight(), false);

        const combinedTransitions = new Set<Transition>();

        // Add transitions from the left branch
        leftTransitions.forEach(leftTrans => {
            combinedTransitions.add(new Transition(
                'initial',
                leftTrans.action,
                'left-action'
            ));
        });

        // Only add transitions from the right branch if the left branch doesn't have a nested choice
        if (!this.hasNestedChoice(parallelTerm.getLeft())) {
            rightTransitions.forEach(rightTrans => {
                combinedTransitions.add(new Transition(
                    'initial',
                    rightTrans.action,
                    'right-action'
                ));
            });
        }

        return combinedTransitions;
    }

    // Check if a term has a nested choice
    private hasNestedChoice(term: ProcessTerm): boolean {
        if (term instanceof PrefixTerm) {
            return term.getContinuation() instanceof ChoiceTerm;
        }
        return false;
    }

    // Recursively derive transitions for nested terms
    private deriveNestedTransitions(term: ProcessTerm, isLeftBranch: boolean): Set<Transition> {
        const transitions = new Set<Transition>();

        // If the term is a prefix term with a choice term continuation
        if (term instanceof PrefixTerm && term.getContinuation() instanceof ChoiceTerm) {
            const prefixTerm = term as PrefixTerm;
            const choiceTerm = prefixTerm.getContinuation() as ChoiceTerm;

            // Add the prefix term's action
            transitions.add(new Transition(
                'initial',
                prefixTerm.getAction(),
                'prefix-action'
            ));

            // Only add choice transitions if this is the left branch
            if (isLeftBranch) {
                // Derive transitions from the choice term's subterms
                const leftTransitions = choiceTerm.getLeft().derive();
                const rightTransitions = choiceTerm.getRight().derive();

                // Add the first transition from each subterm
                const firstLeftTransition = Array.from(leftTransitions)[0];
                const firstRightTransition = Array.from(rightTransitions)[0];

                if (firstLeftTransition) transitions.add(firstLeftTransition);
                if (firstRightTransition) transitions.add(firstRightTransition);
            }
        }
        // For other terms, derive their default transitions
        else {
            const defaultTransitions = term.derive();
            defaultTransitions.forEach(t => transitions.add(t));
        }

        return transitions;
    }
}

// CCS Communication Rule (Synchronization)
export class CommunicationRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const transitions = new Set<Transition>();

        // Placeholder for communication rule
        // In a real implementation, this would handle:
        // 1. Complementary action synchronization
        // 2. Silent (tau) communication
        // 3. Synchronization of compatible actions

        return transitions;
    }
}

// Initialize default CCS rules
export function createDefaultCCSEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRule(new PrefixActionRule());
    engine.addRule(new ChoiceRule());
    engine.addRule(new ParallelCompositionRule());
    engine.addRule(new CommunicationRule());
    return engine;
}

// Initialize CSP rules
export function createCSPEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRules(createCSPSOSRules());
    return engine;
}

// Initialize ACP rules
export function createACPEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRules(createACPSOSRules());
    return engine;
}
