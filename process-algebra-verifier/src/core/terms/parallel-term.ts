import { ProcessTerm } from '../process-term';
import { Transition } from '../lts';

export class ParallelTerm implements ProcessTerm {
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
        return new ParallelTerm(
            this.left.substitute(variable, replacement),
            this.right.substitute(variable, replacement)
        );
    }

    derive(): Set<Transition> {
        // Placeholder implementation returning an empty set
        return new Set<Transition>();
    }

    equals(other: ProcessTerm): boolean {
        return other instanceof ParallelTerm &&
            this.left.equals(other.getLeft()) &&
            this.right.equals(other.getRight());
    }

    toString(): string {
        return `(${this.left} | ${this.right})`;
    }
}
