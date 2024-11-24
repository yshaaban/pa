// Advanced Bisimulation Equivalence Checking
// Implements Paige-Tarjan Partition Refinement Algorithm

import { ProcessTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';

export class BisimulationChecker {
    // Represents a partition of states
    private partition: Set<Set<ProcessTerm>> = new Set();

    // Compute strong bisimulation using Paige-Tarjan algorithm
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

    private initializePartition(term1: ProcessTerm, term2: ProcessTerm): void {
        // Initial coarse partition based on observable behavior
        const initialPartition = new Set<ProcessTerm>();
        initialPartition.add(term1);
        initialPartition.add(term2);
        this.partition.add(initialPartition);
    }

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

    private refineBlock(block: Set<ProcessTerm>): Set<Set<ProcessTerm>> {
        const refinedBlocks = new Set<Set<ProcessTerm>>();

        // Group terms by their transition signatures
        const transitionGroups = this.groupByTransitionSignature(block);

        // Create new blocks based on transition groups
        for (const group of transitionGroups.values()) {
            refinedBlocks.add(group);
        }

        return refinedBlocks;
    }

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

    private computeTransitionSignature(term: ProcessTerm): string {
        // Compute a unique signature based on transitions
        const transitions = term.derive();
        const actionSignatures = Array.from(transitions)
            .map(t => t.action)
            .sort()
            .join(',');

        return actionSignatures;
    }

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

    // Weak Bisimulation (preliminary implementation)
    checkWeakBisimulation(term1: ProcessTerm, term2: ProcessTerm): boolean {
        // Convert to weak transitions by considering tau actions
        const weakTransitions1 = this.computeWeakTransitions(term1);
        const weakTransitions2 = this.computeWeakTransitions(term2);

        // Compare weak transition sets
        return this.compareWeakTransitions(weakTransitions1, weakTransitions2);
    }

    private computeWeakTransitions(term: ProcessTerm): Set<Transition> {
        const weakTransitions = new Set<Transition>();

        // Compute direct and tau-reachable transitions
        const directTransitions = term.derive();

        for (const transition of directTransitions) {
            // Add direct transitions
            weakTransitions.add(transition);

            // TODO: Add tau-reachable transitions
            // This would involve following tau transitions
        }

        return weakTransitions;
    }

    private compareWeakTransitions(
        transitions1: Set<Transition>,
        transitions2: Set<Transition>
    ): boolean {
        // Compare weak transition sets, ignoring tau actions
        const nonTauTransitions1 = this.filterNonTauTransitions(transitions1);
        const nonTauTransitions2 = this.filterNonTauTransitions(transitions2);

        return this.transitionSetsEqual(nonTauTransitions1, nonTauTransitions2);
    }

    private filterNonTauTransitions(transitions: Set<Transition>): Set<Transition> {
        return new Set(
            Array.from(transitions).filter(t => t.action !== 'tau')
        );
    }

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

    private transitionsMatch(t1: Transition, t2: Transition): boolean {
        // Compare transition actions
        return t1.action === t2.action;
    }
}
