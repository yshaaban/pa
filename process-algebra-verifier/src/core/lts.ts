// Core Labelled Transition System (LTS) Infrastructure

export type State = string;
export type Action = string;

export class Transition {
    constructor(
        public source: State,
        public action: Action,
        public target: State
    ) { }

    equals(other: Transition): boolean {
        return (
            this.source === other.source &&
            this.action === other.action &&
            this.target === other.target
        );
    }

    toString(): string {
        return `${this.source} --${this.action}--> ${this.target}`;
    }
}

export interface TransitionRelation {
    add(source: State, action: Action, target: State): void;
    getTransitions(state: State): Set<Transition>;
    getTargetStates(source: State, action: Action): Set<State>;
}

export interface LTS {
    states: Set<State>;
    actions: Set<Action>;
    transitions: TransitionRelation;
    initialState: State;
}

export class DefaultTransitionRelation implements TransitionRelation {
    private transitions: Map<State, Set<Transition>> = new Map();

    add(source: State, action: Action, target: State): void {
        const transition = new Transition(source, action, target);
        const sourceTransitions = this.transitions.get(source) || new Set();
        sourceTransitions.add(transition);
        this.transitions.set(source, sourceTransitions);
    }

    getTransitions(state: State): Set<Transition> {
        return this.transitions.get(state) || new Set();
    }

    getTargetStates(source: State, action: Action): Set<State> {
        const sourceTransitions = this.getTransitions(source);
        return new Set(
            Array.from(sourceTransitions)
                .filter(t => t.action === action)
                .map(t => t.target)
        );
    }
}
