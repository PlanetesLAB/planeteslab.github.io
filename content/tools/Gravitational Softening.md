---
tags:
  - numerical-methods
  - modeling
  - physics
  - hydrodynamics
status: review
---
The standard Newtonian gravitational potential diverges as the distance to the mass goes to zero. This is problematic if we want to resolve physics at arbitrarily small radii, more so for the numerical solvers at work to converge to required value ([[Numerical Stiffness|numerical stiffness]]). 

In grid-based codes, the fluid is [[Discretization|discretized]] on [[Finite Volume Methods|finite-volume]] cells. 