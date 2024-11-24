// Process Term Representation

import { Transition, Action } from './lts';

export interface ProcessTerm {
    substitute(variable: string, replacement: ProcessTerm): ProcessTerm;
    derive(): Set<Transition>;
    equals(other: ProcessTerm): boolean;
    toString(): string;
}

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
        // Simplified derivation - would need more context in a real implementation
        transitions.add(new Transition('initial', this.action, 'next'));
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
        const transitions = new Set<Transition>();
        // Placeholder for parallel composition rules
        // This would involve complex synchronization logic
        return transitions;
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

export class RecursiveTerm implements ProcessTerm {
    constructor(
        private variable: string,
        private definition: ProcessTerm
    ) { }

    getVariable(): string {
        return this.variable;
    }

    getDefinition(): ProcessTerm {
        return this.definition;
    }

    // Unfold the recursive definition by substituting the variable with its definition
    unfold(): ProcessTerm {
        return this.definition.substitute(this.variable, this);
    }

    substitute(variable: string, replacement: ProcessTerm): ProcessTerm {
        // If the substitution variable matches this term's variable, return the replacement
        if (variable === this.variable) {
            return replacement;
        }

        // Otherwise, substitute in the definition
        return new RecursiveTerm(
            this.variable,
            this.definition.substitute(variable, replacement)
        );
    }

    derive(): Set<Transition> {
        // Derive from the unfolded definition
        return this.unfold().derive();
    }

    equals(other: ProcessTerm): boolean {
        // Deep equality check by unfolding
        if (!(other instanceof RecursiveTerm)) return false;

        // Compare variables and definitions
        return this.variable === other.getVariable() &&
            this.definition.equals(other.getDefinition());
    }

    toString(): string {
        return `rec ${this.variable}.${this.definition}`;
    }
}
