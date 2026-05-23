---
tags:
  - projects
abstract: This page will act as a living document to gather my learnings on the spiral arms project. It will be remain as it is after the completion of the project but learnings from it may be repurposed into new entries elsewhere in the knowledge base.
title: Brightness of spiral arms
---
# Understanding generic hydrodynamical setups of disk-planet systems in Athena++

The biggest problem I have had is to develop a better understanding of frames of reference in which the equations are needed to be implemented in the code, say for example, in the `MeshBlock::ProblemGenerator`. The basic structure of a file looks like as follows

```cpp
// Define initial conditions
void MeshBlock::ProblemGenerator(ParameterInput *pin) {
	// The idea now is to set the initial conditions at each grid-point
	// in the simulation domain. Initial conditions refer to the initial
	// density and momentum of the constituent fluids that make up the disk
	// In case of disk-planet interactions, the "planet" itself is not part of
	// initial conditions (even if it is assumed to start exerting its
	// gravitational influence at t=0), but rather in a separate source
	// function.
	
	// Assume the program has been configured for spherical coordinates.
	for (int k = ks; k <= ke; ++k) {
		// Notice the order of loops, the first index is `x3`, or in the case
		// of spherical coordinates, φ.
		Real x3 = pcoord->x3v(k); // φ
		// Also note the special variables offered by the `MeshBlock` class
		// in the form of `ks`, `ke`, `js`.. etc, providing the start and
		// end indices for us to loop over. Later when setting boundary conditions
		// we will see how handy they are when ghost cells also
		// get involved.
		for (int j = js; j <= je; ++j) {
			Real x2 = pcoord->x2v(j); // θ
			for (int i = is; i <= ie; ++i) {
				Real x3 = pcoord->x1v(i); // r
				
				// Now goes the logic to set the conditions. Again,
				// one must set the initial density and momentum at least.
				// Depending on the EOS, energy and pressure also need to be
				// set. One important thing to note is often in these problems
				// we assume locally isothermal or vertically isothermal EOS.
				// This needs to be set by the user explicitly as the 
				// `--eos=isothermal` configuration option while compiling the code
				// is only applicable to globally isothermal EOS. 
				
				// A simple way to understand this is through sound speed.
				// Globally isothermal implies `c_s` is constant everywhere.
				// Vertically isothermal implies `c_s` has some dependence in
				// radial direction.
			}
		}
	}
}

```

# Understanding the planetary potential

Most model papers define gravity exerted by the planet by specifying its potential $\Phi_p$. Huang+25 uses the following potential

$$
\begin{split}
\Phi_p = &- \dfrac{GM_p}{\left[R^2+R_p^2-2RR_p \cos (\phi-\Omega t)+r_s^2\right]^{1/2}}\\
&+\dfrac{GM_pR\cos (\phi-\Omega t)}{R_p^2} - \dfrac{GM_pz}{\left(z^2+r_s^2\right)^{3/2}}
\end{split}
$$

In the code, we have the 3 variables for each direction, depending on the choice of our coordinate system. For simplicity, let us work in spherical coordinates. $\Phi_p$ is a scalar quantity, but the acceleration corresponding to this potential will be a vector. This acceleration $\mathbf{a}$, can be calculated as

$$
\begin{split}
a &= - \nabla \Phi_p \\
&= - \dfrac{\partial \Phi_p}{\partial R} \hat{e}_R - \dfrac{\partial \Phi_p}{\partial \phi} \hat{e}_{\phi} - \dfrac{\partial \Phi_p}{\partial z} \hat{e}_z
\end{split}
$$

Before we substitute $\Phi_p$ in above equation it is nice to simplify it a bit. Let us define some more variables:

$$
\begin{split}
\Delta \phi &= \phi - \Omega t \\
d^2 &= R^2+R_p^2 - 2RR_p \cos (\Delta \phi) \\
\tilde{d^2} &= d^2 + r^2_s
\end{split}
$$

This reduces the potential $\Phi_p$ to:

$$
\Phi_p = - GM_p \left[\dfrac{1}{\tilde{d}} + \dfrac{R \cos (\Delta \phi)}{R^2_p} - \dfrac{z}{\left(z^2+r_s^2\right)^{3/2}}\right] 
$$
Now, let's start by writing $a_R$:

$$
\begin{split}
a_R^{(1)} &= - \dfrac{\partial \Phi_p}{\partial R} \\
&= -GM_p \left[-\dfrac{1}{\tilde{d^2}}\cdot \dfrac{\partial}{\partial R} \left(\tilde{d}\right) \right]\\
&= -GM_p \left[-\dfrac{1}{\tilde{d^2}}\cdot \dfrac{\partial}{\partial R} \left(\sqrt{d^2+r_s^2}\right) \right]\\
&= -GM_p \left[-\dfrac{1}{\tilde{d^2}}\cdot \left(\dfrac{1}{2} \dfrac{1}{\sqrt{d^2+r_s^2}}\cdot 2d \cdot \dfrac{\partial}{\partial R}(d)\right) \right]\\
&= -GM_p \left[-\dfrac{1}{\tilde{d^3}}\cdot \left(d \cdot \dfrac{\partial}{\partial R}\left(\sqrt{R^2+R_p^2-2RR_p \cos (\Delta \phi)}\right)\right) \right]\\
&= -GM_p \left[-\dfrac{1}{\tilde{d^3}}\cdot \left(d \cdot \dfrac{R-R_p \cos(\Delta \phi)}{\sqrt{R^2+R_p^2-2RR_p \cos (\Delta \phi)}} \right) \right]\\
&= -GM_p \left[-\dfrac{1}{\tilde{d^3}}\cdot \left(d \cdot \dfrac{R-R_p \cos(\Delta \phi)}{d} \right) \right]\\
&= -GM_p \left[-\dfrac{R-R_p \cos(\Delta \phi)}{\tilde{d^3}} \right]\\
&= GM_p \left[\dfrac{R-R_p \cos(\Delta \phi)}{\tilde{d^3}} \right]\\
\end{split}
$$

Similarly, the indirect term, 

$$
\begin{split}
a_R^{(2)} &= -\dfrac{GM_p \cos (\Delta \phi)}{R_p^2}
\end{split}
$$

The third term has no dependence on $R$ so it vanishes. In the code, this is implemented as follows:
```cpp
// In the function `PlanetaryGravity` in disk_planet_spherical.cpp and solar_system.cpp
// this d
distance_square(i) = SQR(x_dis(i)) + SQR(y_dis(i)) + SQR(z_dis(i)); 
// this is R - R_p cos (Δ) 
R_dis(i) = R_arr(i) - rad_planet[p] * std::cos(phi_arr(i) - phi_planet_move); // 
// this is GM_p / (\tilde{d^3}) (assuming `PlanetaryGravityOrder == 2`)
gravity(i) = (planet_gm / std::pow(distance_square(i) + SQR(rad_soft[p]), 1.5));
// this is the indirect term
indirect_acc_R(i) = planet_gm * std::cos(phi_arr(i) - phi_planet_move) / SQR(rad_planet[p]);
```

Similarly, one can derive expressions for $a_{\phi}$ and $a_z$. The spherical polar components then can be obtained through simple co-ordinate transformation.

## Implementing the Bae+25 potential

Bae+25 defines their potential as

$$
\Phi_p = -\dfrac{GM_p}{d} \left[\left(\dfrac{d}{\epsilon}\right)^4 - 2\left(\dfrac{d}{\epsilon}\right)^3 + 2 \left(\dfrac{d}{\epsilon}\right)\right]
$$

when $d\le \epsilon$. For $d \ge \epsilon$, there is no [[Gravitational Softening|softening of the potential]]. So let's proceed by calculating $a_R^{(1)}$ (the other two terms are same):

$$
\begin{split}
a_R^{(1)} &= - \dfrac{\partial \Phi_p}{\partial R} \\
&= -GM_p \left[\dfrac{3d^2}{\epsilon^4} - \dfrac{4d}{\epsilon^3} \right] \dfrac{\partial d}{\partial R} \\
&= -GM_p \left[\dfrac{3d^2}{\epsilon^4} - \dfrac{4d}{\epsilon^3} \right] \dfrac{\partial}{\partial R} \left(\sqrt{R^2+R_p^2-2RR_p \cos (\Delta \phi)}\right) \\
&= -GM_p \left(\dfrac{3d^2}{\epsilon^4} - \dfrac{4d}{\epsilon^3} \right) \cdot \left(\dfrac{R-R_p \cos(\Delta \phi)}{d}\right)\\
&= -GM_p \left(\dfrac{3d}{\epsilon^4} - \dfrac{4}{\epsilon^3} \right) \cdot \left(R-R_p \cos(\Delta \phi)\right)\\
&= GM_p \left(\dfrac{4}{\epsilon^3} - \dfrac{3d}{\epsilon^4}\right) \cdot \left(R-R_p \cos(\Delta \phi)\right)\\
\end{split}
$$

We can now now compare the terms on how to modify the code. Essentially we need to make the following replacement:

$$
\dfrac{1}{\tilde{d^3}} \rightarrow \left(\dfrac{4}{\epsilon^3} - \dfrac{3d}{\epsilon^4}\right)
$$

which translated to following in the code

```cpp
Real d = std::sqrt(distance_square(i));
Real epsilon = rad_soft[p];
if (d <= epsilon) {
	Real x = d / epsilon;
	gravity(i) = planet_gm * (4.0 - 3.0 * x) / (epsilon * epsilon * epsilon);
} else {
	// No softening
	gravity(i) = planet_gm / (d * d * d);
}
```

# The Hydro-RT iteration

For the solar-system models, we started with the @chiang1997spectral mid-plane profile given by their Equation (14a)

$$
T(R) = 150 \cdot \left(\dfrac{R}{\mathrm{AU}}\right)^{-3/7} \mathrm{K}
$$

At the location of Jupiter ($r = 5.2\;\mathrm{AU}$) this implies $T \approx 74\; \mathrm{K}$. We can derive the other parameters needed as follows:

$$
c_s^{2} = \dfrac{k_B T}{\mu m_{\mathrm{H}}}
$$

To make $c_s^2$ scale-free, we can divide it by the Keplerian velocity

$$
v^2 = \dfrac{GM}{R}
$$

After putting in the values this gives $c^2_{s,0} = 1.521 \times 10^{-3}$. $q$-value is simply $-3/7$, the exponent of the temperature profile. The surface density exponent, $p$-value can subsequently be calculated. We start with following relation:

$$
\Sigma \sim \rho_{\text{mid}} H
$$

This is true for vertically isothermal disks. So we have

$$
\begin{equation}
\begin{split}
	\Sigma &\propto \rho_{\text{mid}} H \\
	&\propto r^p \cdot \dfrac{c_s}{\Omega} \\
	&\propto r^p \cdot r^{q/2} \cdot r^{3/2}  
\end{split}
\end{equation}
$$

Ultimately, @chiang1997spectral says to have $\Sigma \propto r^{-3/2}$, so we can put values of $q$ and find $p$, which comes out to be $\approx -2.78$. 

Now, upon performing a radiative transfer run, we will have the dust temperature profile. We take dust temperature equal to gas temperature at midplane and get a new estimate to improve our initial MMSN profile (reason for this is LTE, but look at Appendix B of  @speedie2022observing for a more quantitative treatment). The above hydro iteration gave me a temperature of $\sim 43\;\mathrm{K}$. First step is get the new $c^2_{s,0}$, which is straightforward, we just need to put the values with temperature now as 43 K instead of 74 K. This gives new value of $c_{s,0}^2 = 8.94 \times 10^{-4}$. To get the new value for $q$, we need to fit the midplane temperature profile. I used `np.polyfit` to get $q = -0.47557$, and thus $p = -2.7622$.