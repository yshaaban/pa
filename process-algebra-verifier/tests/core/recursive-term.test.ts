import { describe, expect, it } from '@jest/globals';
import { RecursiveTerm, PrefixTerm } from '../../src/core/process-term';
import { MockProcessTerm } from './prefix-term.test';

describe('RecursiveTerm', () => {
    it('should create a recursive term with correct variable and definition', () => {
        const definition = new PrefixTerm('a', new MockProcessTerm());
        const recursiveTerm = new RecursiveTerm('X', definition);

        expect(recursiveTerm.getVariable()).toBe('X');
        expect(recursiveTerm.getDefinition()).toBe(definition);
    });

    it('should unfold recursive definition', () => {
        const definition = new PrefixTerm('a', new MockProcessTerm());
        const recursiveTerm = new RecursiveTerm('X', definition);

        const unfolded = recursiveTerm.unfold();
        expect(unfolded).toEqual(definition.substitute('X', recursiveTerm));
    });

    it('should derive transitions from unfolded definition', () => {
        const definition = new PrefixTerm('a', new MockProcessTerm());
        const recursiveTerm = new RecursiveTerm('X', definition);

        const transitions = recursiveTerm.derive();
        expect(transitions.size).toBe(1);

        const transition = Array.from(transitions)[0];
        expect(transition.action).toBe('a');
    });

    it('should handle nested recursive terms', () => {
        const innerDef = new PrefixTerm('a', new MockProcessTerm('X'));
        const innerRec = new RecursiveTerm('X', innerDef);
        const outerDef = new PrefixTerm('b', innerRec);
        const outerRec = new RecursiveTerm('Y', outerDef);

        const transitions = outerRec.derive();
        expect(transitions.size).toBe(1);
        expect(Array.from(transitions)[0].action).toBe('b');
    });

    it('should compare terms for equality', () => {
        const definition1 = new PrefixTerm('a', new MockProcessTerm('1'));
        const definition2 = new PrefixTerm('a', new MockProcessTerm('1'));
        const definition3 = new PrefixTerm('b', new MockProcessTerm('1'));

        const recursiveTerm1 = new RecursiveTerm('X', definition1);
        const recursiveTerm2 = new RecursiveTerm('X', definition2);
        const recursiveTerm3 = new RecursiveTerm('Y', definition1);
        const recursiveTerm4 = new RecursiveTerm('X', definition3);

        expect(recursiveTerm1.equals(recursiveTerm2)).toBe(true);
        expect(recursiveTerm1.equals(recursiveTerm3)).toBe(false);
        expect(recursiveTerm1.equals(recursiveTerm4)).toBe(false);
    });

    it('should generate correct string representation', () => {
        const definition = new PrefixTerm('a', new MockProcessTerm('X'));
        const recursiveTerm = new RecursiveTerm('X', definition);
        expect(recursiveTerm.toString()).toBe('rec X.a.MockProcessTerm(X)');
    });

    it('should handle substitution with variable shadowing', () => {
        const innerVar = new MockProcessTerm('Y');
        const definition = new PrefixTerm('a', innerVar);
        const recursiveTerm = new RecursiveTerm('Y', definition);

        const replacement = new MockProcessTerm('Z');
        const result = recursiveTerm.substitute('Y', replacement);

        // When substituting Y, we replace the entire recursive term
        // This is correct behavior for alpha-conversion
        expect(result).toEqual(replacement);
    });

    it('should handle multiple unfoldings', () => {
        const definition = new PrefixTerm('a', new MockProcessTerm('X'));
        const recursiveTerm = new RecursiveTerm('X', definition);

        const unfolded1 = recursiveTerm.unfold();
        const unfolded2 = unfolded1.substitute('X', recursiveTerm);

        expect(unfolded1 instanceof PrefixTerm).toBe(true);
        expect(unfolded2 instanceof PrefixTerm).toBe(true);
    });

    it('should handle recursive terms with multiple variables', () => {
        const varX = new MockProcessTerm('X');
        const definition = new PrefixTerm('a', varX);
        const recursiveTerm = new RecursiveTerm('X', definition);

        const replacementY = new MockProcessTerm('Z');
        const result = recursiveTerm.substitute('Y', replacementY);

        // Y is free, so substitution should occur in the definition
        expect(result instanceof RecursiveTerm).toBe(true);
        expect((result as RecursiveTerm).getVariable()).toBe('X');
    });
});
