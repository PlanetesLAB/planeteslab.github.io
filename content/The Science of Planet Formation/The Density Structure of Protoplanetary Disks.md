---
tags:
  - physical-structure
---
For disks, the gas surface density is derived from the parametric profile suggested by Lyndell-Bell and Pringle, which holds for a disk that has attained hydrostatic equilibrium:
$$
\Sigma_g (r) = \Sigma_g (r_{\text{ref}}) \left( \dfrac{r}{r_{\text{ref}}} \right)^{-\gamma}
$$

An additional exponential tapering term is also added in some cases, to obtain a better fit with observations:
$$
\Sigma_g (r) = \Sigma_g (r_{\text{ref}}) \left( \dfrac{r}{r_{\text{ref}}} \right)^{-\gamma} \exp \left[ - \left( \dfrac{r}{r_{\text{ref}}} \right)^{2-\gamma} \right]
$$
where $r_{\text{ref}}$ is the reference or [[Characteristic Radius|characteristic radius]] where some quantities are known and $\gamma$ is the power law exponent for the surface density profile.
To model disks for which we have no constrained value for the gas surface density at a reference radius, we can use the total gas mass of the disk, $M_g$ (another quantity that can be constrained from observations), and invert the following relation to obtain the surface density at the reference radius:
$$
\begin{split} M_g &= \int_{r_{\text{in}}}^{r_{\text{out}}} \Sigma_g (r) rdrd\theta \\ \implies \Sigma_g(r_{\text{ref}}) &= \dfrac{(2-\gamma)M_g}{2 \pi r_{\text{ref}}^2} \left[e^{-\left(\frac{r_{\text{in}}}{r_{\text{ref}}}\right)^{2-\gamma}} - e^{-\left(\frac{r_{\text{out}}}{r_{\text{ref}}}\right)^{2-\gamma}}\right]^{-1} \end{split}
$$
and when we have an exponential taper:

$$
\Sigma_g(r_{\text{ref}}) = \dfrac{(2-\gamma)M_g}{2 \pi r_{\text{ref}}^2} \left[r_{\text{out}}^{2-\gamma} - r_{\text{in}}^{2-\gamma}\right]^{-1}
$$
Another important parameter that we require to model the disks is the [[Scale Height|scale height]] of gas, $H(r)$, which is defined as the local speed of sound to the Keplerian angular velocity of the disk:

$$
H(r) = \dfrac{c_s}{\Omega}
$$
where $\Omega$ is the Keplerian velocity of the disk given by:

$$
\Omega = \sqrt{\dfrac{G M_{\star}}{(r^2 + z^2 )^{3/2}}}
$$
$c_s$ is the *isothermal* speed of sound given by:
$$
c_s = \sqrt{\dfrac{k_{B} T_g}{\mu m_p}}
$$
where $\mu$ is the mean molecular mass of the gas and $m_p$ is the mass of the proton, giving us:

$$
H (r) = \sqrt{ \dfrac{k_B T_g(r) (r^2 + z^2)^{3/2}}{\mu GM_{\star}}}
$$
The scale height is a measure of the amount of [[Flaring in the disks|flaring in the disks]], i.e. how much the disk rise in altitude from the mid-plane, with increasing radius. If the scale height is known at the [[Characteristic Radius|reference radius]], or the gas mid-plane temperature is known at the reference radius which can be used to calculate the scale height using the above expression, one can scale the scale height for other radii too using a simple power-law:

$$
H(r) = H(r_{\text{ref}})\left(\dfrac{r}{r_{\text{ref}}}\right)^{\psi}
$$
with $\psi$ being the [[Flaring in the disks#Flaring parameter|flaring parameter]].

### A Short Digression on Disk Morphology

The density structure described by formulas above are the base skeletons. They can be further modified to account for [[Disk Morphology|disk morphology]], which includes how the inner edge is modeled (razor-sharp or smoothened?) as well as how the outer edge tapers off. The formulation is as follows:

$$
\rho (r, z) = 
\begin{cases}
0, & \text{if } r < r_{\text{in}} \text{ or } r > r_{\text{out}} \\
\text{(defined elsewhere)}, & \text{otherwise}
\end{cases}
$$

which just filters the radial points which are out of bounds of the disk inner and outer edges. Now, we need to discuss something called the *truncated power law* distributions. They are also called as power laws with exponential cutoff. A power law with an exponential cutoff is simply a power law multiplied by an exponential function:

$$
f(x) = x^{-\alpha}e^{-\beta x}
$$

Given this, let us define following two power laws:

$$
p_1 = \exp \left(- \dfrac{r_{\text{in}}}{r_{\text{c}}} \right)^{2-\gamma}
$$
and

$$
p_2 = \exp \left(- \dfrac{r_{\text{out}}}{r_{\text{out}}} \right)^{2-\gamma}
$$

and then

$$
\Sigma_c = \dfrac{(2.0 - \gamma) M_d}{2\pi r_c^2 (p_1 - p_2)}
$$

Further, if the radial point is less than the flattening parameter for inner edge,

$$
r_c = 
\begin{cases}
\dfrac{r_{\text{in}}^{\text{flat}}}{r_c} & \text{if } r < r_{\text{in}}^{\text{flat}} \\
\dfrac{r}{r_c}, & \text{otherwise}
\end{cases}
$$

