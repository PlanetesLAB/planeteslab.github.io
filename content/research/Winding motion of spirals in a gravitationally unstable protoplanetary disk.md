---
tags:
  - review
  - planet-disk-interactions
  - protoplanetary-disks
  - hydrodynamics
  - ALMA
  - observations
  - physics
  - disk-dynamics
authors:
  - T. C. Yoshida
  - H. Nomura
  - K. Doi
  - M. Barraza-Alfaro
  - R. Teague
  - K. Furuya
  - Y. Yamato
  - T. Tsukagoshi
volume: Vol. 9
issue: pp. 1672–1679
published: September 2025
doi: 10.1038/s41550-025-02639-y
abstract: The discovery of wide-orbit giant exoplanets has posed a challenge to our conventional understanding of planet formation through the coagulation of dust grains and planetesimals and the subsequent accretion of protoplanetary disk gas. As an alternative mechanism, the direct in situ formation of planets or planetary cores by gravitational instability (GI) in protoplanetary disks has been proposed. However, observational evidence for GI in regions where wide-orbit planets form is still lacking. Theoretical studies predict that GI induces spiral arms moving at the local Keplerian speed in a disk. Based on several high-angular-resolution observations over a 7-year time baseline using the Atacama Large Millimeter/submillimeter Array, here we report the evidence for spiral arms following the Keplerian rotation in the dust continuum disk around the young star IM Lup. This demonstrates that GI can operate in wide-orbit planet-forming regions, establishing it as a plausible formation mechanism for such planets.
journal_logo: natastro.svg
---
The work presents evidence of [[Gravitational Instability|gravitational instability]] (GI) in the protoplanetary disk around [[IM Lup|IM Lup]] and posits it as a plausible formation mechanism of wide-orbit giant planets (planets at around 20 AU to 70 AU from their star) in situ.

The work is solely concerned with the *in situ* formation of giant planets and thus its scope must be considered limited to explaining how could some planets, that we see today from our telescopes, have formed at the locations where they are right now, without the involvement of [[Planetary Migration|migration]] or planet-planet/star [[Gravitational Scattering|scattering]]. 

When it comes to in situ [[Giant Planet Formation|formation of giant planets]] that far out, there are a few problems. The most accepted formation pathway for giant planets is through [[Core accretion|core accretion]]. We can estimate this as follows:

$$
t_{\text{grow}} \sim \dfrac{M}{\dot{M}}
$$

@safronov1972evolution gives the expression of solid core growth $\dot{M}$:

$$
\dot{M} = \pi R_c^2 \sigma_p \Omega F_g
$$

where $R_c$ is the effective (or capture) radius, $\Omega$ is the angular frequency, $\sigma_p$ is the local surface density of [[Planetesimal Formation|planetesimals]], and $F_g$ is a constant factor accounting for gravitational enhancement[^1] [@greenzweig1992accretion]. One can assume the [[Minimum Mass Solar Nebula|minimum mass solar nebula scaling (MMSN)]] scaling for the surface density:

$$
\sigma_p \propto a^{-3/2} 
$$

@rice2003formation provide reference values for a giant planet at the current location of Jupiter to estimate the growth time scale. A similar treatment can be found in Armitage (2020)[^2] which derives a very slow growth rate at the location of Jupiter. In any case, we can do some algebra and derive how does this rate vary with radius:

$$
\begin{split}
\dot{M} \propto \sigma_p \Omega R_c^2 F_g, \quad t_{\text{grow}} \propto \dfrac{M}{\sigma_p \Omega R_c^2}
\end{split}
$$

if we assume $F_g$ remains constant with radius. Now with mass radius relation under constant density ($M \propto R_s^3$), MMSN scaling ($\sigma_p \propto a^{-3/2}$) and [[Kepler's Laws|Kepler's law]]  ($\Omega \propto a^{-3/2}$), we can conclude 

$$
t_{\text{grow}} \propto a^3
$$

which implies the timescale of growth will be even larger at larger radii (for a body of size $R_s$). Thus, it is not possible to form giant planets at wide orbits *in situ* through core accretion and we must look for alternate mechanisms. GI is one such proposition. This makes observational evidence of GI in disks very critical. 

One of most evident signatures of GI is [[Disk Substructures#Wakes and Spirals|spiral arms]], however because these substructures can also be produced through alternate pathways (planet-disk interactions, stellar fly-bys and even shadows cast by the inner disk), it is essential to categorically devise a way to distinguish between these possibilities. Additionally, spiral arms induced by GI or planet-disk interaction present two different [[Theories of Planet Formation|scenarios]] of planet formation. If the spirals are being induced by a planet, this implies the planet already exists and must have formed at a much earlier stage of the [[Disk Formation and Evolution|disk lifetime]]. On the other hand, GI-induced spirals point to several other key things. If our goal is assert that GI is present, then one of the most useful metric is the [[Toomre's Q]] parameter, which requires following condition for instability in a Keplerian disk:

$$
Q \equiv \dfrac{c_s \Omega}{\pi G \Sigma_0} < 1
$$

In simpler terms, a disk becomes unstable when the gravity is strong enough to overcome the stabilizing internal forces of rotation and thermal pressure. Under our metric, $Q \lesssim 1$
implies an unstable disk and high $Q$ implies stability. From the expression it is clear, high surface density (thus, more [[Disk Mass|massive disk]]) favors instability. So if we are looking for a candidate disk to observe GI, it should be massive. The [[Molecules with ALMA at Planet-Forming Scales (MAPS)|MAPS]] program obtained a mass of $0.1 M_{\odot}$ for IM Lup (whose stellar mass is $1.1 M_{\odot}$), which makes it a good candidate to look for GI. 

According to this work, IM Lup has gravitational self-regulation, which is to say that the disk maintains a *marginally unstable* state, which prevents the system going too further in either direction (runaway expansion or collapse). In terms of Toomre's Q, marginally unstable refers to $Q \sim 1-2$ or $Q \sim \mathcal{O}(1)$. Thus, if GI were to present in IM Lup, then the disk has enough mass, and new planets can form through GI as the disk evolves further.

Now coming back to the differences between GI-induced spirals and planet-induced spirals, the former spirals follow the local Keplerian motion, whereas in the case of latter, the spirals move as if they were single rigid body and follow the Keplerian motion at the radius of the companion. Building on this idea, this work attempts to measure the speed of the spirals observed in IM Lup across seven years of observation from [[Atacama Large Millimeter Sub-millimetre Array (ALMA)|ALMA]], to find the evidence for GI. 

The next step is decide what kind of ALMA observations might help us. For instance, we cannot use [[Disk Dynamics|kinematic structures]] in CO emissions as those emission do not originate form the region we are interested in (where wide-orbit exoplanets are detected). The high resolution observations of IM Lup reveal that grand-design, two-armed symmetric spiral arms are present, and the absence of any shadow in the infrared eliminates the possibility of the shadow scenario. There is [[High turbulence in the IM Lup protoplanetary disk. Direct observational constraints from CN and C2H emission|evidence]] of strong turbulence in IM Lup, but only in the elevated disk layers. However, the claims of kinematic detection of embedded Jupiter-mass planets also exist which could have caused these spirals we have observed. The idea is to use the data across seven years and categorize the driver behind the motion of these spirals.

Before moving on to analysis of the observations, we need to decide what observations to use. This paper uses both continuum and gas emission images to aid in the different steps of the process. First, CO [[Rotation curve|rotation curves]] provide the Toomre's Q parameter, establishing the disk has GI (or at least is marginally unstable). But because they only trace outer and upper layers, we need to use something else. Dust rotation curves reveal spirals throughout the range of our interest (20-70 AU), so authors used them to characterize the motion of the spirals.

# Continuum emissions from IM Lup

The work uses 4 separate observational epochs, and thus the first step is to convolve them to a set [[Beamsize|beamsize]] and position angle.

## Image Analysis method

$$
\omega(r) = \omega_0 \left(\dfrac{r}{1^{\prime\prime}}\right)^{-\gamma} + \omega_f
$$

Log-likelihood of wrt to each epoch:

$$
-\dfrac{1}{2} \sum_{i} \sum_{\text{image}} \left(\dfrac{I_i - I_{\text{ref}}}{\sigma_{i, \text{ref}}}\right)^2
$$

## Radius-by-radius method

$$
\begin{split}
\chi^2 (r, \omega) &= \sum_{i < j} \sum_{\phi} \left(\dfrac{I_i (r, \phi) - I_j (r, \phi - \omega \Delta T_{i,j})}{\sigma_{i,j}}\right)^2, \\ 
\text{where} \quad \sigma_{i, j} &= \sqrt{\sigma_i^2  + \sigma_j^2}
\end{split}

$$




[^1]: todo: What is this?

[^2]: *Astrophysics of Planet Formation, Equation 5.32*: $\dfrac{dR_s}{dt} \approx 1 \left(\dfrac{\Sigma_p}{10\; \text{g\;cm}^{-2}}\right) F_g \text{\;cm\;yr}^{-1}$

