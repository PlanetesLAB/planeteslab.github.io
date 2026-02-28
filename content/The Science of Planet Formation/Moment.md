---
tags:
  - physics
---
In most simplest terms, a *moment* of a physical quantity is product of the distance to a given point, raised to a power, and the value of that quantity at that point:

$$
\mu_n \equiv r^n Q
$$

A more general definition can be sourced from the theory of probabilities and statistics which deals with density functions and distributions functions (which in turn, are representing some physical quantity). Consider a independent (thus *random*) variable $x$  and a density function (or a distribution function) $f(x)$. In other words, $f(x)$ is some quantity which is distributed over $x$. Then, we can write

$$
M_k = \int x^k f(x) dx
$$

where $M_k$ is the $k$th moment. When dealing with physical quantities, $x$ can have various forms, but the major forms of interest are as follows
1. If $x$ represents spatial position, then $M_k$ would yield geometric moments,
2. If $x$ represents velocity, then $M_k$ would yield kinetic moments,
3. If $x$ represents direction, then $M_k$ would yield angular moments,
4. If $x$ represents energy, then $M_k$ would yield spectral moments.