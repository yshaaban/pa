// Structural Operational Semantics (SOS) Engine

import { ProcessTerm, PrefixTerm, ChoiceTerm, ParallelTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';
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

        for (const rule of this.rules) {
            if (rule.canApply(term)) {
                const ruleTransitions = rule.deriveTransitions(term);
                for (const transition of ruleTransitions) {
                    results.add(transition);
                }
            }
        }

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
        const leftTransitions = parallelTerm.getLeft().derive();
        const rightTransitions = parallelTerm.getRight().derive();

        const combinedTransitions = new Set<Transition>();

        // Independent actions can occur in parallel
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

// CCS Communication Rule (Synchronization)
export class CommunicationRule implements SOSRule {
    canApply(term: ProcessTerm): boolean {
        return term instanceof ParallelTerm;
    }

    deriveTransitions(term: ProcessTerm): Set<Transition> {
        if (!(term instanceof ParallelTerm)) return new Set();

        const parallelTerm = term as ParallelTerm;
        const transitions = new Set<Transition>();

        // Placeholder for communication rule
        // In a real implementation, this would handle:
        // 1. Complementary action synchronization
        // 2. Silent (tau) communication
        // 3. Synchronization of compatible actions

        return transitions;
    }

    // Helper method to check if two actions can communicate
    private canCommunicate(action1: Action, action2: Action): boolean {
        // Implement communication compatibility logic
        // This is a placeholder and would depend on specific CCS variant
        return false;
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
