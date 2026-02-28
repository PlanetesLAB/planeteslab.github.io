---
tags:
  - physics
---
The theory of radiative transfer describes how electromagnetic radiation travels through a medium.

Consider a point source emitting radiation isotropically in all directions. By placing a spherical shells $S_0$ and $S$ at radii $r_0$ and $r$, we can write, by conserving the energy:

$$
E = F (S_0) \cdot 4 \pi r_0^2 = F(S) \cdot4\pi r^2
$$

If we assume one of the shells, say $S_0$, is fixed, then we can write

$$
F(S) \propto \frac{k}{r^2}
$$

which is the inverse square law. Now $F(S)$ represents a quantity which is representative of all the rays of radiation passing through the surface. A single ray is a mathematical *idealization* and by definition has zero cross-section area to carry some of that energy. However, we may consider some infinitesimal area $dA$ through which a *bundle* of rays is passing perpendicularly. 
![[geometry-of-normally-incident-rays.png]]
Now this bundle can carry energy as it has some cross-sectional area, which we can write as

$$
dE = I_{\nu} \; dA \cos \theta \; dt\; d \Omega\; d\nu
\tag{1}
\label{s11}
$$

We define $I_{\nu}$ as the **specific intensity** and $\theta$ is the angle between the vector normal to $dA$ and direction of $d \Omega$. The way to understand this expression is quite simple. We want to know *how much energy*
1. is going to cross the infinitesimally small area $dA$,
2. towards direction given by $d \Omega$,
3. in time $dt$,
4. in the frequency range $d\nu$.

Because it gives a more detailed description of the radiation field, it is much more instructive to derive other quantities (like flux) from the specific intensity. One way to derive other quantities is to calculate the [[Moment|moments]] of $I_{\nu}$. 

# Moments of Specific Intensity

Before we derive any moments, let us write equation $\eqref{s11}$ a bit more generally.

$$
dE = I_{\nu} (\mathbf{r}, \mathbf{n}) \cos \theta \; dA\; dt\; d \Omega\; d\nu
\tag{2}
$$

Next is to ask about the nature of the independent variable for which we will be calculating the moments for. For specific intensity, it is more constructive to think in terms of direction. From the definition, it is clear that $I_{\nu}$ is not a spatial density, but rather a function of direction[^1]. 

## Zeroth moment (Radiation Energy Density)

By definition, zeroth moment of a quantity is something which is does not depend of our independent variable (direction in our case). So we want to derive the quantity which is describes how much radiation is present locally, regardless of the direction.







>[!Related]- See also
>[[Optically Thick and Optically Thin Media#Dust Extinction]]

[^1]: Note that we are trying to define $I_{\nu}$ as a density function, not just any function. So although, it does depend on $\mathbf{r}$, it is not a density function in $\mathbf{r}$.
