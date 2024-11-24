import { ProcessTerm } from '../process-term';
import { Transition } from '../lts';

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
