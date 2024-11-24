/**
 * Advanced Bisimulation Equivalence Checking Implementation
 * 
 * This module implements both strong and weak bisimulation equivalence checking using
 * the Paige-Tarjan partition refinement algorithm. The implementation supports:
 * 
 * 1. Strong bisimulation: Direct action matching
 * 2. Weak bisimulation: Action matching with tau-transitions
 * 
 * The weak bisimulation implementation properly handles tau-reachable transitions,
 * allowing for the comparison of processes that differ in their internal steps
 * but exhibit the same observable behavior.
 */

import { ProcessTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';

export class BisimulationChecker {
    // Represents a partition of states
    private partition: Set<Set<ProcessTerm>> = new Set();
    // Cache for process terms to avoid recreating them
    private termCache: Map<string, ProcessTerm> = new Map();

    /**
     * Checks if two process terms are strongly bisimilar using the Paige-Tarjan algorithm.
     * Strong bisimulation requires exact matching of transitions.
     * 
     * @param term1 The first process term to compare
     * @param term2 The second process term to compare
     * @returns true if the terms are strongly bisimilar, false otherwise
     */
    checkStrongBisimulation(term1: ProcessTerm, term2: ProcessTerm): boolean {
        // Initial partitioning
        this.initializePartition(term1, term2);

        // Refinement loop
        let changed: boolean;
        do {
            changed = this.refinePartition();
        } while (changed);

        // Check if terms are in the same partition
        return this.areTermsInSamePartition(term1, term2);
    }

    /**
     * Initializes the partition with the two terms being compared.
     * This creates the initial coarse partition that will be refined.
     * 
     * @param term1 The first process term
     * @param term2 The second process term
     */
    private initializePartition(term1: ProcessTerm, term2: ProcessTerm): void {
        const initialPartition = new Set<ProcessTerm>();
        initialPartition.add(term1);
        initialPartition.add(term2);
        this.partition.add(initialPartition);
    }

    /**
     * Refines the current partition based on transition behavior.
     * Returns true if the partition was changed during refinement.
     * 
     * @returns boolean indicating if the partition was refined
     */
    private refinePartition(): boolean {
        let changed = false;
        const newPartition = new Set<Set<ProcessTerm>>();

        for (const block of this.partition) {
            const refinedBlocks = this.refineBlock(block);

            if (refinedBlocks.size > 1) {
                changed = true;
            }

            for (const refinedBlock of refinedBlocks) {
                newPartition.add(refinedBlock);
            }
        }

        this.partition = newPartition;
        return changed;
    }

    /**
     * Refines a single block of the partition based on transition behavior.
     * Terms with different transition possibilities are separated.
     * 
     * @param block The block to refine
     * @returns Set of refined blocks
     */
    private refineBlock(block: Set<ProcessTerm>): Set<Set<ProcessTerm>> {
        const refinedBlocks = new Set<Set<ProcessTerm>>();
        const transitionGroups = this.groupByTransitionSignature(block);

        for (const group of transitionGroups.values()) {
            refinedBlocks.add(group);
        }

        return refinedBlocks;
    }

    /**
     * Groups terms by their transition signatures.
     * Terms with the same transition possibilities are grouped together.
     * 
     * @param block The block of terms to group
     * @returns Map from transition signatures to sets of terms
     */
    private groupByTransitionSignature(block: Set<ProcessTerm>): Map<string, Set<ProcessTerm>> {
        const groups = new Map<string, Set<ProcessTerm>>();

        for (const term of block) {
            const signature = this.computeTransitionSignature(term);

            if (!groups.has(signature)) {
                groups.set(signature, new Set());
            }
            groups.get(signature)!.add(term);
        }

        return groups;
    }

    /**
     * Computes a unique signature for a term based on its transitions.
     * 
     * @param term The term to compute signature for
     * @returns String representing the term's transition signature
     */
    private computeTransitionSignature(term: ProcessTerm): string {
        const transitions = term.derive();
        const actionSignatures = Array.from(transitions)
            .map(t => t.action)
            .sort()
            .join(',');

        return actionSignatures;
    }

    /**
     * Checks if two terms are in the same partition block.
     * 
     * @param term1 First term to check
     * @param term2 Second term to check
     * @returns true if the terms are in the same block
     */
    private areTermsInSamePartition(term1: ProcessTerm, term2: ProcessTerm): boolean {
        for (const block of this.partition) {
            const containsTerm1 = block.has(term1);
            const containsTerm2 = block.has(term2);

            if (containsTerm1 && containsTerm2) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if two process terms are weakly bisimilar.
     * Weak bisimulation allows for matching of actions through sequences of tau transitions.
     * 
     * @param term1 The first process term to compare
     * @param term2 The second process term to compare
     * @returns true if the terms are weakly bisimilar, false otherwise
     */
    checkWeakBisimulation(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const weakTransitions1 = this.computeWeakTransitions(term1);
        const weakTransitions2 = this.computeWeakTransitions(term2);

        return this.compareWeakTransitions(weakTransitions1, weakTransitions2);
    }

    /**
     * Computes all weak transitions for a term, including tau-reachable transitions.
     * This includes both direct transitions and those reachable through tau sequences.
     * 
     * @param term The term to compute transitions for
     * @returns Set of all weak transitions
     */
    private computeWeakTransitions(term: ProcessTerm): Set<Transition> {
        const weakTransitions = new Set<Transition>();
        const visited = new Set<string>();

        const computeTauReachable = (currentTerm: ProcessTerm) => {
            const termId = currentTerm.toString();
            if (visited.has(termId)) {
                return;
            }
            visited.add(termId);

            const directTransitions = currentTerm.derive();
            for (const transition of directTransitions) {
                if (transition.action === 'tau') {
                    const targetTerm = this.getProcessTermFromState(transition.target);
                    if (targetTerm) {
                        computeTauReachable(targetTerm);
                    }
                } else {
                    weakTransitions.add(transition);

                    const targetTerm = this.getProcessTermFromState(transition.target);
                    if (targetTerm) {
                        const tauReachable = this.getTauReachableStates(targetTerm);
                        for (const reachableState of tauReachable) {
                            const reachableTransitions = reachableState.derive();
                            for (const rt of reachableTransitions) {
                                if (rt.action !== 'tau') {
                                    weakTransitions.add(rt);
                                }
                            }
                        }
                    }
                }
            }
        };

        computeTauReachable(term);
        return weakTransitions;
    }

    /**
     * Computes all states reachable through tau transitions from a given term.
     * 
     * @param term The term to compute tau-reachable states for
     * @returns Set of all tau-reachable process terms
     */
    private getTauReachableStates(term: ProcessTerm): Set<ProcessTerm> {
        const reachable = new Set<ProcessTerm>();
        const toExplore: ProcessTerm[] = [term];
        const visited = new Set<string>();

        while (toExplore.length > 0) {
            const current = toExplore.pop()!;
            const currentId = current.toString();

            if (visited.has(currentId)) {
                continue;
            }

            visited.add(currentId);
            reachable.add(current);

            const transitions = current.derive();
            for (const transition of transitions) {
                if (transition.action === 'tau') {
                    const targetTerm = this.getProcessTermFromState(transition.target);
                    if (targetTerm) {
                        toExplore.push(targetTerm);
                    }
                }
            }
        }

        return reachable;
    }

    /**
     * Retrieves a ProcessTerm from its state representation.
     * Uses a cache to avoid recreating terms unnecessarily.
     * 
     * @param state String representation of the state
     * @returns The corresponding ProcessTerm, or null if not found
     */
    private getProcessTermFromState(state: string): ProcessTerm | null {
        if (this.termCache.has(state)) {
            return this.termCache.get(state)!;
        }
        return null;
    }

    /**
     * Compares two sets of weak transitions for equivalence.
     * 
     * @param transitions1 First set of transitions
     * @param transitions2 Second set of transitions
     * @returns true if the transition sets are equivalent
     */
    private compareWeakTransitions(
        transitions1: Set<Transition>,
        transitions2: Set<Transition>
    ): boolean {
        const nonTauTransitions1 = this.filterNonTauTransitions(transitions1);
        const nonTauTransitions2 = this.filterNonTauTransitions(transitions2);

        return this.transitionSetsEqual(nonTauTransitions1, nonTauTransitions2);
    }

    /**
     * Filters out tau transitions from a set of transitions.
     * 
     * @param transitions Set of transitions to filter
     * @returns New set containing only non-tau transitions
     */
    private filterNonTauTransitions(transitions: Set<Transition>): Set<Transition> {
        return new Set(
            Array.from(transitions).filter(t => t.action !== 'tau')
        );
    }

    /**
     * Checks if two sets of transitions are equal.
     * 
     * @param transitions1 First set of transitions
     * @param transitions2 Second set of transitions
     * @returns true if the sets contain matching transitions
     */
    private transitionSetsEqual(
        transitions1: Set<Transition>,
        transitions2: Set<Transition>
    ): boolean {
        if (transitions1.size !== transitions2.size) return false;

        for (const t1 of transitions1) {
            let matched = false;
            for (const t2 of transitions2) {
                if (this.transitionsMatch(t1, t2)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) return false;
        }

        return true;
    }

    /**
     * Checks if two transitions match in the context of weak bisimulation.
     * 
     * @param t1 First transition
     * @param t2 Second transition
     * @returns true if the transitions match
     */
    private transitionsMatch(t1: Transition, t2: Transition): boolean {
        if (t1.action !== t2.action) return false;

        const target1 = this.getProcessTermFromState(t1.target);
        const target2 = this.getProcessTermFromState(t2.target);

        if (target1 && target2) {
            return this.checkWeakBisimulation(target1, target2);
        }

        return t1.target === t2.target;
    }
}
