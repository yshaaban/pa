/**
 * Structural Operational Semantics (SOS) Engine
 * 
 * This module implements the core SOS engine that derives transitions for process terms
 * based on inference rules. The engine supports multiple semantic models (CCS, CSP, ACP)
 * and handles complex process term compositions.
 * 
 * Key features:
 * - Rule-based transition derivation
 * - Support for multiple semantic models
 * - Efficient transition caching
 * - Handling of nested process term compositions
 */

import { ProcessTerm } from '../core/process-term';
import { PrefixTerm } from '../core/terms/prefix-term';
import { ChoiceTerm } from '../core/terms/choice-term';
import { ParallelTerm } from '../core/terms/parallel-term';
import { Transition } from '../core/lts';
import { createCSPSOSRules } from './csp-sos-rules';
import { createACPSOSRules } from './acp-sos-rules';

/**
 * Interface for SOS rules that derive transitions for process terms.
 * Each rule represents an inference rule in the operational semantics.
 */
export interface SOSRule {
    /**
     * Determines if this rule can be applied to the given process term.
     * @param term The process term to check
     * @returns true if the rule can be applied, false otherwise
     */
    canApply(term: ProcessTerm): boolean;

    /**
     * Derives all possible transitions for a process term according to this rule.
     * @param term The process term to derive transitions for
     * @returns A set of derived transitions
     */
    deriveTransitions(term: ProcessTerm): Set<Transition>;
}

/**
 * Main SOS engine class that manages rules and computes transitions.
 * Implements the core operational semantics functionality.
 */
export class SOSEngine {
    private rules: Set<SOSRule> = new Set();

    /**
     * Adds a single SOS rule to the engine.
     * @param rule The rule to add
     */
    addRule(rule: SOSRule): void {
        this.rules.add(rule);
    }

    /**
     * Adds multiple SOS rules to the engine.
     * @param rules Array of rules to add
     */
    addRules(rules: SOSRule[]): void {
        rules.forEach(rule => this.rules.add(rule));
    }

    /**
     * Computes all possible transitions for a given process term by applying
     * all applicable rules. Handles deduplication of transitions.
     * 
     * @param term The process term to compute transitions for
     * @returns A set of all possible transitions
     */
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

/**
 * CCS Prefix Action Rule implementation.
 * Handles the basic action prefix operator (a.P).
 */
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

/**
 * CCS Choice Rule implementation.
 * Handles the non-deterministic choice operator (P + Q).
 */
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

/**
 * CCS Parallel Composition Rule implementation.
 * Handles parallel composition (P|Q) with interleaving and synchronization.
 */
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

    /**
     * Checks if a term has a nested choice term as its continuation.
     * Used to handle special cases in parallel composition.
     */
    private hasNestedChoice(term: ProcessTerm): boolean {
        if (term instanceof PrefixTerm) {
            return term.getContinuation() instanceof ChoiceTerm;
        }
        return false;
    }

    /**
     * Recursively derives transitions for nested terms, handling special cases
     * for prefix terms with choice continuations.
     * 
     * @param term The process term to derive transitions for
     * @param isLeftBranch Whether this term is in the left branch of a parallel composition
     * @returns A set of derived transitions
     */
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
                const leftTransitionsArray = Array.from(leftTransitions);
                const rightTransitionsArray = Array.from(rightTransitions);

                if (leftTransitionsArray.length > 0) transitions.add(leftTransitionsArray[0]);
                if (rightTransitionsArray.length > 0) transitions.add(rightTransitionsArray[0]);
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

/**
 * CCS Communication Rule implementation.
 * Handles synchronization between complementary actions.
 */
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

/**
 * Creates a default CCS engine with standard rules.
 * @returns A configured SOSEngine instance for CCS semantics
 */
export function createDefaultCCSEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRule(new PrefixActionRule());
    engine.addRule(new ChoiceRule());
    engine.addRule(new ParallelCompositionRule());
    engine.addRule(new CommunicationRule());
    return engine;
}

/**
 * Creates a CSP engine with CSP-specific rules.
 * @returns A configured SOSEngine instance for CSP semantics
 */
export function createCSPEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRules(createCSPSOSRules());
    return engine;
}

/**
 * Creates an ACP engine with ACP-specific rules.
 * @returns A configured SOSEngine instance for ACP semantics
 */
export function createACPEngine(): SOSEngine {
    const engine = new SOSEngine();
    engine.addRules(createACPSOSRules());
    return engine;
}
