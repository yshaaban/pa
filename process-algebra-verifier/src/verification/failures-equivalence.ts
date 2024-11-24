// Failures Equivalence for Process Terms

import { ProcessTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';

// Represents a failure set: a set of actions that a process cannot perform
type FailureSet = {
    traces: Action[][];  // Traces leading to the failure set
    refusals: Action[];  // Actions that cannot be performed
};

export class FailuresEquivalenceChecker {
    // Compute the failure set for a given process term
    public computeFailureSet(term: ProcessTerm, maxDepth: number = 3): FailureSet {
        const failureSet: FailureSet = {
            traces: [],
            refusals: []
        };

        this.exploreFailures(term, [], failureSet, 0, maxDepth);
        return failureSet;
    }

    // Check failures equivalence between two process terms
    public checkFailuresEquivalence(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const failureSet1 = this.computeFailureSet(term1);
        const failureSet2 = this.computeFailureSet(term2);

        return this.compareFailureSets(failureSet1, failureSet2);
    }

    // Refinement checking: checks if term1 is refined by term2
    public checkRefinement(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const failureSet1 = this.computeFailureSet(term1);
        const failureSet2 = this.computeFailureSet(term2);

        return this.isRefinedBy(failureSet1, failureSet2);
    }

    private exploreFailures(
        term: ProcessTerm,
        currentTrace: Action[],
        failureSet: FailureSet,
        currentDepth: number,
        maxDepth: number
    ): void {
        // Add current trace
        if (currentTrace.length > 0) {
            failureSet.traces.push([...currentTrace]);
        }

        // Prevent excessive recursion
        if (currentDepth >= maxDepth) return;

        // Compute possible and impossible actions
        const transitions = term.derive();
        const possibleActions = new Set(Array.from(transitions).map(t => t.action));
        const allPossibleActions = this.getAllPossibleActions(term);

        // Compute refusals (actions that cannot be performed)
        const refusals = Array.from(allPossibleActions)
            .filter(action => !possibleActions.has(action));

        failureSet.refusals.push(...refusals);

        // Explore transitions
        for (const transition of transitions) {
            const newTrace = [...currentTrace, transition.action];

            // Recursively explore
            this.exploreFailures(
                term,
                newTrace,
                failureSet,
                currentDepth + 1,
                maxDepth
            );
        }
    }

    private getAllPossibleActions(term: ProcessTerm): Set<Action> {
        // Compute all possible actions for a process term
        const allActions = new Set<Action>();
        const transitions = term.derive();

        for (const transition of transitions) {
            allActions.add(transition.action);
        }

        return allActions;
    }

    private compareFailureSets(set1: FailureSet, set2: FailureSet): boolean {
        // Compare traces
        if (set1.traces.length !== set2.traces.length) return false;

        // Compare refusals
        if (!this.setsEqual(new Set(set1.refusals), new Set(set2.refusals))) {
            return false;
        }

        return true;
    }

    private isRefinedBy(set1: FailureSet, set2: FailureSet): boolean {
        // Check if set1 is refined by set2
        // This means set2 has at least as many traces and at least as many refusals as set1

        // Check traces
        for (const trace of set1.traces) {
            if (!this.traceExistsInSet(trace, set2.traces)) {
                return false;
            }
        }

        // Check refusals
        const refusals1 = new Set(set1.refusals);
        const refusals2 = new Set(set2.refusals);

        for (const refusal of refusals1) {
            if (!refusals2.has(refusal)) {
                return false;
            }
        }

        return true;
    }

    private traceExistsInSet(trace: Action[], traces: Action[][]): boolean {
        return traces.some(existingTrace =>
            this.tracesEqual(trace, existingTrace)
        );
    }

    private tracesEqual(trace1: Action[], trace2: Action[]): boolean {
        if (trace1.length !== trace2.length) return false;

        return trace1.every((action, index) => action === trace2[index]);
    }

    private setsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
        if (set1.size !== set2.size) return false;

        for (const item of set1) {
            if (!set2.has(item)) return false;
        }

        return true;
    }
}
