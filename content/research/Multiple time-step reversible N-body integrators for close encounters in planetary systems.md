---
tags:
  - review
  - n-body-dynamics
  - planetary-systems
  - physics
  - orbital-dynamics
  - numerical-methods
  - modeling
authors:
  - D. M. Hernandez
  - W. Dehnen
volume: Vol. 530
issue: Issue 4
published: April 2024
doi: 10.1093/mnras/stae985
abstract: We present new ‘almost’ time-reversible integrators for solution of planetary systems consisting of ‘planets’ and a dominant mass (‘star’). The algorithms can be considered adaptive generalizations of the Wisdom–Holman method, in which all pairs of planets can be assigned time-steps. These time-steps, along with the global time-step, can be adapted time-reversibly, often at no appreciable additional compute cost, without sacrificing any of the long-term error benefits of the Wisdom–Holman method. The method can also be considered a simpler and more flexible version of the symba symplectic code. We perform tests on several challenging problems with close encounters and find the reversible algorithms are up to 2.6 times faster than a code based on symba. The codes presented here are available on Github. We also find adapting a global time-step reversibly and discretely must be done in block-synchronized manner or similar.
journal_logo: mnras.svg
---
