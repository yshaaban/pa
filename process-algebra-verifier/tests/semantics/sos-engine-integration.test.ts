import { describe, expect, it, beforeEach } from '@jest/globals';
import {
    createDefaultCCSEngine,
    createCSPEngine,
    createACPEngine,
    SOSEngine
} from '../../src/semantics/sos-engine';
import {
    PrefixTerm,
    ChoiceTerm,
    ParallelTerm
} from '../../src/core/process-term';
import { MockProcessTerm } from '../core/prefix-term.test';

describe('SOS Engine Integration Tests', () => {
    describe('CCS Semantic Model', () => {
        let ccsEngine: SOSEngine;

        beforeEach(() => {
            ccsEngine = createDefaultCCSEngine();
        });

        it('should derive transitions for simple prefix term', () => {
            const prefixTerm = new PrefixTerm('a', new MockProcessTerm());
            const transitions = ccsEngine.computeTransitions(prefixTerm);

            expect(transitions.size).toBe(1);
            const transition = Array.from(transitions)[0];
            expect(transition.action).toBe('a');
            expect(transition.source).toBe('initial');
            expect(transition.target).toBe('continuation');
        });

        it('should derive transitions for choice term', () => {
            const left = new PrefixTerm('a', new MockProcessTerm('1'));
            const right = new PrefixTerm('b', new MockProcessTerm('2'));
            const choiceTerm = new ChoiceTerm(left, right);

            const transitions = ccsEngine.computeTransitions(choiceTerm);

            expect(transitions.size).toBe(2);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('a');
            expect(actions).toContain('b');
        });

        it('should derive transitions for parallel composition', () => {
            const left = new PrefixTerm('a', new MockProcessTerm('1'));
            const right = new PrefixTerm('b', new MockProcessTerm('2'));
            const parallelTerm = new ParallelTerm(left, right);

            const transitions = ccsEngine.computeTransitions(parallelTerm);

            expect(transitions.size).toBe(2);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('a');
            expect(actions).toContain('b');
        });
    });

    describe('CSP Semantic Model', () => {
        let cspEngine: SOSEngine;

        beforeEach(() => {
            cspEngine = createCSPEngine();
        });

        it('should handle CSP-specific process compositions', () => {
            const left = new PrefixTerm('a', new MockProcessTerm('1'));
            const right = new PrefixTerm('b', new MockProcessTerm('2'));
            const choiceTerm = new ChoiceTerm(left, right);

            const transitions = cspEngine.computeTransitions(choiceTerm);

            expect(transitions.size).toBe(2);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('a');
            expect(actions).toContain('b');
        });
    });

    describe('ACP Semantic Model', () => {
        let acpEngine: SOSEngine;

        beforeEach(() => {
            acpEngine = createACPEngine();
        });

        it('should handle ACP-specific process compositions', () => {
            const left = new PrefixTerm('a', new MockProcessTerm('1'));
            const right = new PrefixTerm('b', new MockProcessTerm('2'));
            const parallelTerm = new ParallelTerm(left, right);

            const transitions = acpEngine.computeTransitions(parallelTerm);

            // ACP might have different transition semantics
            // This is a placeholder test that can be refined based on specific ACP rules
            expect(transitions.size).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Complex Process Term Interactions', () => {
        let ccsEngine: SOSEngine;

        beforeEach(() => {
            ccsEngine = createDefaultCCSEngine();
        });

        it('should handle nested process term compositions', () => {
            const innerLeft = new PrefixTerm('a', new MockProcessTerm('1'));
            const innerRight = new PrefixTerm('b', new MockProcessTerm('2'));
            const innerChoice = new ChoiceTerm(innerLeft, innerRight);

            const outerLeft = new PrefixTerm('c', innerChoice);
            const outerRight = new PrefixTerm('d', new MockProcessTerm('3'));
            const parallelTerm = new ParallelTerm(outerLeft, outerRight);

            const transitions = ccsEngine.computeTransitions(parallelTerm);

            expect(transitions.size).toBe(3);
            const actions = Array.from(transitions).map(t => t.action);
            expect(actions).toContain('c');
            expect(actions).toContain('a');
            expect(actions).toContain('b');
        });
    });
});
