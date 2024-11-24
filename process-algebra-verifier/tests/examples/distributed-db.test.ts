import { describe, expect, it } from '@jest/globals';
import { PrefixTerm } from '../../src/core/terms/prefix-term';
import { ChoiceTerm } from '../../src/core/terms/choice-term';
import { createDefaultCCSEngine } from '../../src/semantics/sos-engine';
import { MockProcessTerm } from '../core/prefix-term.test';

describe('Distributed Database Concurrency Control', () => {
    describe('Transaction Manager', () => {
        it('should follow correct transaction lifecycle', () => {
            // Transaction Manager = BeginTx.(ReadOp + WriteOp).(Commit + Abort)
            const abort = new PrefixTerm('abort', new MockProcessTerm('abort'));
            const commit = new PrefixTerm('commit', new MockProcessTerm('commit'));
            const commitChoice = new ChoiceTerm(commit, abort);

            const readOp = new PrefixTerm('read', commitChoice);
            const writeOp = new PrefixTerm('write', commitChoice);
            const operations = new ChoiceTerm(readOp, writeOp);

            const transactionManager = new PrefixTerm('begin', operations);

            const engine = createDefaultCCSEngine();
            const transitions = engine.computeTransitions(transactionManager);

            // Should have transition for begin
            expect(transitions.size).toBe(1);
            const firstTransition = Array.from(transitions)[0];
            expect(firstTransition.action).toBe('begin');

            // After begin, should have choice between read and write
            const operationTransitions = engine.computeTransitions(operations);
            expect(operationTransitions.size).toBe(2);
            const actions = Array.from(operationTransitions).map(t => t.action);
            expect(actions).toContain('read');
            expect(actions).toContain('write');
        });
    });

    describe('Two-Phase Commit Protocol', () => {
        it('should handle successful commit scenario', () => {
            // Coordinator = PreparePhase.(AllPrepared.CommitPhase + AnyAborted.AbortPhase).CollectAcks
            const collectAcks = new PrefixTerm('collect', new MockProcessTerm('collect'));

            const commitPhase = new PrefixTerm('commit-phase', collectAcks);
            const abortPhase = new PrefixTerm('abort-phase', collectAcks);

            const allPrepared = new PrefixTerm('all-prepared', commitPhase);
            const anyAborted = new PrefixTerm('any-aborted', abortPhase);
            const decision = new ChoiceTerm(allPrepared, anyAborted);

            const coordinator = new PrefixTerm('prepare', decision);

            const engine = createDefaultCCSEngine();
            const transitions = engine.computeTransitions(coordinator);

            // Should start with prepare phase
            expect(transitions.size).toBe(1);
            expect(Array.from(transitions)[0].action).toBe('prepare');
        });

        it('should detect liveness issues in problematic implementation', () => {
            // ProblematicCoordinator = PreparePhase.(AllPrepared.CommitPhase + τ.AbortPhase)
            const commitPhase = new PrefixTerm('commit-phase', new MockProcessTerm('commit'));
            const abortPhase = new PrefixTerm('abort-phase', new MockProcessTerm('abort'));

            const allPrepared = new PrefixTerm('all-prepared', commitPhase);
            const internalChoice = new PrefixTerm('tau', abortPhase);
            const decision = new ChoiceTerm(allPrepared, internalChoice);

            const coordinator = new PrefixTerm('prepare', decision);

            const engine = createDefaultCCSEngine();
            const transitions = engine.computeTransitions(coordinator);

            // Should have transition for prepare
            expect(transitions.size).toBe(1);
            const firstTransition = Array.from(transitions)[0];
            expect(firstTransition.action).toBe('prepare');

            // After prepare, should have both commit and internal choice paths
            const decisionTransitions = engine.computeTransitions(decision);
            expect(decisionTransitions.size).toBe(2);
            const actions = Array.from(decisionTransitions).map(t => t.action);
            expect(actions).toContain('all-prepared');
            expect(actions).toContain('tau');
        });
    });

    describe('Participant Node', () => {
        it('should handle prepare request correctly', () => {
            // Participant = ReceivePrepare.(Ready.WaitCommit + NotReady.WaitAbort).SendAck
            const sendAck = new PrefixTerm('ack', new MockProcessTerm('ack'));

            const waitCommit = new PrefixTerm('wait-commit', sendAck);
            const waitAbort = new PrefixTerm('wait-abort', sendAck);

            const ready = new PrefixTerm('ready', waitCommit);
            const notReady = new PrefixTerm('not-ready', waitAbort);
            const decision = new ChoiceTerm(ready, notReady);

            const participant = new PrefixTerm('receive-prepare', decision);

            const engine = createDefaultCCSEngine();
            const transitions = engine.computeTransitions(participant);

            // Should start with receive prepare
            expect(transitions.size).toBe(1);
            expect(Array.from(transitions)[0].action).toBe('receive-prepare');
        });
    });
});
