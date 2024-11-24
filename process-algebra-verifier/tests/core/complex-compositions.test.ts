import { describe, expect, it } from '@jest/globals';
import { PrefixTerm, ChoiceTerm, ParallelTerm, RecursiveTerm } from '../../src/core/process-term';
import { MockProcessTerm } from './prefix-term.test';

describe('Complex Process Term Compositions', () => {
    it('should handle choice between parallel compositions', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('2'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('3'));
        const p4 = new PrefixTerm('d', new MockProcessTerm('4'));

        const parallel1 = new ParallelTerm(p1, p2);
        const parallel2 = new ParallelTerm(p3, p4);
        const choice = new ChoiceTerm(parallel1, parallel2);

        expect(choice.toString()).toBe('((a.MockProcessTerm(1) | b.MockProcessTerm(2)) + (c.MockProcessTerm(3) | d.MockProcessTerm(4)))');
    });

    it('should handle recursive term with parallel composition', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('2'));
        const parallel = new ParallelTerm(p1, p2);
        const recursive = new RecursiveTerm('X', parallel);

        expect(recursive.toString()).toBe('rec X.(a.MockProcessTerm(X) | b.MockProcessTerm(2))');
    });

    it('should handle complex substitutions across different term types', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const choice = new ChoiceTerm(p1, p2);
        const parallel = new ParallelTerm(choice, new MockProcessTerm('Z'));

        const replacement = new PrefixTerm('c', new MockProcessTerm('W'));
        const result = parallel.substitute('X', replacement);

        expect(result instanceof ParallelTerm).toBe(true);
        expect((result as ParallelTerm).getLeft() instanceof ChoiceTerm).toBe(true);
    });

    it('should handle nested recursive terms with choice and parallel', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const choice = new ChoiceTerm(p1, p2);
        const parallel = new ParallelTerm(choice, new MockProcessTerm('Z'));
        const recursive = new RecursiveTerm('X', parallel);

        const unfolded = recursive.unfold();
        expect(unfolded instanceof ParallelTerm).toBe(true);
    });

    it('should handle multiple levels of choice nesting', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('2'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('3'));
        const p4 = new PrefixTerm('d', new MockProcessTerm('4'));

        const choice1 = new ChoiceTerm(p1, p2);
        const choice2 = new ChoiceTerm(p3, p4);
        const topChoice = new ChoiceTerm(choice1, choice2);

        const transitions = topChoice.derive();
        expect(transitions.size).toBe(4);

        const actions = Array.from(transitions).map(t => t.action);
        expect(actions).toContain('a');
        expect(actions).toContain('b');
        expect(actions).toContain('c');
        expect(actions).toContain('d');
    });

    it('should handle recursive terms with multiple variable occurrences', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('X'));
        const choice = new ChoiceTerm(p1, p2);
        const recursive = new RecursiveTerm('X', choice);

        const unfolded = recursive.unfold();
        expect(unfolded instanceof ChoiceTerm).toBe(true);
        // After unfolding, each occurrence of X is replaced with the full recursive term
        const expected = '(a.rec X.(a.MockProcessTerm(X) + b.MockProcessTerm(X)) + b.rec X.(a.MockProcessTerm(X) + b.MockProcessTerm(X)))';
        expect(unfolded.toString()).toBe(expected);
    });

    it('should handle parallel composition of recursive terms', () => {
        const def1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const def2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const rec1 = new RecursiveTerm('X', def1);
        const rec2 = new RecursiveTerm('Y', def2);
        const parallel = new ParallelTerm(rec1, rec2);

        expect(parallel.toString()).toBe('(rec X.a.MockProcessTerm(X) | rec Y.b.MockProcessTerm(Y))');
    });

    it('should handle choice between recursive terms', () => {
        const def1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const def2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const rec1 = new RecursiveTerm('X', def1);
        const rec2 = new RecursiveTerm('Y', def2);
        const choice = new ChoiceTerm(rec1, rec2);

        const transitions = choice.derive();
        expect(transitions.size).toBe(2);

        const actions = Array.from(transitions).map(t => t.action);
        expect(actions).toContain('a');
        expect(actions).toContain('b');
    });
});
