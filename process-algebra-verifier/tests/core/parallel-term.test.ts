import { describe, expect, it } from '@jest/globals';
import { ParallelTerm, PrefixTerm } from '../../src/core/process-term';
import { MockProcessTerm } from './prefix-term.test';

describe('ParallelTerm', () => {
    it('should create a parallel term with correct left and right processes', () => {
        const left = new PrefixTerm('a', new MockProcessTerm());
        const right = new PrefixTerm('b', new MockProcessTerm());
        const parallelTerm = new ParallelTerm(left, right);

        expect(parallelTerm.getLeft()).toBe(left);
        expect(parallelTerm.getRight()).toBe(right);
    });

    it('should handle substitution in parallel composition', () => {
        const left = new PrefixTerm('a', new MockProcessTerm('X'));
        const right = new PrefixTerm('b', new MockProcessTerm('Y'));
        const parallel = new ParallelTerm(left, right);

        const replacement = new MockProcessTerm('Z');
        const result = parallel.substitute('X', replacement);

        expect(result instanceof ParallelTerm).toBe(true);
        expect((result as ParallelTerm).getLeft() instanceof PrefixTerm).toBe(true);
        expect((result as ParallelTerm).getRight() instanceof PrefixTerm).toBe(true);
    });

    it('should compare terms for equality', () => {
        const left1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const right1 = new PrefixTerm('b', new MockProcessTerm('2'));
        const left2 = new PrefixTerm('a', new MockProcessTerm('1'));
        const right2 = new PrefixTerm('b', new MockProcessTerm('2'));

        const parallelTerm1 = new ParallelTerm(left1, right1);
        const parallelTerm2 = new ParallelTerm(left2, right2);
        const parallelTerm3 = new ParallelTerm(right1, left1);

        expect(parallelTerm1.equals(parallelTerm2)).toBe(true);
        expect(parallelTerm1.equals(parallelTerm3)).toBe(false);
    });

    it('should generate correct string representation', () => {
        const left = new PrefixTerm('a', new MockProcessTerm('P'));
        const right = new PrefixTerm('b', new MockProcessTerm('Q'));
        const parallelTerm = new ParallelTerm(left, right);
        expect(parallelTerm.toString()).toBe('(a.MockProcessTerm(P) | b.MockProcessTerm(Q))');
    });

    it('should handle nested parallel compositions', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('2'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('3'));

        const inner = new ParallelTerm(p1, p2);
        const outer = new ParallelTerm(inner, p3);

        expect(outer.toString()).toBe('((a.MockProcessTerm(1) | b.MockProcessTerm(2)) | c.MockProcessTerm(3))');
    });

    it('should handle substitution in nested parallel terms', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('X'));

        const inner = new ParallelTerm(p1, p2);
        const outer = new ParallelTerm(inner, p3);

        const replacement = new MockProcessTerm('Z');
        const result = outer.substitute('X', replacement);

        expect(result instanceof ParallelTerm).toBe(true);
        const resultParallel = result as ParallelTerm;
        expect(resultParallel.getLeft() instanceof ParallelTerm).toBe(true);
        expect(resultParallel.getRight() instanceof PrefixTerm).toBe(true);
    });

    it('should derive empty transitions set (placeholder implementation)', () => {
        const left = new PrefixTerm('a', new MockProcessTerm());
        const right = new PrefixTerm('b', new MockProcessTerm());
        const parallelTerm = new ParallelTerm(left, right);

        const transitions = parallelTerm.derive();
        expect(transitions.size).toBe(0); // Current placeholder implementation
    });

    it('should handle parallel composition with identical processes', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('a', new MockProcessTerm('1'));
        const parallelTerm = new ParallelTerm(p1, p2);

        expect(parallelTerm.toString()).toBe('(a.MockProcessTerm(1) | a.MockProcessTerm(1))');
    });
});
