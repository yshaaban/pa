import { describe, expect, it } from '@jest/globals';
import { ChoiceTerm, PrefixTerm } from '../../src/core/process-term';
import { MockProcessTerm } from './prefix-term.test';

describe('ChoiceTerm', () => {
    it('should create a choice term with correct left and right processes', () => {
        const left = new PrefixTerm('a', new MockProcessTerm());
        const right = new PrefixTerm('b', new MockProcessTerm());
        const choiceTerm = new ChoiceTerm(left, right);

        expect(choiceTerm.getLeft()).toBe(left);
        expect(choiceTerm.getRight()).toBe(right);
    });

    it('should derive transitions from both processes', () => {
        const left = new PrefixTerm('a', new MockProcessTerm());
        const right = new PrefixTerm('b', new MockProcessTerm());
        const choiceTerm = new ChoiceTerm(left, right);

        const transitions = choiceTerm.derive();
        expect(transitions.size).toBe(2);

        const actions = Array.from(transitions).map(t => t.action);
        expect(actions).toContain('a');
        expect(actions).toContain('b');
    });

    it('should compare terms for equality', () => {
        const left1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const right1 = new PrefixTerm('b', new MockProcessTerm('2'));
        const left2 = new PrefixTerm('a', new MockProcessTerm('1'));
        const right2 = new PrefixTerm('b', new MockProcessTerm('2'));

        const choiceTerm1 = new ChoiceTerm(left1, right1);
        const choiceTerm2 = new ChoiceTerm(left2, right2);
        const choiceTerm3 = new ChoiceTerm(right1, left1);

        expect(choiceTerm1.equals(choiceTerm2)).toBe(true);
        expect(choiceTerm1.equals(choiceTerm3)).toBe(false);
    });

    it('should handle nested choice terms', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('2'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('3'));

        const inner = new ChoiceTerm(p1, p2);
        const outer = new ChoiceTerm(inner, p3);

        const transitions = outer.derive();
        expect(transitions.size).toBe(3);

        const actions = Array.from(transitions).map(t => t.action);
        expect(actions).toContain('a');
        expect(actions).toContain('b');
        expect(actions).toContain('c');
    });

    it('should generate correct string representation', () => {
        const left = new PrefixTerm('a', new MockProcessTerm('P'));
        const right = new PrefixTerm('b', new MockProcessTerm('Q'));
        const choiceTerm = new ChoiceTerm(left, right);
        expect(choiceTerm.toString()).toBe('(a.MockProcessTerm(P) + b.MockProcessTerm(Q))');
    });

    it('should handle substitution in nested choices', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('X'));
        const p2 = new PrefixTerm('b', new MockProcessTerm('Y'));
        const p3 = new PrefixTerm('c', new MockProcessTerm('X'));

        const inner = new ChoiceTerm(p1, p2);
        const outer = new ChoiceTerm(inner, p3);

        const replacement = new MockProcessTerm('Z');
        const result = outer.substitute('X', replacement);

        expect(result instanceof ChoiceTerm).toBe(true);
        const resultChoice = result as ChoiceTerm;
        expect(resultChoice.getLeft() instanceof ChoiceTerm).toBe(true);
        expect(resultChoice.getRight() instanceof PrefixTerm).toBe(true);
    });

    it('should handle choice between identical processes', () => {
        const p1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const p2 = new PrefixTerm('a', new MockProcessTerm('1'));
        const choiceTerm = new ChoiceTerm(p1, p2);

        const transitions = choiceTerm.derive();
        expect(transitions.size).toBe(2); // Both transitions are preserved

        expect(choiceTerm.toString()).toBe('(a.MockProcessTerm(1) + a.MockProcessTerm(1))');
    });
});
