/**
 * Utility class for building LTS (Labelled Transition System) from ProcessTerms.
 * This provides functionality to convert process terms into their corresponding LTS representation.
 */

import { LTS, State, Action, Transition, DefaultTransitionRelation } from './lts';
import { ProcessTerm } from './process-term';

export class LTSBuilder {
    /**
     * Converts a ProcessTerm into its corresponding LTS representation.
     * 
     * @param term The process term to convert
     * @returns The corresponding LTS
     */
    static fromProcessTerm(term: ProcessTerm): LTS {
        const states = new Set<State>();
        const actions = new Set<Action>();
        const transitions = new DefaultTransitionRelation();
        const visited = new Set<string>();

        // Helper function to recursively explore the term
        const explore = (currentTerm: ProcessTerm) => {
            const termId = currentTerm.toString();
            if (visited.has(termId)) {
                return;
            }

            visited.add(termId);
            states.add(termId);

            const derivedTransitions = currentTerm.derive();
            for (const transition of derivedTransitions) {
                actions.add(transition.action);
                transitions.add(termId, transition.action, transition.target);

                // Recursively explore target states
                const targetTerm = currentTerm.substitute('', currentTerm); // Placeholder substitution
                if (targetTerm) {
                    explore(targetTerm);
                }
            }
        };

        // Start exploration from the initial term
        explore(term);

        return {
            states,
            actions,
            transitions,
            initialState: term.toString()
        };
    }
}
