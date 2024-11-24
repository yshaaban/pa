/**
 * Core Labelled Transition System (LTS) Infrastructure
 * 
 * This module provides the fundamental types and classes for representing
 * Labelled Transition Systems (LTS), which are the semantic foundation for
 * process algebras. An LTS consists of:
 * 
 * - States: Representing process configurations
 * - Actions: Representing possible behaviors (visible and internal)
 * - Transitions: Representing state changes through actions
 * 
 * The implementation supports:
 * - Efficient transition storage and lookup
 * - Bidirectional transition traversal
 * - Action complement handling for synchronization
 */

/**
 * Represents a state in the LTS.
 * States are identified by strings for simplicity and debugging.
 */
export type State = string;

/**
 * Represents an action that can be performed by a process.
 * Actions can be visible communications or internal (τ) actions.
 */
export type Action = string;

/**
 * Represents a transition in the LTS.
 * A transition consists of:
 * - source: The state before the transition
 * - action: The action that causes the transition
 * - target: The state after the transition
 */
export class Transition {
    /**
     * Creates a new transition.
     * @param source The source state
     * @param action The action performed
     * @param target The target state
     */
    constructor(
        public source: State,
        public action: Action,
        public target: State
    ) { }

    /**
     * Checks if this transition is equal to another transition.
     * Two transitions are equal if they have the same source state,
     * action, and target state.
     * 
     * @param other The transition to compare with
     * @returns true if the transitions are equal, false otherwise
     */
    equals(other: Transition): boolean {
        return (
            this.source === other.source &&
            this.action === other.action &&
            this.target === other.target
        );
    }

    /**
     * Returns a string representation of the transition.
     * Format: source --action--> target
     * 
     * @returns A string representation of the transition
     */
    toString(): string {
        return `${this.source} --${this.action}--> ${this.target}`;
    }
}

/**
 * Interface for managing transitions in an LTS.
 * Provides methods for adding transitions and querying the transition relation.
 */
export interface TransitionRelation {
    /**
     * Adds a new transition to the relation.
     * 
     * @param source The source state
     * @param action The action
     * @param target The target state
     */
    add(source: State, action: Action, target: State): void;

    /**
     * Gets all transitions originating from a given state.
     * 
     * @param state The state to get transitions for
     * @returns A set of all transitions from the state
     */
    getTransitions(state: State): Set<Transition>;

    /**
     * Gets all states reachable from a source state via a specific action.
     * 
     * @param source The source state
     * @param action The action to follow
     * @returns A set of reachable target states
     */
    getTargetStates(source: State, action: Action): Set<State>;
}

/**
 * Interface representing a complete Labelled Transition System.
 * Combines states, actions, transitions, and an initial state.
 */
export interface LTS {
    /** All states in the system */
    states: Set<State>;
    /** All possible actions */
    actions: Set<Action>;
    /** The transition relation */
    transitions: TransitionRelation;
    /** The initial state */
    initialState: State;
}

/**
 * Default implementation of TransitionRelation.
 * Uses a Map for efficient transition storage and lookup.
 */
export class DefaultTransitionRelation implements TransitionRelation {
    /** Maps source states to their outgoing transitions */
    private transitions: Map<State, Set<Transition>> = new Map();

    /**
     * Adds a new transition to the relation.
     * Creates a new transition object and stores it in the map.
     * 
     * @param source The source state
     * @param action The action
     * @param target The target state
     */
    add(source: State, action: Action, target: State): void {
        const transition = new Transition(source, action, target);
        const sourceTransitions = this.transitions.get(source) || new Set();
        sourceTransitions.add(transition);
        this.transitions.set(source, sourceTransitions);
    }

    /**
     * Gets all transitions originating from a given state.
     * Returns an empty set if the state has no outgoing transitions.
     * 
     * @param state The state to get transitions for
     * @returns A set of all transitions from the state
     */
    getTransitions(state: State): Set<Transition> {
        return this.transitions.get(state) || new Set();
    }

    /**
     * Gets all states reachable from a source state via a specific action.
     * Filters transitions by action and extracts target states.
     * 
     * @param source The source state
     * @param action The action to follow
     * @returns A set of reachable target states
     */
    getTargetStates(source: State, action: Action): Set<State> {
        const sourceTransitions = this.getTransitions(source);
        return new Set(
            Array.from(sourceTransitions)
                .filter(t => t.action === action)
                .map(t => t.target)
        );
    }
}
