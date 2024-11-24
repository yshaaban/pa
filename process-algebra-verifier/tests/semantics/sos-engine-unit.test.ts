import { describe, expect, it } from '@jest/globals';
import { SOSEngine, SOSRule } from '../../src/semantics/sos-engine';
import { ProcessTerm } from '../../src/core/process-term';
import { Transition } from '../../src/core/lts';
import { MockProcessTerm } from '../core/prefix-term.test';

// Mock SOS Rule for testing
class MockSOSRule implements SOSRule {
    constructor(private shouldApply: boolean, private transitions: Transition[]) { }

    canApply(_term: ProcessTerm): boolean {
        return this.shouldApply;
    }

    deriveTransitions(_term: ProcessTerm): Set<Transition> {
        return new Set(this.transitions);
    }
}

describe('SOS Engine Unit Tests', () => {
    describe('Rule Management', () => {
        it('should add a single rule', () => {
            const engine = new SOSEngine();
            const rule = new MockSOSRule(true, []);
            engine.addRule(rule);

            // Test by computing transitions (should call the rule)
            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);
            expect(transitions.size).toBe(0); // Empty set since mock returns empty
        });

        it('should add multiple rules', () => {
            const engine = new SOSEngine();
            const rules = [
                new MockSOSRule(true, []),
                new MockSOSRule(false, [])
            ];
            engine.addRules(rules);

            // Test by computing transitions (should call both rules)
            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);
            expect(transitions.size).toBe(0); // Empty set since mocks return empty
        });
    });

    describe('Transition Computation', () => {
        it('should compute transitions from applicable rules', () => {
            const engine = new SOSEngine();
            const transition1 = new Transition('s1', 'a', 's2');
            const transition2 = new Transition('s1', 'b', 's3');

            engine.addRule(new MockSOSRule(true, [transition1, transition2]));

            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);

            expect(transitions.size).toBe(2);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('a');
            expect(actions).toContain('b');
        });

        it('should ignore non-applicable rules', () => {
            const engine = new SOSEngine();
            const transition = new Transition('s1', 'a', 's2');

            engine.addRule(new MockSOSRule(false, [transition]));

            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);

            expect(transitions.size).toBe(0);
        });

        it('should combine transitions from multiple applicable rules', () => {
            const engine = new SOSEngine();
            const transition1 = new Transition('s1', 'a', 's2');
            const transition2 = new Transition('s1', 'b', 's3');
            const transition3 = new Transition('s1', 'c', 's4');

            engine.addRule(new MockSOSRule(true, [transition1]));
            engine.addRule(new MockSOSRule(true, [transition2, transition3]));

            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);

            expect(transitions.size).toBe(3);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('a');
            expect(actions).toContain('b');
            expect(actions).toContain('c');
        });

        it('should handle duplicate transitions', () => {
            const engine = new SOSEngine();
            const transition1 = new Transition('s1', 'a', 's2');
            const transition2 = new Transition('s1', 'a', 's2'); // Same as transition1

            engine.addRule(new MockSOSRule(true, [transition1]));
            engine.addRule(new MockSOSRule(true, [transition2]));

            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);

            expect(transitions.size).toBe(1); // Should deduplicate
            expect(Array.from(transitions)[0].action).toBe('a');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty rule set', () => {
            const engine = new SOSEngine();
            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);
            expect(transitions.size).toBe(0);
        });

        it('should handle null transitions from rules', () => {
            const engine = new SOSEngine();
            const rule = new MockSOSRule(true, []);
            engine.addRule(rule);

            const term = new MockProcessTerm();
            const transitions = engine.computeTransitions(term);
            expect(transitions.size).toBe(0);
        });
    });
});
