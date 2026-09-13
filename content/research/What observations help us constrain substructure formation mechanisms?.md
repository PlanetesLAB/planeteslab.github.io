---
tags:
  - PhD
  - disk-dynamics
  - protoplanetary-disks
  - planet-disk-interactions
  - planet-formation
  - modeling
  - observations
status: writing
---
# General idea

>[!info]
>What follows is heavily based on the review by @baeStructuredDistributionsGas2023 published as part of *Protostars and Planets VII*. 

Since ALMA saw first light, our capability of spatially resolving protoplanetary disks has increased close to ten-fold ($0.01''$ of angular resolution now from previous best of $\gtrsim 0.2''$). This has enabled us to probe protoplanetary disks at AU-scale which has revealed a plethora of substructures like rings, gaps, spirals, crescents, etc. The idea of my research is to understand how can we use observational data and constrain the formation mechanism of a given substructure.

So far, a large fraction of substructures observed to date have been detected in radio continuum and/or optical/near-infrared (NIR) scattered light observations, both of which probe dust grains in the disks. Thus, when interpreting observations, it is important to keep in mind that the spatial distribution of the gas, which contains about 99% of the total disk mass, and that of the dust can differ due to the aerodynamic drag that exerts on the dust. The way to probe gas is to look for molecular line emissions which requires the knowledge of chemistry that is undergoing in the disk. Given the overwhelming percentage of the disk mass is gas and both gas and dust are coupled, it becomes imperative for the forward models that will be used to simulate observations take into account the processes of aerodynamical drag, horizontal drift, vertical settling and diffusion driven by turbulence.

## Kinds of substructures in focus

### Rings and Gaps

1. *Occurrence*: They are the most common type of substructure observed in protoplanetary disks thus far. Rings and gaps are far more common in mm observations (61 disks) compared to NIR observations. One possible explanation to the apparent discrepancy between mm and NIR observations is that the observed rings coincide with pressure maxima, efficiently trapping large particles and facilitating the detection in mm observations.
2. *Multiplicity*: Some of the single-ring systems have been observed at a relatively coarse resolution, and it is possible that future high-resolution observations may detect additional rings and gaps. 
3. *Radial location*: Can be modeled via a 1D Gaussian profile: $I (R) \propto I_0 \exp\left(-\dfrac{(R-R_0)^2}{2 \sigma_R^2}\right)$. Rings have been observed at essentially all radii, with a maximum frequency occurring at 20-50 AU.
4. *Radial width*: Smallest width observed correspond to the highest resolution set by ALMA, while the widest rings may suffer from poor resolution and may contain more narrow rings within them.
5. *Misalignment*: Disks with multiple rings may have them non co-planar to the disk plane (warped disks).

### Spirals

1. *Occurrence*: Spirals are detected at both NIR and mm wavelengths although the properties of the spirals inferred at different wavelengths do not necessarily match.
2. *Multiplicity*: Spirals in NIR observations tend to reveal a larger number of spirals: all five systems with 6 or more spirals are observed in NIR, whereas mm observations have so far revealed only two- or three-armed spirals.
3. *Pitch Angle*: The pitch angle is $\psi$ is given by $\tan \psi = -\mathrm dR/(R \mathrm d\phi)$. Some trends and correlations have been observed but they also depend on the wavelength in which the spiral was observed.
4. *Radial extent*: Observed across a wide range range of radii (again limited by resolution or viewing method).
5. *Time variation*: Although long-term monitoring studies are scarce, they can potentially be used to determine the origin of spirals. For example if the observed speed of spiral is greater (or lesser) then the local Keplerian speed, then it was likely launched from inner (or outer disk).

### Crescents

Crescents are rings which have azimuthal variation in their intensity. Need contrast in the observations to ascertain the presence of crescent. Dust's scattering phase function or disk's geometry can also introduce this contrast so things are not straightforward.

1. *Occurrence*: Rarer than both rings and spirals.
2. *Multiplicity*: Mostly solitary with few exceptions. Although no case where multiple crescents are observed at the same radial location within a single annular structure.
3. *Radial location*: 

# Current state of the Art

# What I can do?
