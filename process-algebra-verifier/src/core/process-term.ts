// Process Term Interface and Exports
import { Transition } from './lts';

export interface ProcessTerm {
    substitute(variable: string, replacement: ProcessTerm): ProcessTerm;
    derive(): Set<Transition>;
    equals(other: ProcessTerm): boolean;
    toString(): string;
}

export { PrefixTerm } from './terms/prefix-term';
export { ChoiceTerm } from './terms/choice-term';
export { ParallelTerm } from './terms/parallel-term';
export { RecursiveTerm } from './terms/recursive-term';
