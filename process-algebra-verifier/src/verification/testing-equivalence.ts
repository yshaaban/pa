// Testing Equivalence for Process Terms

import { ProcessTerm } from '../core/process-term';
import { Transition, Action } from '../core/lts';

// Represents an observation of a process after executing a test
type Observation = {
    type: 'success' | 'failure';
    actions?: Action[];
};

// Represents a test, which is a sequence of actions potentially followed by an observation
type Test = {
    actions: Action[];
    observation?: Observation;
};

export class TestingEquivalenceChecker {
    // May Testing Equivalence: Checks if one process can pass at least as many tests as another
    public checkMayTesting(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const tests1 = this.generateTests(term1);
        const tests2 = this.generateTests(term2);

        return this.compareMayTestSets(tests1, tests2);
    }

    // Must Testing Equivalence: Checks if one process passes exactly the same tests as another
    public checkMustTesting(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const tests1 = this.generateTests(term1);
        const tests2 = this.generateTests(term2);

        return this.compareMustTestSets(tests1, tests2);
    }

    private generateTests(term: ProcessTerm, maxDepth: number = 3): Set<Test> {
        const tests = new Set<Test>();
        this.exploreTests(term, [], tests, 0, maxDepth);
        return tests;
    }

    private exploreTests(
        term: ProcessTerm,
        currentActions: Action[],
        tests: Set<Test>,
        currentDepth: number,
        maxDepth: number
    ): void {
        // Add current test
        tests.add({
            actions: [...currentActions],
            observation: this.computeObservation(term)
        });

        // Prevent excessive recursion
        if (currentDepth >= maxDepth) return;

        // Explore possible transitions
        const transitions = term.derive();
        for (const transition of transitions) {
            const newActions = [...currentActions, transition.action];

            // Recursively explore
            this.exploreTests(
                term,
                newActions,
                tests,
                currentDepth + 1,
                maxDepth
            );
        }
    }

    private computeObservation(term: ProcessTerm): Observation {
        // Determine the observation for a given process term
        const transitions = term.derive();

        return {
            type: transitions.size > 0 ? 'success' : 'failure',
            actions: Array.from(transitions).map(t => t.action)
        };
    }

    private compareMayTestSets(tests1: Set<Test>, tests2: Set<Test>): boolean {
        // May testing: term1 can pass at least as many tests as term2
        for (const test of tests2) {
            if (!this.testPassedByAnySet(test, tests1)) {
                return false;
            }
        }
        return true;
    }

    private compareMustTestSets(tests1: Set<Test>, tests2: Set<Test>): boolean {
        // Must testing: exactly the same test sets
        if (tests1.size !== tests2.size) return false;

        for (const test of tests1) {
            if (!this.testPassedByAnySet(test, tests2)) {
                return false;
            }
        }
        return true;
    }

    private testPassedByAnySet(test: Test, testSet: Set<Test>): boolean {
        for (const existingTest of testSet) {
            if (this.testsEquivalent(test, existingTest)) {
                return true;
            }
        }
        return false;
    }

    private testsEquivalent(test1: Test, test2: Test): boolean {
        // Compare test actions
        if (test1.actions.length !== test2.actions.length) return false;

        for (let i = 0; i < test1.actions.length; i++) {
            if (test1.actions[i] !== test2.actions[i]) return false;
        }

        // Compare observations
        if (!test1.observation || !test2.observation) return false;

        return (
            test1.observation.type === test2.observation.type &&
            this.actionsEqual(test1.observation.actions, test2.observation.actions)
        );
    }

    private actionsEqual(actions1?: Action[], actions2?: Action[]): boolean {
        if (!actions1 && !actions2) return true;
        if (!actions1 || !actions2) return false;
        if (actions1.length !== actions2.length) return false;

        return actions1.every((action, index) => action === actions2[index]);
    }
}
