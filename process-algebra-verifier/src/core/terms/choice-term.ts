import { ProcessTerm } from '../process-term';
import { Transition } from '../lts';

export class ChoiceTerm implements ProcessTerm {
    constructor(
        private left: ProcessTerm,
        private right: ProcessTerm
    ) { }

    getLeft(): ProcessTerm {
        return this.left;
    }

    getRight(): ProcessTerm {
        return this.right;
    }

    substitute(variable: string, replacement: ProcessTerm): ProcessTerm {
        return new ChoiceTerm(
            this.left.substitute(variable, replacement),
            this.right.substitute(variable, replacement)
        );
    }

    derive(): Set<Transition> {
        const transitions = new Set<Transition>();
        const leftTransitions = this.left.derive();
        const rightTransitions = this.right.derive();

        leftTransitions.forEach(t => transitions.add(t));
        rightTransitions.forEach(t => transitions.add(t));

        return transitions;
    }

    equals(other: ProcessTerm): boolean {
        return other instanceof ChoiceTerm &&
            this.left.equals(other.getLeft()) &&
            this.right.equals(other.getRight());
    }

    toString(): string {
        return `(${this.left} + ${this.right})`;
    }
}
