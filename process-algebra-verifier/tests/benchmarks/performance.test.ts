import { describe, expect, it } from '@jest/globals';
import { ProcessTerm } from '../../src/core/process-term';
import { PrefixTerm } from '../../src/core/terms/prefix-term';
import { ChoiceTerm } from '../../src/core/terms/choice-term';
import { ParallelTerm } from '../../src/core/terms/parallel-term';
import { createDefaultCCSEngine } from '../../src/semantics/sos-engine';
import { MockProcessTerm } from '../core/prefix-term.test';

describe('Performance Benchmarks', () => {
    // Helper to measure execution time
    const measureTime = (fn: () => void): number => {
        const start = process.hrtime.bigint();
        fn();
        const end = process.hrtime.bigint();
        return Number(end - start) / 1_000_000; // Convert to milliseconds
    };

    describe('State Space Generation', () => {
        it('should handle large choice compositions efficiently', () => {
            // Create a large choice term with n branches
            const createLargeChoice = (n: number): ProcessTerm => {
                const terms: ProcessTerm[] = [];
                for (let i = 0; i < n; i++) {
                    terms.push(new PrefixTerm(`a${i}`, new MockProcessTerm(`${i}`)));
                }
                return terms.reduce((acc, term) => new ChoiceTerm(acc, term));
            };

            const sizes = [10, 50, 100];
            const times: number[] = [];

            for (const size of sizes) {
                const term = createLargeChoice(size);
                const engine = createDefaultCCSEngine();

                const time = measureTime(() => {
                    const transitions = engine.computeTransitions(term);
                    expect(transitions.size).toBe(size);
                });

                times.push(time);
                console.log(`Choice composition size ${size}: ${time.toFixed(2)}ms`);

                // Performance should scale roughly linearly
                if (times.length > 1) {
                    const ratio = time / times[times.length - 2];
                    expect(ratio).toBeLessThan(10); // Should not explode exponentially
                }
            }
        });

        it('should handle deep nested terms efficiently', () => {
            // Create a deeply nested prefix term chain
            const createDeepNesting = (depth: number): ProcessTerm => {
                let term: ProcessTerm = new MockProcessTerm('leaf');
                for (let i = depth; i > 0; i--) {
                    term = new PrefixTerm(`a${i}`, term);
                }
                return term;
            };

            const depths = [10, 50, 100];
            const times: number[] = [];

            for (const depth of depths) {
                const term = createDeepNesting(depth);
                const engine = createDefaultCCSEngine();

                const time = measureTime(() => {
                    const transitions = engine.computeTransitions(term);
                    expect(transitions.size).toBe(1); // Only one transition at each level
                });

                times.push(time);
                console.log(`Nesting depth ${depth}: ${time.toFixed(2)}ms`);

                // Performance should scale linearly with depth
                if (times.length > 1) {
                    const ratio = time / times[times.length - 2];
                    expect(ratio).toBeLessThan(10);
                }
            }
        });

        it('should handle parallel composition scaling', () => {
            // Create parallel composition of n processes
            const createParallelProcesses = (n: number): ProcessTerm => {
                const terms: ProcessTerm[] = [];
                for (let i = 0; i < n; i++) {
                    terms.push(new PrefixTerm(`a${i}`, new MockProcessTerm(`${i}`)));
                }
                return terms.reduce((acc, term) => new ParallelTerm(acc, term));
            };

            const sizes = [2, 4, 8];
            const times: number[] = [];

            for (const size of sizes) {
                const term = createParallelProcesses(size);
                const engine = createDefaultCCSEngine();

                const time = measureTime(() => {
                    const transitions = engine.computeTransitions(term);
                    expect(transitions.size).toBeGreaterThan(0);
                });

                times.push(time);
                console.log(`Parallel processes ${size}: ${time.toFixed(2)}ms`);

                // Performance might scale exponentially due to state space explosion
                // but should still be manageable for small numbers of processes
                if (times.length > 1) {
                    const ratio = time / times[times.length - 2];
                    expect(ratio).toBeLessThan(100); // Allow for exponential growth but not too extreme
                }
            }
        });
    });

    describe('Cache Effectiveness', () => {
        it('should benefit from transition caching', () => {
            // Create a term that will be analyzed multiple times
            const term = new ChoiceTerm(
                new PrefixTerm('a', new MockProcessTerm('1')),
                new PrefixTerm('b', new MockProcessTerm('2'))
            );
            const engine = createDefaultCCSEngine();

            // First computation - cold cache
            const coldTime = measureTime(() => {
                engine.computeTransitions(term);
            });

            // Second computation - warm cache
            const warmTime = measureTime(() => {
                engine.computeTransitions(term);
            });

            console.log(`Cold cache: ${coldTime.toFixed(2)}ms`);
            console.log(`Warm cache: ${warmTime.toFixed(2)}ms`);

            // Warm cache should be significantly faster
            expect(warmTime).toBeLessThan(coldTime);
        });
    });

    describe('Memory Usage', () => {
        it('should handle large state spaces without excessive memory', () => {
            // Create a term that generates a large state space
            const createLargeStateSpace = (): ProcessTerm => {
                const terms: ProcessTerm[] = [];
                for (let i = 0; i < 10; i++) {
                    const prefix = new PrefixTerm(`a${i}`, new MockProcessTerm(`${i}`));
                    const choice = new ChoiceTerm(prefix, new MockProcessTerm(`alt${i}`));
                    terms.push(choice);
                }
                return terms.reduce((acc, term) => new ParallelTerm(acc, term));
            };

            const term = createLargeStateSpace();
            const engine = createDefaultCCSEngine();

            const initialMemory = process.memoryUsage().heapUsed;

            const transitions = engine.computeTransitions(term);

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryDelta = (finalMemory - initialMemory) / 1024 / 1024; // MB

            console.log(`Memory usage: ${memoryDelta.toFixed(2)}MB`);
            console.log(`Generated transitions: ${transitions.size}`);

            // Memory usage should be reasonable
            expect(memoryDelta).toBeLessThan(100); // Less than 100MB
        });
    });
});
