import { ProcessTerm } from '../process-term';
import { Transition, Action } from '../lts';

export class PrefixTerm implements ProcessTerm {
    constructor(
        private action: Action,
        private continuation: ProcessTerm
    ) { }

    getAction(): Action {
        return this.action;
    }

    getContinuation(): ProcessTerm {
        return this.continuation;
    }

    substitute(variable: string, replacement: ProcessTerm): ProcessTerm {
        return new PrefixTerm(
            this.action,
            this.continuation.substitute(variable, replacement)
        );
    }

    derive(): Set<Transition> {
        const transitions = new Set<Transition>();
        transitions.add(new Transition(
            'initial',
            this.action,
            'next'  // Changed from 'continuation' to 'next'
        ));
        return transitions;
    }

    equals(other: ProcessTerm): boolean {
        return other instanceof PrefixTerm &&
            this.action === other.getAction() &&
            this.continuation.equals(other.getContinuation());
    }

    toString(): string {
        return `${this.action}.${this.continuation}`;
    }
}
