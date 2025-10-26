---
tags:
  - physical-structure
  - planet-formation
---
As mentioned earlier, density structure is one of the first and primary inputs for the model. The density profiles are inspired by Lyndell-Bell and Pringle for disks, and Ulrich for [[Disk Envelopes|envelopes]].

For envelopes, the model allows for the use of a simple radial profile of gas density given by:
$$
\rho_g (R) = \rho_g (R_c) \left( \dfrac{R}{R_c} \right)^{-\beta}
$$

where $R$ is the radial co-ordinate in the spherical co-ordinate system, $R_c$ is the [[Characteristic Radius|characteristic radius]] at which one has the density known and $\beta$ is the radial power law exponent for envelope density. 

The model also has the option of choosing a more physical envelope gas density structure, which is
derived from an in-falling rotating envelope model, given by:
$$
\rho_g (R, \mu) = \rho_{g, 0} \left( \dfrac{R}{R_{\text{cen}}} \right)^{-3/2} \left( 1 +\dfrac{\mu}{\mu_0} \right)^{-1/2} \left( \dfrac{\mu}{2\mu_0} + \dfrac{R_{cen}}{R} \mu_0^2 \right)
$$
where $\rho_{g, 0}$ is the gas density parameter of the envelope; $R_{\text{cen}}$ is the centrifugal radius of the in-falling envelope; $\mu$ is the cosine of the polar co-ordinate in the spherical co-ordinate system and $\mu_0$ is the value of $\mu$ as $R \rightarrow \infty$.

