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

# A chronological timeline

An overview and selection of papers on how the current state-of-the-art has been developed.

---
## Pre-DSHARP Era
1. @perezPLANETFORMATIONSIGNPOSTS2015a — Can we observe [[Circumplanetary Disk|circumplanetary disks (CPDs)]] through gas kinematics? For this we can think of the spectra cube carrying information in the form of $I (x,y,v)$, where $(x, y)$ is the sky position and $v$ is the velocity. They used following probes to establish detectability:
    - *A compact emission separated in velocity from the overall circumstellar disk’s Keplerian pattern*: This basically refers to the emission from the deviations in the velocities of gas induced by planet's gravity. The expected Keplerian linr-of-sight velocity is given by:
	  $$
	  v_{\mathrm{los}} = v_k (r) \sin i \cos \phi	
	  $$
	  where $i$ is the disk inclination and $\phi$ is the azimuthal angle. If there is a planet/CPD, we observe some deviations as gas also goes around the planet. In other words we can see if the emission $I (x,y,v)$ occurs at an unexpected $v$.
    - *A strong impact on the velocity pattern when the Doppler-shifted line emission sweeps across the CPD location*: The perturbation induced by the planet in the Keplerian LOS velocity will result in the emission showing show up in a different velocity channel in the line emission cube. Here, we can see if at a particular $v$, the emission pattern is unexpected.
    - *A local increase in the velocity dispersion*: Finally here, we can check if the emission is spread over a wide range of $v$. Larger velocity implies [[Line broadening|broadened line emission]].
2. @flockGapsRingsNonaxisymmetric2015 — Another work which establishes that we don't *need* a companion to produce gaps, rings and non-axisymmetric substructures in disks.
3. @isellaRingedStructuresHD2016 — One of the pre-DSHARP works which used both continuum and line emission ALMA observations to study rings in [[HD163296]].
---
## The DSHARP Era
First large scale survey with focus on substructures. DSHARP was a mostly continuum-only survey, with resolution up to 5 AU. 
1. @andrewsDiskSubstructuresHigh2018 — The survey tells us substructures are common but to discern their origin is not straightforward and entangled with numerous degeneracies.
2. @huangDiskSubstructuresHigh2018 — Discussion on gaps and rings, as well as their potential origin.
3. @huangDiskSubstructuresHigh2018a — Focus on spirals in [[Elias 2-27|Elias 27]], [[IM Lup]], and [[WaOph 6]]. [[Gravitational Instability|GI]] can cause spirals, which can later fragment and directly form planets. 
4. @dullemondDiskSubstructuresHigh2018 — Dust rings by pressure maxima, but to know the origins of pressure maxima, we need to observe gas.
5. @zhangDiskSubstructuresHigh2018 — The canonical explanation for gaps and rings: planets. But as we will later see, several purely physical processes can also create these substructures.
6. @isellaDiskSubstructuresHigh2018 — Continuum together with optically thick $^{12}\text{CO}$ in [[HD163296]] to reveal rings, a small crescent, and other asymmetries.

---

## Kinematic detections of planet candidates
1. @teagueKinematicalDetectionTwo2018 — Measured the $\text{CO}$ [[Rotation curve|rotation curve]] and infer perturbations in gas pressure gradient associated with continuum gaps. 
2. @pinteKinematicEvidenceEmbedded2018 — Instead of an azimuthally averaged rotation curve, they identify a localized kink in individual CO channel maps of [[HD163296]]. 
3. @pinteKinematicDetectionPlanet2019 — Applied the same methodology as @pinteKinematicEvidenceEmbedded2018 to another disk.

---
## Beyond kinematic detections
1. @teagueMeridionalFlowsDisk2019 — Decomposition of gas motion into $v_{\phi}$, $v_{r}$ and $v_z$ to reveal vertical flows. Now, what is the origin of this? A planet can produce it, sure, but can we link it to a particular hydrodynamic process?
2. @casassusKinematicDetectionsProtoplanets2019 — Introduced the concept of the Doppler flip: across a planetary wake, the sign of the velocity residual reverses. But can we see Doppler flip in non-planetary perturbations too? As we see later, indeed we can.
3. @perezLongBaselineObservations2020 — Another multi-tracer work. They see continuum structure, $\text{CO}$ wiggles and kinks in gas emissions, and on probing deeper with optically thin isotopes, perturbations grow weaker, suggesting a vertical dependence of the flow. This sows the seeds of what would later become full molecular line vertical [[Line Emission Tomography|tomography]].

---
## Focus on non-planet kinematic fingerprints
1. @hallPredictingKinematicEvidence2020 — Now we move to formal discussions on producing the substructures as well as gas kinematics through non-planetary origins. Enter the *GI wiggle*. 
2. @barraza-alfaroObservabilityVerticalShear2021 — Detectability of [[Vertical shear instability|VSI]] now becomes possible.
3. @paneque-carrenoSpiralArmsMassive2021 — Evidence for [[Gravitational Instability|GI]] in [[Elias 2-27]]. These guys combined observations of spirals in continuum and line emissions of $^{13}\text{CO}$ and $\text{C}^{18}\text{O}$. They constrained emitting surface structure by studying the non-Keplerian kinematics using hydrodynamic simulations. They argue for GI triggered by infall.
4. @veronesiDynamicalMeasurementDisk2021 — Semi-relevant to my other project of estimating disk gas mass. Only here, the probe is not chemistry but rather through disk dynamics. You see that the observed line emission is better reproduced if you consider disk self-gravity, and the subsequent disk mass estimate imply that the disk is likely [[Gravitational Instability|gravitationally unstable]].
5. @longariniInvestigatingProtoplanetaryDisk2021 — By studying disk kinematics, one can theoretically constrain the underlying properties of the gas (for example, how much and how does the disk cool by estimating the cooling parameter $\beta$).
6. @terryConstrainingProtoplanetaryDisc2021 — Another theoretical work which attempts to linearly relate the amplitude of the GI wiggle to the disk-to-star mass ratio.

---
## MAPS survey and beyond
1. @lawMoleculesALMAPlanetforming2021a — This can be considered the starting point of vertical line emission tomography. The first step is to get an idea of $z(r)$, how does line emission varies with height by tracing lines with differing optical depths. This will become the foundation to later estimate $\mathbf v(r,\phi,z)$.
2. @teagueMoleculesALMAPlanetforming2021 — Another paper which uses $\text{CO}$ isotopologues emissions and decomposes the projected flow into azimuthally averaged $v_{\phi}$, $v_r$, and $v_z$. They detect coherent velocity structures and connect them to possible planetary perturbations and spirals.
3. @izquierdoNewPlanetCandidate2022 — `discminer` will be quite important. Concepts of quantifying localized perturbation in line emission cubes through the centroid, linewidth and channel morphology. Important read to understand the probes of line kinematics.
4. @casassusDopplerFlipHD2022 — Planets are not the only explanations to Doppler flips and it may also be triggered via strong vertical motions (whose origin remains degenerate), eruption/outflow or infall.
5. @pinteKinematicStructuresPlanetForming2023 — A review to now summarize things till 2023.

---
## On the degeneracy of mechanisms inducing the substructure
1. @stadlerKinematicallyDetectedPlanet2023 — Combines dust continuum, CO channel maps, centroid maps, velocity components and scattered-light information. They find a localized non-Keplerian feature plus a spiral and perturbed cavity. They just companion(s) as solutions to perturbations but can we produce them using some other process as well?
2. @barraza-alfaroKinematicSignaturesPlanet2024  — An example on how people have tried to simulate multiple mechanisms together ([[Vertical shear instability|VSI]]+planet). This work's motivation is more on to understand how a planetary mass object can affect hydrodynamical processes like VSI and if this system can be retrieved from the observations.
3. @longariniAngularMomentumTransport2024 — Another work focussing on the [[Gravitational Instability|GI]] in [[Elias 2-27]]. Here, the motivation is to understand the efficiency of angular momentum transport using the GI wiggle in $^{13}\text{CO}$ line emission.
4. @speedieGravitationalInstabilityPlanetforming2024 — This time we find evidence of [[Gravitational Instability|GI]] in [[AB Aurigae]] using again $\text{CO}$ isotopologues emissions.
5. @sierraHintsPlanetFormation2024 — Similar to earlier works of finding kinematic signatures and linking them to a planetary companion. Same old story of using continuum and line emission together.

---
## exoALMA era
15-disk sample which used three major lines: $^{12}\text{CO} (3 \rightarrow 2)$, $^{13}\text{CO} (3 \rightarrow 2)$, and $\text{CS} (7 \rightarrow 6)$, plus high-resolution continuum, with velocity precision in favorable cases of order of $10 \text{\ ms}^{-1}$. 
1. @teagueExoALMAScienceGoals2025 — The first exoALMA paper which establishes the context and motivation.
2. @izquierdoExoALMAIIILineintensity2025 — Relevant for fitting disk geometry and line emission. But we are more interested in disk dynamics rather than disk parameters.
3. @curoneExoALMAIVSubstructures2025 — Defines the continuum structures against which gas perturbations are compared. Useful reference.
4. @galloway-sprietsmaExoALMAGaseousEmission2025 — Reconstruct $^{12}\text{CO}$, $^{13}\text{CO}$, and $\text{CS}$ emission surfaces and find typical heights around $z / r \simeq 0.28, 0.16, 0.18$ respectively. Why choose $\text{CS}$ though? The answer is lower thermal broadening due to higher molecular mass.
5. @stadlerExoALMAVIRotating2025 — They show that most resolved dust rings/gaps coincide with gas pressure maxima/minima. They even estimate the mid-plane pressure derivative observationally. This gives some idea about the gas dynamics at midplane, but can we reproduce or link it with a specific hydro process?
6. @baeExoALMAVIIBenchmarking2025 — Nice reference we all are familiar with. Nothing too fancy.
7. @hilderExoALMAVIIIProbabilistic2025 — Relevant method paper to build new observables from line profiles without reducing everything to crude moments.
8. @zawadzkiExoALMAIXRegularized2025 — Another method paper. How further can we push the high resolution ALMA data using just better statistical techniques? Did someone say machine learning?
9. @pinteExoALMAChannelMaps2025 — Another work on extracting velocity [[Gas Kinematics|kinks]] from [[Channel Maps|channel maps]].
10. @longariniExoALMAXIIWeighing2025 — Using rotation curves to constrain [[Gravitational Instability|GI]].
11. @yoshidaExoALMAXIVGas2025 — Going beyond the centroid in the analysis of line profiles. 
12. @rosottiExoALMAXVInterpreting2025 — Interpretation of vertical tomography. 
13. @barraza-alfaroExoALMAXVIPredicting2025 — Most relevant work perhaps. Forward model [[Vertical shear instability|VSI]], [[Magneto-rotational Instability|MRI]], and [[Gravitational Instability|GI]] and compare synthetic CO centroid-residual morphology. They link VSI to ring/arc-like patterns, MRI/GI to often spiral-like patterns, and conclude all can produce ALMA-detectable large-scale flows. They explicitly conclude that more systematic comparison between predicted and observed complex velocity structure is needed.
14. @wolferExoALMAXVIICharacterizing2025 — This one is about crescents and vortices. It asks whether continuum dust asymmetries correspond to **gas vortices** and searches the CO velocity field for [[Rossby-wave Instability|RWI]]-like signatures. Do crescents together with gas kinematics imply vortices?
15. @winterExoALMAXVIIIInterpreting2025 — Can morphological or geometric irregularities be mistaken for hydro processes? A large-scale velocity residual that looks like a fluid instability may simply reflect an incorrect assumption that the disk lies in a single plane. This work specifically discusses warps. So when interpreting observations, we need to separate flow from geometry.
16. @hardimanExoALMAXIXConfirmation2026 — Another method paper, this time the focus is on turbulence through non-thermal line broadening. 
17. @izquierdoExoALMAXXTomographic2026 — Very important, possibly the current state-of-the-art: They explicitly go beyond line-centroid residuals and use **molecular-line tomography**, line width and **line skewness** to distinguish planet-driven flows from instability-driven structure. We need to move beyond centroid as a probe.
18. @benistyExoALMAXXIMorphology2026 — They analyze $v_z$-like motions across 14 exoALMA disks in $^{12}\text{CO}$ and $^{13}\text{CO}$ and find vertical flows to be widespread, with amplitudes ranging from tens to hundreds of $\text{ms}^{-1}$. Again, we are now asking the question that can geometry/topology/vertical coherence of these flows discriminate mechanisms?
19. @fukagawaExoALMAXXIITwodimensional2026 — A very useful 2-D atlas of what might we want to work on.
20. @ruzzaExoALMAXXIIIEstimating2026 — Simulation-based inference modeling. Can we also include gas dynamics here?



# Current state of the Art

## Relevant talks from Discs on the Exe
- 2.4  Probing disk dynamics and dust evolution through shadows in protoplane-
tary disks: A case study of HD 142527 disk by Yuya Fukuhara

# What I can do?

## Rings and Gaps

- Most ring/gaps properties are constrained by continuum observations, but most theoretical predictions come from gas-only simulations. 
- Directly constraining radial width of gas rings from radial variations in rotational velocity profile [@teagueKinematicalDetectionTwo2018].
- Companion scenario is flexible in explaining because of 



