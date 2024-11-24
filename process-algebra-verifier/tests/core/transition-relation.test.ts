import { describe, expect, it, beforeEach } from '@jest/globals';
import { DefaultTransitionRelation, TransitionRelation } from '../../src/core/lts';

describe('DefaultTransitionRelation', () => {
    let transitionRelation: TransitionRelation;

    beforeEach(() => {
        transitionRelation = new DefaultTransitionRelation();
    });

    it('should add and retrieve transitions', () => {
        transitionRelation.add('S0', 'a', 'S1');
        transitionRelation.add('S0', 'b', 'S2');

        const s0Transitions = transitionRelation.getTransitions('S0');
        expect(s0Transitions.size).toBe(2);
    });

    it('should get target states for a specific action', () => {
        transitionRelation.add('S0', 'a', 'S1');
        transitionRelation.add('S0', 'a', 'S2');
        transitionRelation.add('S0', 'b', 'S3');

        const targetStates = transitionRelation.getTargetStates('S0', 'a');
        expect(targetStates.size).toBe(2);
        expect(targetStates.has('S1')).toBe(true);
        expect(targetStates.has('S2')).toBe(true);
    });

    it('should return empty set for non-existent transitions', () => {
        const transitions = transitionRelation.getTransitions('S0');
        expect(transitions.size).toBe(0);

        const targetStates = transitionRelation.getTargetStates('S0', 'a');
        expect(targetStates.size).toBe(0);
    });

    it('should handle multiple transitions between same states', () => {
        transitionRelation.add('S0', 'a', 'S1');
        transitionRelation.add('S0', 'b', 'S1');
        transitionRelation.add('S0', 'c', 'S1');

        const transitions = transitionRelation.getTransitions('S0');
        expect(transitions.size).toBe(3);

        const targetStatesA = transitionRelation.getTargetStates('S0', 'a');
        expect(targetStatesA.size).toBe(1);
        expect(targetStatesA.has('S1')).toBe(true);
    });

    it('should handle cyclic transitions', () => {
        transitionRelation.add('S0', 'a', 'S1');
        transitionRelation.add('S1', 'b', 'S0');

        const s0Transitions = transitionRelation.getTransitions('S0');
        const s1Transitions = transitionRelation.getTransitions('S1');

        expect(s0Transitions.size).toBe(1);
        expect(s1Transitions.size).toBe(1);
    });

    it('should handle self-loops', () => {
        transitionRelation.add('S0', 'a', 'S0');
        transitionRelation.add('S0', 'b', 'S0');

        const transitions = transitionRelation.getTransitions('S0');
        expect(transitions.size).toBe(2);

        const targetStates = transitionRelation.getTargetStates('S0', 'a');
        expect(targetStates.size).toBe(1);
        expect(targetStates.has('S0')).toBe(true);
    });

    it('should handle branching transitions', () => {
        // Diamond structure
        transitionRelation.add('S0', 'a', 'S1');
        transitionRelation.add('S0', 'a', 'S2');
        transitionRelation.add('S1', 'b', 'S3');
        transitionRelation.add('S2', 'b', 'S3');

        const s0Transitions = transitionRelation.getTransitions('S0');
        expect(s0Transitions.size).toBe(2);

        const s1Transitions = transitionRelation.getTransitions('S1');
        const s2Transitions = transitionRelation.getTransitions('S2');
        expect(s1Transitions.size).toBe(1);
        expect(s2Transitions.size).toBe(1);
    });
});
