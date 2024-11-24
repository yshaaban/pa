# A gentle introduction to Process Algebras?

```
Rocco De Nicola
IMT - Institute for Advanced Studies Lucca
Piazza S. Ponziano, 6 - I-55100 Lucca - Italy
rocco.denicola@imtlucca.it
```

ABSTRACT:Process Algebras are mathematically rigorous languages with well defined
semantics that permit describing and verifying properties of concurrent communicating
systems. They can be seen as models of processes, regarded as agents that act and in-
teract continuously with other similar agents and with their common environment. The
agents may be real-world objects (even people), or they may be artifacts, embodied per-
haps in computer hardware or software systems. Many different approaches (operational,
denotational, algebraic) are taken for describing the meaning of processes. However, the
operational approach is the reference one. By relying on the so called Structural Opera-
tional Semantics (SOS), labelled transition systems are built and composed by using the
different operators of the many different process algebras.
Behavioral equivalences are used to abstract from unwanted details and identify those
labelled transition systems that react “similarly” to external experiments. Due to the large
number of properties which may be relevant in the analysis of concurrent systems, many
different theories of equivalences have been proposed in the literature. The main con-
tenders consider those systems equivalent that (i) perform the same sequences of actions,
or (ii) perform the same sequences of actions and after each sequence are ready to accept
the same sets of actions, or (iii) perform the same sequences of actions and after each
sequence exhibit, recursively, the same behavior. This approach leads to many different
equivalences that preserve significantly different properties of systems.

```
?This notes have been obtained by restructuring two entries (Process Algebras - Behavioural Equivalences) ofEn-
cyclopedia of Parallel Computing, David A. Padua (Ed.). Springer 2011; pp. 120-127 and pp. 1624-1636. ISBN
978-0-387-09765-
```

## Table of Contents

- A gentle introduction to Process Algebras.
- 1 Introduction Rocco De Nicola
- 2 Process Operators and Operational Semantics
- 3 Behavioral Equivalences
  - 3.1 Traces Equivalence
  - 3.2 Bisimulation Equivalence
  - 3.3 Testing Equivalence
  - 3.4 Hierarchy of Equivalences
  - 3.5 Weak Variants of the Equivalences
  - 3.6 Hierarchy of Weak Equivalences
- 4 Three Process Algebras: CCS, CSP and ACP
  - 4.1 CCS: Calculus of Communicating Systems
  - 4.2 CSP: A Theory of Communicating Sequential Processes
  - 4.3 ACP: An Algebra of Communicating Processes
- 5 Future Directions
- 6 Relationship to Other Models of Concurrency
- 7 Bibliographic Notes and Further Reading

## 1 Introduction

The goal of software verification is to assure that developed programs fully satisfy all
the expected requirements. Providing a formal semantics of programming languages is an
essential step toward program verification. This activity has received much attention in
the last 40 years. At the beginning the interest was mainly on sequential programs, then it
turned also on concurrent program that can lead to subtle errors in very critical activities.
Indeed, most computing systems today are concurrent and interactive.

Classically, the semantics of a sequential program has been defined as a function spec-
ifying the induced input-output transformations. This setting becomes, however, much
more complex when concurrent programs are considered, because they exhibit nonde-
terministic behaviors. Nondeterminism arises from programs interaction and cannot be
avoided. At least, not without sacrificing expressive power. Failures do matter, and choos-
ing the wrong branch might result in an “undesirable situation”. Backtracking is usually
not applicable, because the control might be distributed. Controlling nondeterminism is
very important. In sequential programming, it is just a matter of efficiency, in concurrent
programming it is a matter of avoiding getting stuck in a wrong situation.

The approach based on process algebras has been very successful in providing formal
semantics of concurrent systems and proving their properties. The success is witnessed
by the Turing Award given to two of their pioneers and founding fathers: Tony Hoare
and Robin Milner. Process algebras are mathematical models of processes, regarded as
agents that act and interact continuously with other similar agents and with their common
environment. Process algebras provide a number of constructors for system descriptions
and are equipped with an operational semantics that describes systems evolution in terms
of labelled transitions. Models and semantics are built by taking a compositional approach
that permits describing the “meaning” of composite systems in terms of the meaning of
their components.
Moreover, process algebras often come equipped with observational mechanisms that
permit identifying (through behavioral equivalences) those systems that cannot be taken
apart by external observations (experimentsortests). In some cases, process algebras have
also algebraic characterizations in terms of equational axiom systems that exactly capture
the relevant identifications induced by the beavioral operational semantics.
The basic component of a process algebra is its syntax as determined by the well-
formed combination of operators and more elementary terms. The syntax of a process
algebra is the set of rules that define the combinations of symbols that are considered
to be correctly structured programs in that language. There are many approaches to pro-

viding a rigorous mathematical understanding of the semantics of syntactically correct
process terms. The main ones are those also used for describing the semantics of sequen-
tial systems, namely operational, denotational and algebraic semantics.
Anoperational semanticsmodels a program as a labelled transition system (LTS) that
consists of a set of states, a set of transition labels and a transition relation. The states
of the transition system are just process algebra terms while the labels of the transitions
between states represent the actions or the interactions that are possible from a given
state and the state that is reached after the action is performed by means of visible and
invisible actions. The operational semantics, as the name suggests, is relatively close to an
abstract machine-based view of computation and might be considered as a mathematical
formalization of some implementation strategy.
Adenotational semanticsmaps a language to some abstract model such that the mean-
ing/denotation (in the model) of any composite program is determinable directly from the
meanings/denotations of its subcomponents. Usually, denotational semantics attempt to
distance themselves from any specific implementation strategy, describing the language
at a level intended to capture the “essential meaning” of a term.
Analgebraic semanticsis defined by a set of algebraic laws which implicitly capture
the intended semantics of the constructs of the language under consideration. Instead of
being derived theorems (as they would be in a denotational semantics or operational se-
mantics), the laws are the basic axioms of an equational system, and process equivalence
is defined in terms of what equalities can be proved using them. In some ways it is rea-
sonable to regard an algebraic semantics as the most abstract kind of description of the
semantics of a language.
There has been a huge amount of research work on process algebras carried out during
the last 30 years that started with the introduction of CCS [34, 35], CSP [11] and ACP [6].
In spite of the many conceptual similarities, these process algebras have been developed
starting from quite different viewpoints and have given rise to different approaches (for
an overview see, e.g. [2]).
CCStakes the operational viewpoint as its cornerstone and abstracts from unwanted
details introduced by the operational description by taking advantage of behavioral equiv-
alences that allow one to identify those systems that are indistinguishable according to
some observation criteria. The meaning of a CCS term is a labeled transition system
factored by a notion of observational equivalence.CSPoriginated as the theoretical ver-
sion of a practical language for concurrency and is still based on an operational intuition
which, however, is interpreted w.r.t. a more abstract theory of decorated traces that model
how systems react to external stimuli. The meaning of a CSP term is the set of possible

runs enriched with information about the interactions that could be refused at intermedi-
ate steps of each run.ACPstarted from a completely different viewpoint and provided
a purely algebraic view of concurrent systems: processes are the solutions of systems of
equations (axioms) over the signature of the considered algebra. Operational semantics
and behavioral equivalences are seen as possible models over which the algebra can be
defined and the axioms can be applied. The meaning of a term is given via a predefined
set of equations and is the collection of terms that are provably equal to it.

At first, the different algebras have been developed independently. Slowly, however,
their close relationships have been understood and appreciated, and now a general theory
can be provided and the different formalisms (CCS, CSP, ACP, etc. .) can be seen just
as instances of the general approach. In this general approach, the main ingredients of a
specific process algebra are:

1. A minimal set of carefully chosen operators capturing the relevant aspect of systems
   behavior and the way systems are composed in building process terms;
2. A transition system associated with each term via structuraloperational semanticsto
   describe the evolution of all processes that can be built from the operators;
3. An equivalence notion that allow one to abstract from irrelevant details of systems
   descriptions.

Verification of concurrent system within the process algebraic approach is carried out
either by resorting to behavioral equivalences for proving conformance of processes to
specifications or by checking that processes enjoy properties described by some tempo-
ral logic formulae [31, 14]. In the former case, two descriptions of a given system, one
very detailed and close to the actual concurrent implementation, the other more abstract
(describing the sequences or trees of relevant actions the system has to perform) are pro-
vided and tested for equivalence. In the latter case, concurrent systems are specified as
process terms while properties are specified as temporal logic formulae and model check-
ing is used to determine whether the transition systems associated with terms enjoy the
property specified by the formulae.

In the next section, many of the different operators used in process algebras will be
described. By relying on the so called structural operational semantic (SOS) approach
[40], it will be shown how labelled transition systems can be built and composed by
using the different operators. Afterward, many behavioral equivalences will be introduced
together with a discussion on the induced identifications and distinctions. Next, the three
most popular process algebras will be described; for each of them a different approach

(operational, denotational, algebraic) will be used. It will, however, be argued that in all
cases the operational semantics plays a central role.ˆ

## 2 Process Operators and Operational Semantics

To define a process calculus, one starts with a set of uninterpreted action names (that
might represent communication channels, synchronization actions, etc.) and with a set of
basic processes that together with the actions are the building blocks for forming newer
processes from existing ones. The operators are used for describing sequential, nonde-
terministic or parallel compositions of processes, for abstracting from internal details of
process behaviors and, finally, for defining infinite behaviors starting from finite presenta-
tions. The operational semantics of the different operators is inductively specified through
SOS rules: for each operator there is a set of rules describing the behavior of a system
in terms of the behaviors of its components. As a result, each process term is seen as a
component that can interact with other components or with the external environment.
In the rest of this section, most of the operators that have been used in some of the best
known process algebras will be presented with the aim of showing the wealth of choices
that one has when deciding how to describe a concurrent system or even when defining
one’s “personal” process algebra. A new calculus can, indeed, be obtained by a careful
selection of the operators while taking into account their interrelationships with respect
to the chosen abstract view of process and thus of the behavioral equivalence one has in
mind.
A set of operators is the basis for building process terms. A labelled transition system
(LTS) is associated to each term by relying on structural induction by providing specific
rules in correspondence of each operator. Formally speaking, an LTS is a set of nodes
(corresponding to process terms) and (for each actionain some set) a relation −→a
between nodes, corresponding to processes transitions. Often LTSs have a distinguished
noden 0 that is the one where computations start from; when defining the semantics of
a process term the state corresponding to that term is considered as the start state. To
associate an LTS to a process term inference systems are used.

Inference Systems An inference system is a set of inference rule of the form:

```
p 1 ,···,pn
q
```

wherep 1 ,···,pnare thepremisesanqis theconclusion. Each rule is interpreted as an
implication: if all premises are true then also the conclusion is true. Sometimes, rules are

decorated with predicates and/or negative premises that specify when the rule is actually
appliable.
A rule with an empty set of premises is calledaxiomand written as:

```
q
```

Transition Rules In the case of operational semantics the premises and the conclusions
will be triples of the formP−→α Qand thus the rules for each operatoro pof the process
algebras will be alike the one below, where{i 1 ,···,im} ⊆ { 1 ,···,n}andEi′=Eiwhen
i<{i 1 ,···,im}. Languages are assigned a clear behaviour in terms of states and transitions,
where the collection of transitions is specified by means of a set of syntax-driven inference
rules.

```
Ei 1 −→α^1 E′i 1 ··· Eim−→αm Ei′m
o p(E 1 ,···,En)−→αC[E′ 1 ,···,E′n]
```

In the rule above the target termC[ ] indicates the new context in which the new subterms
will be operating after the reduction. Sometimes, these rules are enriched with side condi-
tions that determine their applicability. By imposing syntactic constraints on the form of
the allowed rules,rule formatsare obtained that can be used to establish results that hold
for all process calculi whose transition rules respect the specific rule format.
Few SOS inference rules are sufficient to associate an LTS to each term of any process
algebra. The set of rules is fixed once and for all. Given any process, the rules are used
to derive its transitions. The transition relation of the LTS is theleastone satisfying the
inference rules. It is worth remarking thatstructural inductionallows one to define the
LTS of complex systems in terms of the behavior of their components.

Basic ActionsAn elementary action of a system represents theatomic(non-interruptible)
abstract step of a computation that is performed by a system to move from one state
to the next. Actions represent various activities of concurrent systems, like sending or
receiving a message, updating a memory cell, synchronizing with other processes,....
In process algebras two main types of atomic actions are considered, namelyvisibleor
external actions and invisible orinternalactions. In the sequel, visible actions will be
referred by latin lettersa,b,c,..., invisible actions will be referred by the Greek letter
τ. Generic actions will be referred byμor other, possibly indexed, Greek letters. In the
following,Awill be used to denote the set of visible actions whileAτwill denote the
collection of generic actions.

Basic processes Process algebras generally also include a null process (variously denoted
asnil, 0, sto p) which has no transition. It is inactive and its sole purpose is to act as
the inductive anchor on top of which more interesting processes can be generated. The
semantics of this process is characterized by the fact that there is no rule to define its
transition: it has no transition.
Other basic processes are also used:sto pdenotes a deadlocked state,√denotes, in-
stead, successful termination.

```
√−→√ sto p
```

```
Sometimes, uninterpreted actionsμare considered basic processes themselves:
```

```
μ
```

```
μ
−→√
```

Sequential composition Operators for sequential composition are used to temporally or-
der processes execution and interaction. There are two main operators for this purposes.
The first one isaction prefixing,μ·−, that denotes a process that executes actionμand
then behaves like the following process.

```
μ.E
```

```
μ
−−→E
```

The alternative form of sequential composition is obtained by explicitly requiringpro-
cess sequentialization,−;−, that requires that the first operand process be fully executed
before the second one.

```
E
```

```
μ
−→E′
E;F−→μ E′;F
```

```
(μ,√) E
```

```
√
−→E′ F
```

```
μ
−→F′
E;F
```

```
μ
−→F′
```

Nondeterministic composition The operators for nondeterministic choice are used to ex-
press alternatives among possible behaviors. This choice can be left to the environment
(external choice) or performed by the process (internal choice) or can be mainly external
but leaving the possibility to the process to perform internal move to prevent some of the
choices by the environment (mixed choice).
The rules for mixed choice are the ones below. They offer both visible and invisible
actions to the environment; however, only the former kind of actions can be actually
controlled.

```
E
```

```
μ
−→E′
E+F−→μ E′
```

#### F

```
μ
−→F′
E+F−→μ F′
```

The rules for internal choice are very simple, they are just two axioms stating that a
processE⊕Fcan silently evolve into one of its subcomponents.

E⊕F−→τ E E⊕F−→τ F
The rules for external choice are more articulate. This operator behaves exactly like
the mixed choice in case one of the components executes a visible action, however, it does
not discard any alternative upon execution of an invisible action.

```
E−→α E′
EF−→α E′
```

```
(α,τ) F
−→α F′
EF−→α F′
```

```
(α,τ)
```

```
E−→τ E′
EF−→τ E′F
```

```
F−→τ F′
EF−→τ EF′
```

Parallel composition Parallel composition of two processes, sayE andF, is the key
primitive distinguishing process algebras from sequential models of computation. Par-
allel composition allows computation inEandFto proceed simultaneously and inde-
pendently. But it also allows interaction, that is synchronization and flow of information
betweenEtoFon a shared channel. Channels may be synchronous or asynchronous. In
the case of synchronous channels, the agent sending a message waits until another agent
has received the message. Asynchronous channels do not force the sender to wait. Here,
only synchronous channels will be considered.
The simplest operator for parallel composition is theinterleavingone, -|||-, that aims
at modeling the fact that two parallel processes can progress by alternating at any rate the
execution of their actions. This is the parallel composition used in CCS.

```
E
```

```
μ
−→E′
E|||F
```

```
μ
−→E′|||F
```

#### F

```
μ
−→F′
E|||F
```

μ
−→E|||F′
Another parallel operator is thebinary parallel compositionoperator, -|-, that not
only models the interleaved execution of the actions of two parallel processes but also
the possibility that the two partners synchronize whenever they are willing to perform
complementary visible actions (below represented asaanda). In this case the visible
outcome is aτaction that cannot be seen by other processes that are acting in parallel to
the two communication partners.

```
E
```

```
μ
−→E′
E|F−→μ E′|F
```

#### F

```
μ
−→F′
E|F−→μ E|F′
```

```
E−→α E′ F−→α F′
E|F−→τ E′|F′
```

```
(α,τ)
```

Instead of binary synchronization some process algebras, like CSP, make use of opera-
tors that permitmultiparty synchronization, -|[L]|-. Some actions, those inL, are deemed
to be synchronization actions and can be performed by a process only if all its parallel
components can execute those actions at the same time.

#### E

```
μ
−→E′
E|[L]|F−→μ E′|[L]|F
```

```
(μ<L) F
```

```
μ
−→F′
E|[L]|F−→μ E|[L]|F′
```

```
(μ<L)
```

```
E−→a E′ F−→a F′
E|[L]|F−→a E′|[L]|F′
```

```
(a∈L)
```

It is worth noting that the result of a synchronization, in this case, yields a visible ac-
tion and that by setting the synchronization alphabet to∅the multiparty synchronization
operator|∅|can be used to obtain pure interleaving,|||.
A more general composition is themergeoperator,−‖−that is used in ACP. It permits
executing two process terms in parallel (thus freely interleaving their actions), but also
allows for communication between its process arguments according to acommunication
functionγ : A×A−→A, that, for each pair of atomic actionsaandb, produces the
outcome of their communicationγ(a,b), a partial function that states which actions can
be synchronized and the outcome of such a synchronization.

```
E
```

```
μ
−→E′
E‖F−→μ E′‖F
```

#### F

```
μ
−→F′
E‖F−→μ E‖F′
```

#### E

```
a
−→E′ F
```

```
b
−→F′
```

```
E‖F
```

```
γ(a,b)
−−−→E′‖F′
```

ACP has also another operator calledleft merge, -T-, that is similar to‖but requires
that the first process to perform an (independent) action be the left operand.

```
E
```

```
μ
−→E′
ETF
```

μ
−→E′‖F
The ACPcommunication merge, -|c-, requires instead that the first action be a syn-
chronization action.
E−→a E′ F−→b F′

```
E|cF
```

```
γ(a,b)
−−−→E′‖F′
```

Disruption An operator that is in between parallel and nondeterministic composition
is the so calleddisablingoperator,−[>−, that permits interrupting the evolution of a

process. Intuitively,E[>Fbehaves likeE, but can be interrupted at any time byF, once
EterminatesFis discarded.

#### E

```
μ
−→E′
E[>F−→μ E′[>F
```

```
(μ,√) E
```

```
√
−→E′
E[>F−→τ E′
```

#### F

```
μ
−→F′
E[>F−→μ F′
```

Value Passing The above parallel combinators can be generalized to model not only
synchronization but also exchange of values. As an example, below, the generalization
of binary communication is presented.
There are complementary rules for sending and receiving values. The first axiom mod-
els a process is willing to input a value and to base its future evolutions also on it. The
second axioms models a process that evaluate an expression (via the valuation function
val(e)) and output the result.

(v is a value)
a(x).E−−→a(v) E{v/x} a e.E−−−−−→a val(e) E
The next rule, instead, models synchronization between processes. If two processes,
one willing to output and the other willing to output, are run in parallel, a synchronization
can take place and the exhibited action will just be aτ-action.

```
E−−→a v E′ F
```

```
a(v)
−−→F′
E|F−→τ E′|F′
```

#### E

```
a(v)
−−→E′ F−−→a v F′
E|F−→τ E′|F′
```

In case the exchanged values are channels, this approach can be used to provide also
models for mobile systems.

AbstractionProcesses do not limit the number of connections that can be made at a given
interaction point. But interaction points allow interference. For the synthesis of compact,
minimal and compositional systems, the ability to restrict interference is crucial.
Thehidingoperator,−/L, hides (i.e., transforms them intoτ’s) all actions inLto
forbid synchronization on them. It, however, allows the system to perform the transitions
labelled by hidden actions.

```
E
```

```
μ
−→E′
E/L
```

```
μ
−→E′/L
```

```
(μ< L) E
```

```
μ
−→E′
E/L−→τ E′/L
```

```
(μ∈ L)
```

Therestrictionoperator,−\Lis a unary operator that restricts the set of visible actions
a process can perform. Thus, processE\Lcan perform only actions not inL. Obviously,

invisible actions cannot be restricted.

```
E
```

```
μ
−→E′
E\L−→μ E′\L
```

```
(μ ,μ < L)
```

The operator [f], wherefis arelabellingfunction fromAtoA, can be used to rename
some of the actions a process can perform to make it compatible with new environments.

```
E−→a E′
```

```
E[f]
```

```
f(a)
−−→ E′[f]
```

Modelling infinite behaviours The operations presented so far describe only finite inter-
action and are consequently insufficient for provide full computational power, in the sense
of being able to model all computable functions. In order to have this, one certainly needs
operators for modeling non-terminating behavior. Many operators have been introduced
that allow finite descriptions of infinite behavior. It is however important to to remark
that most of them do not fit the formats used so far and cannot be defined by structural
induction.
One of the most used is therec x.−construct, well-known from the sequential world.
IfEis a process that contains the variablex, thenrec x.Erepresents the process that
behaves likeEonce all occurrences ofxinEare replaced byrec x.E. In the rule below,
that models the operational behaviour of a recursively defined process, the termE[F/x]
denotes exactly the above mentioned substitutions.

```
E[rec x.E/x]−→μ E′
rec x.E
```

μ
−→E′
The notationrec x.Efor recursion makes sometimes the process expressions more dif-
ficult to parse and less pleasant to read. A suitable alternative is to allow for the (recursive)
definition of some fixed set of constants, that can then be used as some sort of procedure
calls inside processes. Assuming the existence of an environment (a set of process defini-
tions)
Γ={X 1 ,E 1 ,X 2 ,E 2 ,...,Xn,En}

the operational semantic rule for a process variable becomes:

```
X,E∈Γ E
```

μ
−→E′
X−→μ E′
Another operator used to describe infinite behaviors is the so calledbangoperator, -
! , orreplication. Intuitively, !Erepresents an unlimited number of instances ofErunning

in parallel. Thus, its semantics is rendered by the following inference rule:

```
E|!E
```

```
μ
−→E′
!E−→μ E′
```

## 3 Behavioral Equivalences

In many cases, it is useful to have theories which can be used to establish whether two
systems are equivalent or whether one is a satisfactory “approximation” of another. It can
be said that a systemS 1 is equivalent to a systemS 2 whenever “some” aspects of the
externally observable behavior of the two systems are compatible. If the same formalism
is used to model what is required of a system (itsspecification) and how it can actually
be built (itsimplementation) then it is possible to use theories based on equivalences to
prove that a particular concrete description is correct with respect to a given abstract one.
If a step-wise development method is used, equivalences may permit substituting large
specifications with equivalent concise ones. In general it is useful to be able to interchange
subsystems proved behaviorally equivalent, in the sense that one subsystem may replace
another as part of a larger system without affecting the behavior of the overall system.
The kind of equivalences, or approximations, involved depends very heavily on how
the systems under consideration will be used. In fact, the way a system is used determines
the behavioral aspects which must be taken into account and those which can be ignored.
It is then important to know, for the considered equivalence, the systems properties it
preserves.
In spite of the general agreement on taking an extensional approach for defining the
equivalence of concurrent or nondeterministic systems, there is still disagreement on what
“reasonable” observations are and how their outcomes can be used to distinguish or iden-
tify systems. Many different theories of equivalences have been proposed in the literature
for models which are intended to be used to describe and reason about concurrent or non-
deterministic systems. This is mainly due to the large number of properties which may be
relevant in the analysis of such systems. Almost all the proposed equivalences are based
on the idea that two systems are equivalent whenever no external observation can distin-
guish them. In fact, for any given system it is not its internal structure which is of interest
but its behavior with respect to the outside world, i.e., its effect on the environment and
its reactions to stimuli from the environment.
One of the most successful approaches for describing the formal, precise, behavior of
concurrent systems is the so calledoperational semantics. Within this approach, concur-
rent programs or systems are modeled as labelled transition systems (LTSs) that consist

of a set of states, a set of transition labels and a transition relation. The states of the transi-
tion systems are programs while the labels of the transitions between states represent the
actions (instructions) or the interactions that are possible in a given state.
When defining behavioral equivalence of concurrent systems described as LTSs, one
might think that it is possible to consider systems equivalent if they give rise to the same
(isomorphic) LTSs. Unfortunately, this would lead to unwanted distinctions, e.g., it would
consider the two LTSs below different

```
p
```

```
a
```

```
q a q 1
```

```
a
```

in spite of the fact that their behavior is the same; they can (only) execute infinitely many
a-actions, and they should thus be considered equivalent.
The basic principles for any reasonable equivalence can be summarized as follows. It
should:

- abstract from states (consider only the actions);
- abstract from internal behaviour
- identify processes whose LTSs are isomorphic;
- consider two processes equivalent only if both can execute the same actions sequences;
- allow to replace a subprocess by an equivalent counterpart without changing the over-
  all semantics of the system.

However, these criteria are not sufficiently insightful and discriminative and the above
adequacy requirements turn out to be still too loose. They have given rise to many different
kinds of equivalences, even when all actions are considered visible.
The main equivalences over LTSs introduced in the literature consider as equivalent
those systems that:

1. perform the same sequences of actions,
2. perform the same sequences of actions and after each sequence are ready to accept the
   same sets of actions,
3. perform the same sequences of actions and after each sequence exhibit, recursively,
   the same behavior.
   These three different criteria lead to three groups of equivalences that are known as
   tracesequivalences,decorated-tracesequivalences, andbisimulation-basedequivalences.
   Equivalences in different classes behave differently relatively to the three labelled transi-
   tion systems in Fig. 1. The three systems represent the specifications of three vending

machines that accept two coins and deliver coffee or tea. The trace based equivalences
equate all of them, the bisimulation based equivalences distinguish all of them, and the
decorated traces distinguish the leftmost system from the other two, but equate the central
and the rightmost one.

```
p
```

```
p 1
```

```
coin 1
```

```
p 2
```

```
coin 2
```

```
p 3
```

```
coffee
p 4
```

```
tea
```

```
q
```

```
q 1
```

```
coin 1
```

```
q 2
```

```
coin 2
```

```
q 4
```

```
coffee
```

```
q 3
```

```
coin 2
```

```
q 5
```

```
tea
```

```
r
```

```
r 2
```

```
coin 1
```

```
r 4
```

```
coin 2
```

```
r 6
```

```
coffee
```

```
r 1
```

```
coin 1
```

```
r 3
```

```
coin 2
```

```
r 5
```

```
tea
```

```
Fig. 1.Three Vending Machines
```

Many of these equivalences have been reviewed [48]; here, only the main ones are
presented. First, equivalences that consider invisible (τ)actions just normal actions will
be presented, then their variants that abstract from internal actions will be introduced.
The equivalences will be formally defined on states of LTSs of the form〈Q,Aτ,

μ
−→〉
whereQis a set of states, ranging overp,q,p′,q 1 ,... ,Aτis the set of labels, ranging over
a,b,c,... , that also contains the distinct silent actionτ, and

μ
−→ is the set of transitions.
In the following,swill denote a generic element ofA∗τ, the set of all sequences of actions
that a process might perform.

### 3.1 Traces Equivalence

The first equivalence is know astraces equivalenceand is perhaps the simplest of all; it
is imported from automata theory that considers those automata equivalent that generate
the same language. Intuitively, two processes are deemed traces equivalent if and only if
they can perform exactly the same sequences of actions. In the formal definition,p−→s p′,
withs=μ 1 μ 2 ...μn, denotes the sequencep

```
μ 1
−→p 1
```

```
μ 2
−→p 2 ...
```

```
μn
−→p′of transitions.
```

Two statespandqaretraces equivalent(p'Tq) if :

1. p−→s p′impliesq−→s q′for someq′and
2. q−→s q′impliesp−→s p′for somep′.

A drawback of'Tis that it is not sensitive to deadlocks. For example, if we consider
the two LTSs below:

```
p 1
```

```
p 3
```

```
p 2 p 4
```

```
a
```

```
a
b
```

```
q 1 a q 2 b q 3
```

we have thatP 1 'T Q 1 butP 1 , unlikeQ 1 , after performing actiona, can reach a state in
which it cannot perform any action, i.e., a deadlocked state.
Traces equivalence identifies all of the three LTSs of Fig. 1, indeed it is not difficult
to see that the three vending machines can perform the same sequences of visible actions.
Nevertheless, a customer with definite preferences for coffee who is offered to choose
between the three machines would definitely select to interact with the leftmost one, since
the others do not let him choose what to drink.

### 3.2 Bisimulation Equivalence

The classical alternative to traces equivalence is bisimilarity (also known as observational
equivalence), that considers equivalent two systems that can simulate each other step after
step [35]. Bisimilarity is based on the notion of bisimulation:
A relationR ⊆Q×Qis abisimulationif, for any pair of statespandqsuch that
〈p,q〉∈R, the following holds:

1. for allμ∈Aτandp′∈Q, ifp−→μ p′thenq−→μ q′for someq′∈Qs.t.〈p′,q′〉∈R;
2. for allμ∈Aτandq′∈Q, ifq−→μ q′thenp−→μ p′for somep′∈Qs.t.〈p′,q′〉∈R.
   Two statesp,qarebisimilar(p∼q) if there exists a bisimulationRsuch that〈p,q〉∈
   R.

This definition corresponds to the circular definition below, that more clearly shows
that two systems are bisimilar (observationally equivalent) if they can perform the same
action and reach bisimilar states. This recursive definition can be solved with the usual
fixed points techniques.

Two statesp,q∈Qarebisimilar, writtenp∼q, if and only if for eachμ∈Aτ:

1. ifp

```
μ
−→p′thenq
```

```
μ
−→q′for someq′such thatp′∼q′;
```

2. ifq

```
μ
−→q′thenp
```

μ
−→p′for somep′such thatp′∼q′.
Bisimilarity distinguishes all machines of Fig. 1. This is because the basic idea be-
hind bisimilarity is that two states are considered equivalent if by performing the same

sequences of actions from these states it is possible to reach equivalent states. It is not
difficult to see that bisimilarity distinguishes the first and the second machine of Fig. 1
because after receiving two coins (coin 1 andcoin 2 ) the first machine still offers the user
the possibility of choosing between havingcoffeeorteawhile the second does not. To
see that also the second and the third machine are distinguished, it is sufficient to consider
only the states reachable after just insertingcoin 1 , because already after this insertion the
user looses his control of the third machine, indeed there is no way for this machine to
reach a state bisimilar to the one that the second machine reaches after acceptingcoin 1.

### 3.3 Testing Equivalence

The formulation of bisimilarity is mathematically very elegant and has received much
attention also in other fields of computer science [45]. However, some researchers do
consider it too discriminating: two processes may be deemed unrelated even though there
is no practical way of ascertaining it. As an example consider the two rightmost vending
machines of Fig. 1. They are not bisimilar, because after inserting the first coin in one case
there is still the illusion of having the possibility of choosing what to drink. Nevertheless,
a customer would not be able to appreciate their differences, since there is no possibility
of deciding what to drink with both machines.
Testing equivalence has been proposed [19] (see also [26]) as an alternative to bisim-
ilarity; it takes to the extreme the claim that when defining behavioral equivalences, one
does not want to distinguish between systems that cannot be taken apart by external ob-
servers and bases the definition of the equivalences on the notions ofobservers,observa-
tionsandsuccessful observations. Equivalences are defined that consider equivalent those
systems that satisfy (lead to successful observations by) the same sets of observers. An
observeris an LTS with actions inAτ,w,Aτ∪{w}, withw<A. To determine whether a
stateqsatisfies an observer with initial stateo, the setOBS(q,o) of allcomputationsfrom
〈q,o〉is considered.
Given an LTS〈Q,Aτ,

```
μ
−→ 〉and an observer〈O,Aτ,w,
```

μ
−→ 〉, and a stateq∈Qand the
initial stateo∈ O, anobservation cfrom〈q,o〉is a maximal sequence of pairs〈qi,oi〉,
such that〈q 0 ,o 0 〉=〈q,o〉. The transition〈qi,oi〉−→ 〈μ qi+ 1 ,oi+ 1 〉can be proved using the
following inference rule:

```
E
```

```
μ
−→E′ F
```

```
μ
−→F′
μ∈Aτ
〈E,F〉
```

μ
−→〈E′,F′〉
An observation from〈q,o〉issuccessfulif it contains a configuration〈qn,on〉∈c, with
n≥0, such thaton−→w ofor someo.

When analyzing the outcome of observations, one has to take into account that, due
to nondeterminism, a process satisfies an observersometimesor a process satisfies an
observeralways. This leads to the following definitions:

1. qmay satisfyoifthere exists an observationfrom〈q,o〉that is successful;
2. qmust satisfyoifall observationsfrom〈q,o〉are successful.

These notions can be used to definemay,mustandtestingequivalence.

May equivalence pismayequivalent toq(p 'm q) if, for all possible observerso:
pmay satisfyoif and only ifqmay satisfyo;
Must equivalence pismustequivalent toq(p 'M q) if, for all possible observerso:
pmust satisfyoif and only ifqmust satisfyo.
Testing equivalence pistestingequivalent toq(p 'testq) ifp 'm qandp'M q.

The three vending machines of Fig. 1 are may equivalent, but only the two rightmost
ones are must equivalent and testing equivalent. Indeed, in most cases must equivalence
implies may equivalence and thus in most cases must and testing do coincide. The two
leftmost machines are not must equivalent because one after receiving the two coins the
machine cannot refuse to (must) deliver the drink chosen by the customer while the other
can.
May and must equivalences have nice alternative characterizations. It has been shown
that may equivalence coincides with traces equivalence and that must equivalence coin-
cides withfailures equivalence, another well-studied relation that is inspired by traces
equivalence but takes into account the possible interactions (failures) after each trace and
is thus more discriminative than trace equivalence [30]. Failures equivalence relies on
pairs of the form〈s,F〉, wheresis a trace andFis a set of labels. Intuitively,〈s,F〉is a
failure for a process if it can perform the sequence of actionssto evolve into a state from
which no action inFis possible. This equivalence can be formulated on LTS as follows:

Failures EquivalenceTwo statespandqarefailures-equivalent,writtenp'F q, if
and only if they possess the same failures, i.e., if for anys∈A∗τand for anyF⊆Aτ:

1. p−→s p′andInit(p′)∩F=∅impliesq−→s q′for someq′andInit(q′)∩F=∅;
2. q−→s q′andInit(q′)∩F=∅impliesp−→s p′for somep′andInit(p′)∩F=∅.

whereInit(q) represents the immediate actions of stateq.

### 3.4 Hierarchy of Equivalences

The equivalences considered above can be precisely related (see [17] for a first study).
Their relationships over the class of finite transition systems with only visible actions are

summarized by the figure below, where the upward arrow indicates containment of the
induced relations over states and≡indicates coincidence.

```
≃T≡≃m
```

#### ≃F≡ ≃M

#### ∼

Overall, the figure states that may testing gives rise to a relation ('m) that coincides
with traces equivalence, while must testing gives rise to a relation'Mthat coincides with
failures equivalence. For the considered class of systems it also holds that must and testing
equivalence'testdo coincide. Thus, bisimilarity implies testing equivalence that in turn
implies traces equivalence.

### 3.5 Weak Variants of the Equivalences

When considering abstract versions of systems making use of invisible actions it turns
out that all equivalences considered above are too discriminating. Indeed, traces, test-
ing/failures and observation equivalence would distinguish the two machines of Fig. 2
that, nevertheless, exhibit similar observable behaviors: get a coin and deliver a coffee.
The second one can be obtained, e.g., from the term

```
coin.grinding.coffee.nil
```

by hiding thegrindingaction that is irrelevant for the customer.

```
q 0 coin coffee
```

```
p 0 coin τ coffee
```

```
Fig. 2.Weakly equivalent vending machines
```

Because of this overdiscrimination,weakvariants of the equivalences have been de-
fined that permit ignoring (to different extents) internal actions when considering the be-
havior of systems. The key step of their definition is the introduction of a new transition
relation that ignores silent actions. Thus,q

a
=⇒q′denotes thatqreduces toq′by performing
the visible actionapossibly preceded and followed by any number (also 0) of invisible
actions (τ). The transitionq⇒=s q′, instead, denotes thatqreduces toq′by performing the

sequencesof visible actions, each of which can be preceded and followed byτ-actions,
while

```

⇒= indicates that onlyτ-actions, possibly none, are performed.
```

Weak Traces Equivalence The weak variant of traces equivalence is obtained by simply
replacing the transitionsp−→s p′above with the observable transitionsp

```
s
=⇒p′.
```

Two statespandqareweak traces equivalent(puTq) if for anys∈A∗:

1. p=⇒s p′impliesq=⇒s q′for someq′and
2. q=⇒s q′impliesp⇒=s p′for somep′.

Weak Testing Equivalence To define the weak variants of may, must and testing equiv-
alences (denoted byum,uM,utestrespectively) it suffices to change experiments so that
processes and observers can freely perform silent actions. To this purpose, one only needs
to change the inference rule of the observation step:〈qi,oi〉

μ
−→〈qi+ 1 ,oi+ 1 〉that can now be
proved using:

```
E
```

```
τ
−→E′
〈E,F〉−→〈τ E′,F〉
```

#### F

```
τ
−→F′
〈E,F〉−→〈τ E,F′〉
```

#### E

```
a
−→E′ F
```

a
−→F′
a∈A
〈E,F〉−→〈a E′,F′〉
To define, instead,weak failures equivalence, it suffices to replacep−→s p′withp=⇒s p′
in the definition of its strong variant. It holds that weak traces equivalence coincides with
weak may equivalence, and that weak failures equivalenceuFcoincides with weak must
equivalence.

Weak Bisimulation Equivalence For defining weak observational equivalence a new
notion of (weak) bisimulation is defined that again assigns a special role toτ’s. To avoid
having four items, the definition below requires that the candidate bisimulation relations
be symmetric:
AsymmetricrelationR⊆Q×Qis aweak bisimulationif, for any pair of statesp
andqsuch that〈p,q〉∈R, the following holds:

- for alla∈Aandp′∈Q, ifp−→a p′thenq=⇒a q′for someq′∈Qs. t.〈p′,q′〉∈R;
- for allp′∈Q, ifp−→τ p′thenq=⇒ q′for someq′∈Qs.t.〈p′,q′〉∈R.
  Two statesp,qareweakly bisimilar(p≈q) if there exists a weak bisimulationRsuch
  that〈p,q〉∈R.

The figure below describes the intuition behind weak bisimilarity. In order to consider
two states, saypandq, equivalent, it is necessary that for each visible action performed

by one of them the other has to have the possibility of performing the same visible action
possibly preceded and followed by any number of invisible actions.

```
p p′
```

```
q q 1... qn q′ 1 q′ 2... q′
```

```
a
```

```
τ τ τ a τ τ τ
```

Branching Bisimulation EquivalenceAn alternative to weak bisimulation has also been
proposed that considers thoseτ-actions important that appear in branching points of sys-
tems descriptions: only silent actions that do not eliminate possible interaction with ex-
ternal observers are ignored.

AsymmetricrelationR⊆Q×Qis abranching bisimulationif, for any pair of states
pandqsuch that〈p,q〉 ∈ R, ifp−→μ p′, withμ ∈ Aτandp′ ∈ Q, at least one of the
following conditions holds:

- μ=τand〈p′,q〉∈R
- q

```

=⇒q′′
```

```
μ
−→q′for someq′,q′′∈Qsuch that〈p,q′′〉∈Rand〈p′,q′〉∈R.
```

Two statesp,qarebranching bisimilar(p≈bq) if there exists a branching bisimula-
tionRsuch that〈p,q〉∈R.

The figure below describes the intuition behind branching bisimilarity; it corresponds
to the definition above although it might appear, at first glance, more demanding. In order
to consider two states, saypandq, equivalent, it is necessary, like for weak bisimilarity,
that for each visible action performed by one of them the other has to have the possibil-
ity of performing the same visible action possibly preceded and followed by any number
of invisible actions. Branching bisimilarity, however, imposes the additional requirement
that all performed internal actions are not used to change equivalent class. Thus, all states
reached viaτ’s before performing the visible action are required to be equivalent top,
while all states reached viaτ’s after performing the visible action are required to be equiv-
alent top′.

```
p p′
```

```
q q 1... qn q′ 1 q′ 2... q′
```

```
a
```

```
τ τ τ a τ τ τ
```

### 3.6 Hierarchy of Weak Equivalences

Like for the strong case, also weak equivalences can be clearly related. Their relationships
over the class of finite transition systems with invisible actions but withoutτ-loops (so
callednon-divergentorstrongly convergentLTSs) are summarized by the figure below,
where the upward arrow indicates containment of the induced relations over states.

```
≅T≡≅m
```

#### ≅F≡ ≅M

#### ≈

```
≈b
```

Thus, overstrongly convergentLTSs with silent actions, branching bisimilarity imlies
weak bisimilarity and this implies testing and failures equivalences; and these implies
traces equivalence.
A number of counterexamples can be provided to show that the implications of the
figure above are proper and thus that the converse does not hold.
The two LTSs reported below are weak traces equivalent and weakly may equivalent
but are distinguished by all the other equivalences.

```
p 1
```

```
p 3
```

```
p 2 p 4
```

```
a
```

```
τ
b
```

```
q 1
q 2
```

```
q 3
b
```

```
a
```

Indeed, they can perform exactly the same weak traces but while the former can silently
reach a state in which ana-action can be refused the second cannot.
The next two LTSs are equated by weak trace and weak must equivalences but are
distinguished by weak bisimulation and branching bisimulation.

```
p 1
```

```
p 3
```

```
p 2 p 4
```

```
a
```

```
τ
b
```

```
q 1
q 2
```

```
q 3
q 5
```

```
q 4
```

```
q 6
```

```
τ
```

```
τ
a
b
```

```
b
```

Both of them, after zero or more silent actions, can be either in a state where both
actionsaandbare possible or in a state in which only abtransition is possible. However,

via aτ-action, the rightmost system can reach a state that has no equivalent one in the
leftmost one, thus they are not weakly bisimilar.
The next two LTSs are instead equated by weak bisimilarity, and thus by weak trace
and and weak must equivalences, but are not branching bisimilar.

```
p 0 p 1
```

```
p 2
```

```
p 3 p 4
```

```
a
```

```
c
```

```
τ
b
```

```
q 0
q 1
```

```
q 5
q 2
```

```
q 3
```

```
q 6
```

```
q 4
```

```
a
```

```
a
c
τ b
```

```
b
```

It is easy to see that from the statesp 0 andq 0 the same visible action is possible
and bisimilar states can be reached. The two statesp 0 andq 0 are instead not branching
bisimilar becausep 0 , in order to match theaaction ofq 0 toq 5 and reach a state equivalent
toq 5 , needs to reachp 3 throughp 1 but these two states, connected by aτ-action, are not
branching bisimilar.
It is worth concluding that the two LTSs of Fig. 2 are equated by all the considered
weak equivalences.

## 4 Three Process Algebras: CCS, CSP and ACP

A process algebra consists of a set of terms, an operational semantics associating LTS
to terms and an equivalence relation equating terms exhibiting “similar” behavior. The
operators for most process algebras are those described above. The equivalences can be
traces, testing, bisimulation equivalences or variants thereof, possibly ignoring invisible
actions.
Below three of the most popular process algebras are presented. First the syntax, i.e.,
the selected operators, will be introduced, then their semantics will be provided by fol-
lowing the three different approaches outlined before: operational (for CCS), denotational
(for CSP) and algebraic (for ACP). For CSP and ACP, the relationships between the pro-
posed semantics and the operational one, to be used as a yardstick, will be mentioned.
To denote the LTS associated to a generic CSP or ACP process pvia the operational
semantics, the notationLTS(p) will be used.
Reference will be made to specific behavioral equivalences over LTSs that consider
as equivalent those systems that rely on different standing about which states of an LTS
have to be considered equivalent. There are three main criteria:
Two systems are considered equivalent if they:

1. perform the same sequences of actions,

2. perform the same sequences of actions and after each sequence are ready to accept the
   same sets of actions,
3. perform the same sequences of actions and after each sequence exhibit, recursively,
   the same behavior.
   These three different criteria lead to three groups of equivalences that are known
   astracesequivalences,decorated-tracesequivalences (testing and failure equivalence),
   andbisimulation-basedequivalences (strong bisimulation, weak bisimulation, branching
   bisimulation).

### 4.1 CCS: Calculus of Communicating Systems

The Calculus of Communicating Systems (CCS) is a process algebra introduced by Robin
Milner around 1980. Its actions model indivisible communications between exactly two
participants and the set of operators includes primitives for describing parallel composi-
tion, choice between actions and scope restriction. The basic semantics is operational and
permits associating an LTS to each CCS term.
The setAof basic actions used in CCS consists of a setΛ, of labels and of a setΛof
complementary labels.AτdenotesA∪{τ}. The syntax of CCS, used to generate all terms
of the algebra, is the following:

```
P ::= nil| x | μ.P | P\L| P[f] | P 1 +P 2 | P 1 |P 2 | rec x.P
```

whereμ∈Aτ;L⊆Λ;f :Aτ→Aτ;f( ̄α)=f(α) andf(τ)=τ. The above operators are
taken from those presented in Section 2:

- the atomic process (nil),
- action prefixing (μ.P),
- mixed choice (+),
- binary parallel composition (|),
- restriction (P\L),
- relabelling (P[f]) and
- recursive definitions (rec x.E).

The set of all terms generated by the abstract syntax is the set ofCCS process expres-
sions(and is denoted byP). The operational semantics of the above operators is exactly
the same as the one of those operators with the same name described before, it is repeated
here for the sake of readability.
The operational semantics of CCS is described by the following SOS rules:

```
ACT
μ.P
```

```
μ
−→P
```

```
SUM1 P^1
−→μ P′
1
P 1 +P 2 −→μ P′ 1
```

#### SUM2 P^2

```
−→μ P′
2
P 1 +P 2 −→μ P′ 2
```

```
COM1 P
−→μ P′
P|Q−→μ P′|Q
```

#### COM2 Q

```
μ
−→Q′
P|Q−→μ P|Q′
```

```
COM3 P
−→a P′ Q−→a Q′
P|Q−→τ P′|Q′
```

```
RES P
```

```
μ
−→P′
P\L−→μ P′\L
```

```
μ,μ<L REL P
```

```
μ
−→P′
P[f]−→f(μ)P′[f]
```

REC P[rec x.P/x]
−→μ P′
rec x.P−→μ P′
CCS has been studied with bisimulation and testing semantics that are used to abstract
from unnecessary details of the LTS associated to a term. Also denotational and axiomatic
semantics for the calculus have been extensively studied. A denotational semantics in
terms of so calledacceptance treeshas been proved to be in full agreement with the
operational semantics abstracted according to testing equivalences. Different algebraic
semantics have been provided that are based on sound and complete axiomatizations of
bisimilarity, testing equivalence, weak bisimilarity and branching bisimilarity.

### 4.2 CSP: A Theory of Communicating Sequential Processes

The first denotational semantics proposed for CSP associates to each term just the set of
the sequences of actions the term could induce. However, while suitable to model the se-
quences of interactions a process could have with its environment, this semantics is unable
to model situations that could lead to deadlock. A new approach, basically denotational
but with a strong operational intuition, was proposed next. In this approach, the semantics
is given by associating a so called refusal set to each process. A refusal set is a set of fail-
ure pairs〈s,F〉wheresis a finite sequence of visible actions in which the process might
have been engaged andFis a set of action the process is able to reject on the next step.
The semantics of the various operators is defined by describing the transformation they
induce on the domain of refusal sets.
The meaning of processes is then obtained by postulating that two processes are equiv-
alent if and only if they cannot be distinguished when their behaviors are observed and
their reactions to a finite number of alternative possible synchronization is considered.

Indeed, the association of processes to refusal sets is not one-to-one; the same refusal set
can be associated to more than one process. A congruence is then obtained that equates
processes with the same denotation.
The set of actions is a a finite set of labels, denoted byΛ∪{τ}. There is no notion of
complementary action. The syntax of CSP is reported below and for the sake of simplicity
only finite terms (no recursion) are considered:

```
E::=Stop | ski p | a→E | E 1 uE 2 | E 1 E 2 | E 1 |[L]|E 2 | E/a
```

- two basic processes: successful termination (ski p), null process (Stop),
- action prefixing here denoted bya→E,
- internal choice (⊕) here denoted byuand external choice (),
- parallel composition with synchronization on a fixed alphabet (|[L]|,L⊆Λ),
- hiding (/a, an instance of the more general operator/LwithL⊆Λ).

Parallel combinators representing pure interleaving and parallelism with synchronization
on the full alphabet can be obtained by setting the synchronization alphabet to∅or toΛ,
respectively.
The denotational semantics of CSP compositionally associates a set of failure pairs to
each CSP term generated by the above syntax. A function,F[[−]], maps each CSP process
(sayP) to set of pairs (s,F) wheresis one of the sequences of actionsPmay perform and
Frepresents the set of actions that P can refuse after performings.
Below the denotational semantics of CSP is introduced. In the following equation,
thesymbol is used to denote the empty sequence of actions. For the sake of simplicity,
issues related to infinite behaviors and divergence are deliberately omitted.

- F[[Stop]]={〈,V〉|V⊆A}
- F[[ski p]]={〈,V〉|V⊆A} ∪ {〈

#### √

#### ,V〉|V⊆A}

- F[[a→P]]={〈,V〉|V⊆A−{a}}∪{〈as,W〉|〈s,W〉∈F[[P]]}
- F[[P 1 P 2]] = {〈,V〉|〈,V〉 ∈ F[[P 1]]∩ F[[P 2]]} ∪ {〈s,W〉| 〈s,W〉 ∈ F[[P 1]]∪
  F[[P 2]] and s is a non empty sequence of actions}
- F[[P 1 uP 2]]=F[[P 1]]∪F[[P 2]]
- F[[P 1 |[L]|P 2]]={〈u,V∪W〉|V−L=W−L∧ 〈s,V〉∈F[[P 1]]∧ 〈t,W〉∈F[[P 2]]
  ∧u∈‖L(s,t)}where‖L(s,t) denotes the merging ofsandtwhile taking into account
  synchronization of actions inL.

- F[[P/a]]={〈s/a,V〉|〈s,V∪{a}〉 ∈ F[[P]]}, wheres/adenotes the sequence obtained
  fromsby removing all occurrences ofa.

As anticipated, there is a strong correspondence between the denotational semantics of
CSP and the operational semantics that one could define by relying on the one presented
in the previous section for the specific operators.

- F[[P]]=F[[Q]] if and only if LTS(P)'test LTS(Q).

### 4.3 ACP: An Algebra of Communicating Processes

The methodological concern of ACP was to present “first a system of axioms for com-
municating processes... and next study its models” ([6], p. 112). The equations are just
a means to realize the real desideratum of abstract algebra, which is to abstract from the
nature of the objects under consideration. In the same way as the mathematical theory of
rings is about arithmetic without relying on a mathematical definition of number, ACP
deals with process theory without relying on a mathematical definition of process.
In ACP a process algebra is any mathematical structure, consisting of a set of objects
and a set of operators, like, e.g., sequential, nondeterministic or parallel composition, that
enjoys a specific set of properties as specified by given axioms.
The set of actionsΛτconsists of a finite set of labelsΛ∪{τ}. There is no notion of
complementary action. The syntax of ACP is reported below and for the sake of simplicity
only finite terms (no recursion) are considered:

#### P ::=

#### √

# |δ|a|P 1 +P 2 |P 1 ·P 2 |P 1 ‖P 2 |P 1 TP 2 |P 1 |cP 2 |∂H(p)

- three basic processes: successful termination (√), null process, here denoted byδ, and
  atomic action (a),
- mixed choice,
- sequential composition (;), here denoted by·,
- hiding (\HwithH⊆Λ), here denoted by∂H(−),
- three parallel combinators: merge (‖), left merge (T) and communication merge (|c).

The system of axioms of ACP is presented as a set of formal equations, and some
of the operators, e.g., left merge (T) have been introduced exactly for providing finite
equational presentations. Below, the axioms relative to the terms generated by the above
syntax are presented. Within the axioms,xandydenote generic ACP processes, andvand
wdenote generic actions.

```
(A1) x+y=y+x (A2) (x+y)+z=x+(y+z)
```

# (A3) x+x=x (A4) (x+y)·z=x·z+y·z

# (A5) (x·y)·z=x·(y·z) (A6) x+δ=x

# (A7) δ·x=δ

The set of axioms considered above induces anequality relation, denoted by=. A
modelfor an axiomatization is a pair〈M,φ〉, whereMis a set andφis a function (the
unique isomorphism) that associates elements ofMto ACP terms. This leads to the fol-
lowing definitions:

1. A set of equations issoundfor〈M,φ〉ifs=timpliesφ(s)=φ(t);
2. A set of equations iscompletefor〈M,φ〉ifφ(s)=φ(t) impliess=t.
   Any model of the axioms seen above is an ACP process algebra. The simplest model
   for ACP has as elements the equivalence classes induced by=, i.e. all ACP terms ob-
   tained starting from atomic actions, sequentialization and nondeterministic composition
   and mapping each termtto its equivalence class [[t]] as determined by=. This model is
   correct and complete and is known as theinitial modelfor the axiomatization.
   Different, more complex, models can be obtained by first using the SOS rules to give
   the operational semantics of the operators, building an LTS in correspondence of each
   ACP term and then using bisimulation to identify some of them. This construction leads to
   establishing a strong correspondence between the axiomatic and the operational semantics
   of ACP. Indeed, if we consider the language with the null process, sequential composition
   and mixed choice we have:

- Equality=as induced by (A1)-(A7) issoundrelative to bisimilarity∼, i.e., ifp=q
  thenLTS(p)∼LTS(q);
- Equality=as induced by (A1)-(A7) iscompleterelative to bisimilarity∼, i.e., if
  LTS(p)∼LTS(q) thenp=q.

```
Obviously also other operators have been axiomatized; bigskip
```

# (M1) x‖y=xTy+yTx+x|cy (LM2) vTy=v·y

# (LM3) (v·x)Ty=v·(x‖y) (LM4) (x+y)Tz=xTz+yTz

# (CM5) v|cw=γ(v,w) (CM6) v|c(w·y)=γ(v,w)·y

# (CM7) (v·x)|cw=γ(v,w)·x (CM8) (v·x)|c(w·y)=γ(v,w)·(x‖y)

```
(CM9) (x+y)|cz=x|cz+y|cz (CM10) x|c(y+z)=x|cy+x|cz
(LM11) δTx=δ (CM12) δ|cx=δ
(CM13) x|cδ=δ
```

```
(D1) ∂H(v)=v if v<H (D2) ∂H(v)=δ if v∈H
(D3) ∂H(δ)=δ (D4) ∂H(x+y)=∂H(x)+∂H(y)
```

# (D5) ∂H(x·y)=∂H(x)·∂H(y)

Above we have thatγ:Λ×Λ→Λ∪{δ}(δnot inΛ) is the communication function.
There are no constraints onγexcept that it has to satisfy the commutativity -γ(a,b)=
γ(b,a) - and the associativity -γ(γ(a,b),c)=γ(a,γ(b,c)) - laws.
Similar results can be obtained when new axioms are added and weak bisimilarity or
branching bisimilarity are used to factorize the LTS’s.

## 5 Future Directions

The theory of process algebra is by now well developed, the reader is referred to [7]
to learn about its developments since its inception in the late 1970’s to the early 2000.
Currently, in parallel with the exploitation of the developed theories in classic areas such
as protocol verification and in new ones such as biological systems, there is much work
going on concerning:

- extensions to model mobile, network aware systems;
- theories for assessing quantitative properties;
- techniques for controlling state explosion.

In parallel with this, much attention is dedicated to the development of software tools
to support specification and verification of very large systems and to the development
of techniques that permit controlling the state explosion phenomenon that arise as soon
as one considers the possible configurations resulting from the interleaved execution of
(even) a small number of processes.

Mobility and network awarenessMuch of the ongoing work is relative to the definition of
theories and formalisms to naturally deal with richer classes of systems, like, e.g. mobile
systems and network aware applications. Theπ-calculus [36] the successor of CCS, de-
veloped by Milner and co-workers with the aim of describing concurrent systems whose
configuration may change during the computation has attracted much attention. It has laid
the basis for research on process networks whose processes are mobile and the configu-
ration of communication links is dynamic. It has also lead to the development of other
calculi to support network aware programming: Ambient [13], Distributedπ[27], Join
[21], Spi [1], Klaim [9],.... There is still no unifying theory and the name process calculi
is preferred to process algebras because the algebraic theories are not yet well assessed.

Richer theories than LTS (Bi-graph [37], Tiles [22],... ) have been developed and are still
under development to deal with the new dimensions considered with the new formalisms.

Quantitative Extensions Formalisms are being enriched to consider not only qualitative
properties, like correctness, liveness or safety, but also properties related to performance
and quality of service. There has been much research to extend process algebra to deal
with a quantitative notion of time and probabilities and integrated theories have been
considered. Actions are enriched with information about their duration and formalisms
extended in this way are used to compare systems relatively to their speed. For a com-
prehensive description of this approach, the reader is referred to [4]. Extensions have
been considered also to deal with systems that in their behavior depend on continuously
changing variables other than time (hybrid systems). In this case, systems descriptions
involve differential algebraic equations, and connections with dynamic control theory are
very important. Finally, again with the aim of capturing quantitative properties of sys-
tems and of combining functional verification with performance analysis, there have been
extensions to enrich actions with rates representing the frequency of specific events and
the new theories are being (successfully) used to reason about system performance and
system quality.

Tools To deal with non-toy examples and apply the theory of process algebras to the spec-
ification and verification of real systems, tool support is essential. In the development of
tools, LTSs play a central role. Process algebra terms are used to obtain LTSs by exploit-ˆ
ing operational semantics and these structures are then minimized, tested for equivalence,
model checked against formulae of temporal logics,.... One of the most known tools
for process algebras is CADP (Construction and Analysis of Distributed Processes) [23]:
together with minimizers and equivalence and model checkers it offers many others func-
tionalities ranging from step-by-step simulation to massively parallel model checking.
CADP has been employed in an impressive number of industrial projects. CWB (Concur-
rency Workbench) [38] and CWB-NC (Concurrency Workbench New Century) [15] are
other tools that are centered on CCS, bisimulation equivalence and model checking. FDR
(Failures/Divergence Refinement) [43] is a commercial tool for CSP that has played a ma-
jor role in driving the evolution of CSP from a blackboard notation to a concrete language.
It allows the checking of a wide range of correctness conditions, including deadlock and
livelock freedom as well as general safety and liveness properties. TAPAs (Tool for the
Analysis of Process Algebras) [12] is a recently developed software to support teaching of
the theory of process algebras; it maintains a consistent double representation as term and
as graph of each system. Moreover, it offers tools for the verification of many behavioural

equivalences, possibly with counterexamples, minimization, step-by-step execution and
model checking. TwoTowers, is instead a versatile tool for the functional verification, se-
curity analysis, and performance evaluation of computer, communication and software
systems modeled with the stochastic process algebra EMPA [4].μCRL [25] is a toolset
that offers an appropriate treatment of data and relies also on theorem proving. Moreover,
it make use of interesting techniques for visualizing large LTSs.

## 6 Relationship to Other Models of Concurrency

In a private communication, in 2009, Robin Milner, one of the founding fathers of process
algebras, wrote:

```
The concept of process has become increasingly important in computer science in
the last three decades and more. Yet we still don’t agree on what a process is. We
probably agree that it should be an equivalence class of interactive agents, perhaps
concurrent, perhaps non-deterministic.
```

This quote summarizes the debate on possible models of concurrency that has taken place
during the last thirty years and has been centered on three main issues:

- interleaving vs true concurrency;
- linear-time vs branching-time;
- synchrony vs asynchrony.

Interleaving vs true concurrency The starting point of the theory of process algebras has
been automata theory and regular expressions and the work on the algebraic theory of
regular expressions as terms representing finite state automata [16] has significantly in-
fluenced its developments. Given this starting point, the underlying models of all process
algebras represent possible concurrent executions of different programs in terms of the
nondeterministic interleaving of their sequential behaviors. The fact that a system is com-
posed by independently computing agents is ignored and behaviors are modeled in terms
of purely sequential patterns of actions. It has been demonstrated that many interesting
and important properties of distributed systems may be expressed and proved by relying
on interleaving models. However, there are situations in which it is important to keep the
information that a system is composed of the independently computing components. This
possibility is offered by the so-called non-interleaving or true-concurrency models, with
Petri nets [42] as the prime example. These models describe not only temporal ordering of
actions but also their causal dependences. Non-interleaving semantics of process algebras
have also been provided, see e.g. [39].

Linear-time vs branching-timeAnother issue, again ignored in the initial formalization of
regular expressions, is how the concept of nondeterminism in computations is captured.
Two possible views regarding the nature of nondeterministic choice induce two types of
models giving rise to the linear-time and branching-time dichotomy. A linear-time model
expresses the full nondeterministic behavior of a system in terms of the set of possible
runs; time is treated as if each moment there is a unique possible future. Major examples of
structures used to model sets of runs are Hoare traces (captured also by traces equivalence)
for interleaving models [29], and Mazurkiewicz traces [33] and Pratt’s pomsets [41] for
non-interleaving models. The branching-time model is the main one considered in process
algebras and considers the set of runs structured as a computation tree. Each moment in
time may split into various possible futures and semantic models are computation trees.
For non interleaving models, event structures [50] are one of the best known models taking
into account both nondeterminism and true concurrency.

Synchrony vs asynchrony There are two basic approaches to describing interaction be-
tween a sender and a receiver of a message (signal), namely synchronous and asyn-
chronous interaction. In the former case, before proceeding, the sender has to make sure
that a receiver is ready. In the latter case, the sender leaves track of its action but proceeds
without any further waiting. The receiver has to wait in both cases. Process algebras are
mainly synchronous, but asynchronous variants have been recently proposed and are re-
ceiving increasing attention. However, many other successful asynchronous models have
been developed. Among these, it is important to mention Esterel [8], a full fledged pro-
gramming language that allows the simple expression of parallelism and preemption and
is very well suited for control-dominated model designs; Actors [3], a formalism that does
not necessarily records messages in buffers and puts no requirement on the ordering of
message delivery; Linda [24], a model of coordination and communication among sev-
eral parallel processes operating upon objects stored in and retrieved from shared, virtual,
associative memory; and, to conclude, Klaim [18], a distributed variant of Linda with a
strong process algebraic flavor.

## 7 Bibliographic Notes and Further Reading

A number of books describing the different process algebras can be consulted to obtain
deeper knowledge of the topics sketched here. Unfortunately most of them are concen-
trating only on one of the formalisms rather than on illustrating the unifying theories.

CCS The seminal book on CCS is [34], in which sets of operators equipped with an
operational semantics and the notion of observational equivalence have been presented
for the first time. The, by now, classical text book on CCS and bisimulation is [35]. A
very nice, more recent, book on CCS and the associated Hennessy Milner Modal Logic is
[32]; it also presents timed variants of process algebras and introduces models and tools
for verifying properties also of this new class of systems.

CSP The seminal book on CSP is [30], where all the basic theory of failure sets is pre-
sented together with many operators for processes composition and basic examples. In
[44], the theory introduced in [30] is developed in full detail and a discussion on the dif-
ferent possibilities to deal with anomalous infinite behaviors is considered together with
a number of well thought examples. Moreover the relationships between operational and
denotational semantics are fully investigated. Another excellent text book on CSP is [47]
that also considers timed extensions of the calculus.

ACP The first published book on ACP is [5], where the foundations of algebraic theories
are presented and the correspondence between families of axioms, and strong and branch-
ing bisimulation are thoroughly studied. This is a book intended mainly for researchers
and advanced students, a gentle introduction to ACP can be found in [20].

Other Approaches Apart from these books, dealing with the three process algebras pre-
sented in these notes, it is also worth mentioning a few more books. LOTOS, a process
algebra that was developed and standardized within ISO for specifying and verifying
communication protocols, is the central calculus of a recently published book [10] that
discusses also the possibility of using different equivalences and finer semantics for the
calculus. A very simple and elegant introduction to algebraic, denotational and opera-
tional semantics of processes, that studies in detail the impact of the testing approach on a
calculus obtained from a careful selection of operators from CCS and CSP, can be found
in [26]. The text [46] isthebook on theπ-calculus. For studying this calculus, the reader
is, however, encouraged to consider first reading [36].

Behavioral Equivalences The theories of equivalences can be found in a number of books
targeted to describing the different process algebras. The theory of bisimulation is in-
troduced in [35] while failure and trace semantics are considered in [30] and [44]. The
testing approach is presented in [26]. Moreover, interesting papers relating the different
approaches are [17], the first paper to establish precise relationships between the many
equivalences proposed in the literature, and the two papers by R. van Glabbeek: [48],

considering systems with only visible actions, and [49], considering also systems with in-
visible actions. In his two companion papers R. van Glabbeek provides a uniform, model-
independent account of many of the equivalences proposed in the literature and proposes
several motivating testing scenarios, phrased in terms of “button pushing experiments” on
reactive machines to capture them. Bisimulation and its relationships with modal logics
is deeply studied in [28], while a deep study of its origins and its use in other areas of
computer science is provided in [45]. Branching bisimulation was first introduced in [5],
while the testing based equivalences were introduced in [19]. Failure semantic was first
introduced in [11].

Acknowledgements

These notes have been prepared as two separate entries (on Process Algebras and Be-
havioral Equivalences) for the Encyclopedia of Parallel Computing to be published by
Springer USA. The notes have benefitted from comments and suggestions by the edi-
tors and by many colleagues that helped removing many imprecisions and improving the
quality of the presentation.

## References

1. M. Abadi and A. D. Gordon. A calculus for cryptographic protocols: The spi calculus.Inf. Comput., 148(1):1–70, 1999.
2. L. Aceto and A.D. Gordon editors.Proceedings of the Workshop ”Essays on Algebraic Process Calculi” (APC
   25), Electronic Notes in Theoretical Computer Science vol. 162. Elsevier, 2005.
3. G. Agha.Actors: A Model of Concurrent Computing in Distributed Systems. MIT Press, 1986.
4. A. Aldini, M. Bernardo, and F. Corradini. A Process Algebraic Approach to Software Architecture Design.
   Springer, 2010.
5. J.C.M. Baeten and W.P. Weijland.Process Algebra. Cambridge University Press, 1990.
6. J.A. Bergstra and J.W. Klop. Process algebra for synchronous communication.Information and Control, 60(1-
   3):109–137, 1984.
7. J.A. Bergstra, A. Ponse, and S.A. Smolka editors.Handbook of Process Algebra. Elsevier, 2001.
8. G ́erard Berry and Georges Gonthier. The esterel synchronous programming language: Design, semantics, imple-
   mentation.Sci. Comput. Program., 19(2):87–152, 1992.
9. L. Bettini, V. Bono, R. Nicola, G. Ferrari, D. Gorla, M. Loreti, E. Moggi, R. Pugliese, E. Tuosto, and B. Venneri.
   The klaim project: Theory and practice, 2003.
10. H. Bowman and R. Gomez.Concurrency Theory: calculi and Automata for Modelling Untimed and Timed Con-
    current Systems.Springer, 2006.
11. S. D. Brookes, C. A. R. Hoare, and A. W. Roscoe. A theory of communicating sequential processes. J. ACM,
    31(3):560–599, 1984.
12. F. Calzolai, R. De Nicola, M. Loreti, and F. Tiezzi. Tapas: A tool for the analysis of process algebras.Transactions
    on Petri Nets and Other Models of Concurrency, 1:54–70, 2008.
13. L. Cardelli and A. D. Gordon. Mobile ambients.Theor. Comput. Sci., 240(1):177–213, 2000.
14. E.M. Clarke and E.A. Emerson. Design and synthesis of synchronization skeletons using branching-time temporal
    logic. InProceedings of Logic of Programs, pages 52–71. Springer–Verlag, 1982.
15. R. Cleaveland and S. Sims. The ncsu concurrency workbench. InCAV, volume 1102 ofLecture Notes in Computer
    Science, pages 394–397. Springer–Verlag, 1996.
16. J.H. Conway.Regular Algebra and Finite Machines. Chapman and Hall, London, 1971.

17. R. De Nicola. Extensional equivalences for transition systems.Acta Informatica, 24(2):211–237, 1987.
18. R. De Nicola, G.L. Ferrari, and R. Pugliese. Klaim: A kernel language for agents interaction and mobility.IEEE
    Trans. Software Eng., 24(5):315–330, 1998.
19. R. De Nicola and Matthew Hennessy. Testing equivalences for processes.Theor. Comput. Sci., 34:83–133, 1984.
20. W. Fokkink.Introduction to Process Algebra.Springer–Verlag, 2000.
21. C. Fournet and G. Gonthier. The join calculus: A language for distributed mobile programming. In Gilles Barthe,
    Peter Dybjer, Luis Pinto, and Jo ̃ao Saraiva, editors,APPSEM, volume 2395 ofLecture Notes in Computer Science,
    pages 268–332. Springer, 2000.
22. F. Gadducci and U. Montanari. The tile model. In G. Plotkin, C. Stirling, and Eds. M. Tofte, editors,Proof,
    Language and Interaction: Essays in Honour of Robin Milner, pages 133–166. MIT Press, 2000.
23. H. Garavel, F. Lang, and R. Mateescu. An overview of CADP 2001. InEuropean Association for Software Science
    and Technology (EASST), volume 4 ofNewsletter, pages 13–24, 2002.
24. D. Gelernter and N. Carriero. Coordination languages and their significance.Commun. ACM, 35(2):96–107, 1992.
25. J.F. Groote, A.H.J. Mathijssen, M.A. Reniers, Y.S. Usenko, and M.J. van Weerdenburg. Analysis of distributed
    systems with mcrl2. InProcess Algebra for Parallel and Distributed Processing (M. Alexander and W. Gardner,
    eds.), pages 99–128. Chapman Hall, 2009.
26. M. Hennessy.Algebraic theory of Processes. The MIT Press, 1988.
27. M. Hennessy.A Distributed Pi-Calculus. CAmbridge University Press, 2007.
28. M. Hennessy and R. Milner. Algebraic laws for nondeterminism and concurrency.J. ACM, 32(1):137–161, 1985.
29. C. A. R. Hoare. A calculus of total correctness for communicating processes.Sci. Comput. Program., 1(1-2):49–
    72, 1981.
30. C. A. R. Hoare.Communicating Sequential Processes. Prentice-Hall, Inc., 1985.
31. D. Kozen. Results on the propositionalμ-calculus.Theor. Comput. Sci., 27:333–354, 1983.
32. K. G. Larsen L.Aceto, A. Ingolfsdottir and J. Srba.Reactive Systems: Modelling, Specification and Verification.
    Cambridge University Press, 2007.
33. A. Mazurkiewicz. Introduction to trace theory. In G. Rozenberg V. Diekert, editor,The Book of Traces, pages
    3–67. World Scientific, Singapore, 1995.
34. R. Milner.A Calculus of Communicating Systems., volume 92 ofLecture Notes in Computer Science. Springer–
    Verlag, 1980.
35. R. Milner.Communication and concurrency.Prentice-Hall, Inc., Upper Saddle River, NJ, USA, 1989.
36. R. Milner.Communicating and Mobile Systems: the Pi-Calculus. Cambridge University Press, 1999.
37. R. Milner.The Space and Motion of Communicating Agents. Cambridge University Press, 2009.
38. F. Moller and P. Stevens. Edinburgh Concurrency Workbench user manual. Available from
    [http://homepages.inf.ed.ac.uk/perdita/cwb/.](http://homepages.inf.ed.ac.uk/perdita/cwb/.)
39. E.-R. Olderog.Nets, Terms and Formulas. Cambridge University Press, 1991.
40. G. D. Plotkin. A structural approach to operational semantics.J. Log. Algebr. Program., 60-61:17–139, 2004.
41. V. Pratt. Modeling concurrency with partial orders.International Journal on Parallel Processing, 1:3371, 1986.
42. W. Reisig. Petri Nets: An Introduction, volume 4 ofMonographs in Theoretical Computer Science. An EATCS
    Series. Springer, 1985.
43. A.W. Roscoe. Model-checking csp. InA Classical Mind: essays in Honour of C.A.R. Hoare.Prentice-Hall, Inc., 1994.
44. A.W. Roscoe.The Theory and Practice of Concurrency. Prentice-Hall, Inc., 1998.
45. D. Sangiorgi. On the origins of bisimulation and coinduction.ACM Trans. Program. Lang. Syst., 31(4):15.1–15.41, 2009.
46. D. Sangiorgi and D. Walker.Theπ-Calculus: A Theory of Mobile Processes. Cambridge University Press, 2001.
47. S.A. Schneider.Concurrent and Real Time Systems: the CSP Approach. John Wiley, 1999.
48. R.J. van Glabbeek. The linear time - branching time spectrum i: the semantics of concrete, sequential processes.
    InHandbook of Process Algebra (J.A. Bergstra, A. Ponse and S.A. Smolka, eds.), pages 3–99. Elsevier, 2001.
49. R. J. van Glabbeek. The linear time - branching time spectrumii. InCONCUR ’93, 4th International Conference
    on Concurrency Theory, (E. Best ed.), volume 715, pages 66–81. Springer–Verlag, 1993.
50. G. Winskel. An introduction to event structures. In J. W. de Bakker, W. P. de Roever, and G. Rozenberg, editors,
    Linear Time, Branching Time and Partial Order in Logics and Models for Concurrency - Rex Workshop, volume
    354 ofLecture Notes in Computer Science, pages 364–397. Springer, 1989.
