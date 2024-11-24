import { describe, expect, it } from '@jest/globals';
import { Transition } from '../../src/core/lts';

describe('Transition', () => {
    it('should create a transition', () => {
        const transition = new Transition('S0', 'a', 'S1');
        expect(transition.source).toBe('S0');
        expect(transition.action).toBe('a');
        expect(transition.target).toBe('S1');
    });

    it('should compare transitions for equality', () => {
        const transition1 = new Transition('S0', 'a', 'S1');
        const transition2 = new Transition('S0', 'a', 'S1');
        const transition3 = new Transition('S0', 'b', 'S2');

        expect(transition1.equals(transition2)).toBe(true);
        expect(transition1.equals(transition3)).toBe(false);
    });

    it('should generate string representation', () => {
        const transition = new Transition('S0', 'a', 'S1');
        expect(transition.toString()).toBe('S0 --a--> S1');
    });

    it('should handle special characters in labels', () => {
        const transition = new Transition('State1', 'τ', 'State2');
        expect(transition.toString()).toBe('State1 --τ--> State2');
    });
});
