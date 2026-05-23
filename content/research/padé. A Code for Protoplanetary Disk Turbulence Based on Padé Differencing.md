---
tags:
  - review
  - numerical-methods
  - protoplanetary-disks
authors:
  - K. Shariff
volume: Vol. 273
issue: Issue 2
published: August 2024
doi: 10.3847/1538-4365/ad5af3
abstract: The Padé code has been developed to treat hydrodynamic turbulence in protoplanetary disks. It solves the compressible equations of motion in cylindrical coordinates. Derivatives are computed using nondiffusive and conservative fourth-order Padé differencing, which has higher resolving power compared to both dissipative shock-capturing schemes used in most astrophysics codes, as well as nondiffusive central finite-difference schemes of the same order. The fourth-order Runge–Kutta method is used for time stepping. A previously reported error-corrected Fargo approach is used to reduce the time step constraint imposed by rapid Keplerian advection. Artificial bulk viscosity is used when shock capturing is required. Tests for correctness and scaling with respect to the number of processors are presented. Finally, efforts to improve efficiency and accuracy are suggested.
journal_logo: apjs.png
---
