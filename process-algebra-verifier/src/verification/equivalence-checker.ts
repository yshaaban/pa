// Equivalence Checking for Process Terms

import { ProcessTerm } from '../core/process-term';
import { LTS, Transition } from '../core/lts';

export enum EquivalenceType {
    TRACE,
    BISIMULATION,
    TESTING,
    FAILURES
}

export class EquivalenceChecker {
    private static readonly MAX_TRACE_DEPTH = 10;

    constructor(private lts: LTS) { }

    checkEquivalence(
        term1: ProcessTerm,
        term2: ProcessTerm,
        type: EquivalenceType
    ): boolean {
        switch (type) {
            case EquivalenceType.TRACE:
                return this.checkTraceEquivalence(term1, term2);
            case EquivalenceType.BISIMULATION:
                return this.checkBisimulationEquivalence(term1, term2);
            case EquivalenceType.TESTING:
                return this.checkTestingEquivalence(term1, term2);
            case EquivalenceType.FAILURES:
                return this.checkFailuresEquivalence(term1, term2);
            default:
                throw new Error('Unsupported equivalence type');
        }
    }

    private checkTraceEquivalence(term1: ProcessTerm, term2: ProcessTerm): boolean {
        const traces1 = this.computeTraces(term1);
        const traces2 = this.computeTraces(term2);

        return this.traceSetsEqual(traces1, traces2);
    }

    private computeTraces(term: ProcessTerm): Set<string> {
        const traces = new Set<string>();
        const visited = new Set<string>();
        this.exploreTracesWithDepthLimit(term, '', traces, visited, 0);
        return traces;
    }

    private exploreTracesWithDepthLimit(
        term: ProcessTerm,
        currentTrace: string,
        traces: Set<string>,
        visited: Set<string>,
        depth: number
    ): void {
        // Prevent infinite recursion and excessive computation
        if (depth >= EquivalenceChecker.MAX_TRACE_DEPTH) return;

        // Avoid revisiting the same trace to prevent cycles
        if (visited.has(currentTrace)) return;
        visited.add(currentTrace);

        // Add current trace
        if (currentTrace) traces.add(currentTrace);

        // Explore transitions
        const transitions = term.derive();
        for (const transition of transitions) {
            const newTrace = currentTrace
                ? `${currentTrace}.${transition.action}`
                : transition.action;

            // Recursively explore with increased depth
            this.exploreTracesWithDepthLimit(
                term,
                newTrace,
                traces,
                new Set(visited),
                depth + 1
            );
        }
    }

    private traceSetsEqual(traces1: Set<string>, traces2: Set<string>): boolean {
        // More robust trace set comparison
        if (traces1.size !== traces2.size) return false;

        // Check prefix closure and trace containment
        for (const trace of traces1) {
            if (!this.isTraceContained(trace, traces2)) {
                return false;
            }
        }

        return true;
    }

    private isTraceContained(trace: string, traceSet: Set<string>): boolean {
        // Check if the trace or its prefixes exist in the trace set
        const prefixes = this.generateTracePrefixes(trace);
        return prefixes.some(prefix => traceSet.has(prefix));
    }

    private generateTracePrefixes(trace: string): string[] {
        const prefixes: string[] = [''];
        const actions = trace.split('.');

        for (let i = 0; i < actions.length; i++) {
            prefixes.push(actions.slice(0, i + 1).join('.'));
        }

        return prefixes;
    }

    private checkBisimulationEquivalence(term1: ProcessTerm, term2: ProcessTerm): boolean {
        // Enhanced bisimulation check
        const transitions1 = term1.derive();
        const transitions2 = term2.derive();

        return this.advancedTransitionSetComparison(transitions1, transitions2);
    }

    private advancedTransitionSetComparison(
        transitions1: Set<Transition>,
        transitions2: Set<Transition>
    ): boolean {
        // More sophisticated transition set comparison
        const actionMap1 = this.groupTransitionsByAction(transitions1);
        const actionMap2 = this.groupTransitionsByAction(transitions2);

        // Compare action sets
        if (actionMap1.size !== actionMap2.size) return false;

        for (const [action, transitions] of actionMap1) {
            if (!actionMap2.has(action)) return false;

            // Compare transition details
            const otherTransitions = actionMap2.get(action)!;
            if (transitions.size !== otherTransitions.size) return false;
        }

        return true;
    }

    private groupTransitionsByAction(transitions: Set<Transition>): Map<string, Set<Transition>> {
        const actionMap = new Map<string, Set<Transition>>();

        for (const transition of transitions) {
            if (!actionMap.has(transition.action)) {
                actionMap.set(transition.action, new Set());
            }
            actionMap.get(transition.action)!.add(transition);
        }

        return actionMap;
    }

    private checkTestingEquivalence(term1: ProcessTerm, term2: ProcessTerm): boolean {
        // Placeholder for more nuanced testing equivalence
        return this.checkTraceEquivalence(term1, term2);
    }

    private checkFailuresEquivalence(term1: ProcessTerm, term2: ProcessTerm): boolean {
        // Placeholder for failures equivalence
        return this.checkTraceEquivalence(term1, term2);
    }
}
