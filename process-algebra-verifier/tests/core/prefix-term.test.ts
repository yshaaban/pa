import { describe, expect, it } from '@jest/globals';
import { PrefixTerm, ProcessTerm } from '../../src/core/process-term';
import { Transition } from '../../src/core/lts';

// Mock ProcessTerm for testing - shared across process term tests
export class MockProcessTerm implements ProcessTerm {
    constructor(private id: string = 'mock') { }
    substitute(variable: string, replacement: ProcessTerm): ProcessTerm {
        // Return replacement if this mock's id matches the variable
        return this.id === variable ? replacement : this;
    }
    derive(): Set<Transition> {
        return new Set();
    }
    equals(other: ProcessTerm): boolean {
        return other instanceof MockProcessTerm && this.id === (other as MockProcessTerm).id;
    }
    toString(): string {
        return `MockProcessTerm(${this.id})`;
    }
}

describe('PrefixTerm', () => {
    it('should create a prefix term with correct action and continuation', () => {
        const continuation = new PrefixTerm('b', new MockProcessTerm());
        const prefixTerm = new PrefixTerm('a', continuation);

        expect(prefixTerm.getAction()).toBe('a');
        expect(prefixTerm.getContinuation()).toBe(continuation);
    });

    it('should derive transitions', () => {
        const continuation = new MockProcessTerm();
        const prefixTerm = new PrefixTerm('a', continuation);
        const transitions = prefixTerm.derive();

        expect(transitions.size).toBe(1);
        const transition = Array.from(transitions)[0];
        expect(transition.source).toBe('initial');
        expect(transition.action).toBe('a');
        expect(transition.target).toBe('next');
    });

    it('should compare terms for equality', () => {
        const continuation1 = new PrefixTerm('b', new MockProcessTerm('1'));
        const continuation2 = new PrefixTerm('b', new MockProcessTerm('1'));
        const prefixTerm1 = new PrefixTerm('a', continuation1);
        const prefixTerm2 = new PrefixTerm('a', continuation2);
        const prefixTerm3 = new PrefixTerm('x', continuation1);

        expect(prefixTerm1.equals(prefixTerm2)).toBe(true);
        expect(prefixTerm1.equals(prefixTerm3)).toBe(false);
    });

    it('should handle substitution correctly', () => {
        const continuation = new MockProcessTerm('X');
        const prefixTerm = new PrefixTerm('a', continuation);
        const replacement = new MockProcessTerm('Y');

        const result = prefixTerm.substitute('X', replacement);
        expect(result instanceof PrefixTerm).toBe(true);
        expect((result as PrefixTerm).getAction()).toBe('a');
    });

    it('should generate correct string representation', () => {
        const continuation = new MockProcessTerm('P');
        const prefixTerm = new PrefixTerm('a', continuation);
        expect(prefixTerm.toString()).toBe('a.MockProcessTerm(P)');
    });

    it('should handle empty action', () => {
        const continuation = new MockProcessTerm();
        const prefixTerm = new PrefixTerm('', continuation);
        expect(prefixTerm.getAction()).toBe('');
        expect(prefixTerm.toString()).toBe('.MockProcessTerm(mock)');
    });

    it('should handle special characters in actions', () => {
        const continuation = new MockProcessTerm();
        const prefixTerm = new PrefixTerm('τ', continuation);
        expect(prefixTerm.getAction()).toBe('τ');
        expect(prefixTerm.toString()).toBe('τ.MockProcessTerm(mock)');
    });
});
