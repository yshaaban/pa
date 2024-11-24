/**
 * Represents the STOP process term, which is a process that cannot perform
 * any actions and represents successful termination.
 */

import { ProcessTerm } from '../process-term';
import { Transition } from '../lts';

export class StopTerm implements ProcessTerm {
    // Singleton instance since all STOP terms are equivalent
    private static instance: StopTerm;

    private constructor() { }

    /**
     * Gets the singleton instance of StopTerm
     */
    static get(): StopTerm {
        if (!StopTerm.instance) {
            StopTerm.instance = new StopTerm();
        }
        return StopTerm.instance;
    }

    /**
     * STOP cannot perform any transitions
     */
    derive(): Set<Transition> {
        return new Set<Transition>();
    }

    /**
     * Substitution has no effect on STOP
     */
    substitute(variable: string, replacement: ProcessTerm): ProcessTerm {
        return this;
    }

    /**
     * All STOP terms are equal
     */
    equals(other: ProcessTerm): boolean {
        return other instanceof StopTerm;
    }

    /**
     * String representation
     */
    toString(): string {
        return 'STOP';
    }
}
