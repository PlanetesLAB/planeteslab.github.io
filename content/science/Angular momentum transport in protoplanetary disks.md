---
tags:
  - physics
  - disk-dynamics
  - disk-evolution
status: writing
---
# Hydrodynamic mechanisms

## The Rayleigh Criterion


# Magnetohydrodynamic mechanisms
- Rayleight criterian is relevant for circumplanetary disks.

**3.5 — Magnetohydrodynamic Angular Momentum Transport**

- **p. 109, Eq. 3.75:** Why does magnetic coupling change the stability criterion from a gradient in specific angular momentum to a gradient in angular velocity? What extra exchange between fluid elements becomes possible? **Confidence: 95%.**  
    **Reason:** The explanation is established. An exhaustive answer still needs to distinguish the assumptions behind the hydrodynamic and magnetic stability criteria.
    
- **pp. 109–111, weak-field limit:** Why does taking the magnetic field toward zero not recover the hydrodynamic stability criterion? Need to distinguish an arbitrarily weak field from exactly zero field, and check what happens to the growth rate. **Confidence: 95%.**  
    **Reason:** This is answerable analytically, but the limits of field strength, wavelength and growth time require careful handling.
    
- **p. 110, Eq. 3.83:** Need to derive these local equations explicitly. Where does the radial term involving (d\Omega^2/d\ln r) come from, and how does it compete with the Coriolis terms? **Confidence: 95%.**  
    **Reason:** This is a direct expansion of the equations of motion. The remaining uncertainty is algebraic bookkeeping and rotating-frame sign conventions.
    
- **pp. 111–113, magnetic tension:** The tension acts like a restoring force, so how does it produce an instability? Follow the angular momen tum gained or lost by the outer and inner fluid elements. **Confidence: 95%.**  
    **Reason:** The mechanism is well understood. I would check the torque and displacement signs to make the explanation complete and internally consistent.
    
- **p. 111, Eqs. 3.89–3.90:** Need to work through the dispersion relation. Why does this condition guarantee a negative root for (\omega^2)? **Confidence: 95%.**  
    **Reason:** The polynomial can be checked directly. The answer must state the background stability assumptions rather than present the criterion as universally applicable.
    
- **p. 112, Fig. 3.6:** The caption seems to reverse the statement about spatial scales. (k<k_{\rm crit}) means sufficiently **long wavelengths**, as stated in the paragraph below. **Confidence: 95%.**  
    **Reason:** This follows directly from (\lambda=2\pi/k). There is no substantive physical uncertainty here; 95% is simply a conservative verification margin.
    
- **pp. 112–113, Eqs. 3.92–3.94:** A stronger field eventually suppresses the MRI because no unstable wavelength fits vertically within the disk. Does the corresponding bound on (\beta) refer specifically to the vertical field, rather than the total field? **Confidence: 95%.**  
    **Reason:** The stated geometry makes this tractable. Extending the bound to mixed field geometries requires qualifications beyond this derivation.
    
- **p. 113, Eq. 3.96:** The fastest e-folding time is (4/(3\Omega)), about 0.21 orbital periods. Important to distinguish this linear growth time from the time needed to reach sustained turbulence. **Confidence: 95%.**  
    **Reason:** The time conversion is straightforward. The nonlinear saturation time, however, has no single universal value.
    
- **pp. 113–114, Eq. 3.97:** Why does outward angular momentum transport require a negative average (B_rB_\phi)? Need to check the signs of both the Maxwell and Reynolds stresses. **Confidence: 95%.**  
    **Reason:** This follows from angular momentum conservation and the stress tensor. I would verify the book’s stress and velocity-fluctuation conventions explicitly.
    
- **pp. 113–114, magnetic dynamo:** How can the turbulence maintain a magnetic field when there is no net vertical flux? Need to distinguish sustaining magnetic energy from generating net flux through the disk. **Confidence: 85%.**  
    **Reason:** The distinction is clear, but an exhaustive account of the nonlinear MRI dynamo depends on geometry, boundary conditions and numerical results.
    
- **p. 114, predicted (\alpha):** How does this stress-based (\alpha) relate to turbulence inferred from molecular line broadening? If Maxwell stress dominates, how directly do gas velocity fluctuations measure angular momentum transport? **Confidence: 85%.**  
    **Reason:** There is no universal conversion. Line emission samples particular heights and velocity components, while magnetic stresses are not measured directly by linewidths.
    

**3.6 — Effects of Partial Ionization and Dead Zones**

- **p. 114, coupling to neutrals:** How can such a tiny population of charged particles communicate magnetic forces to almost entirely neutral gas? Which collision timescale must be short compared with the orbital timescale? **Confidence: 95%.**  
    **Reason:** The coupling mechanism is established, but an exhaustive explanation must carefully distinguish collision frequencies from momentum-transfer rates for each species.
    
- **p. 115, Eqs. 3.103–3.106:** The long-wavelength MRI modes survive longest because growth scales as (k), while Ohmic damping scales as (k^2). Small-scale magnetic structure is therefore removed first. **Confidence: 95%.**  
    **Reason:** These scalings are straightforward within the stated limit. They should not be extended indiscriminately beyond that approximation.
    
- **p. 116, Eqs. 3.110–3.113:** We use an assumed (\alpha) to estimate the field strength when deciding whether MRI turbulence can exist. How sensitive is the result to this assumption? (x_{\rm crit}\sim10^{-12}) is a fiducial estimate, not a universal threshold. **Confidence: 90%.**  
    **Reason:** I can derive the parameter dependence, but a reliable physical threshold also depends on field geometry and the limitations of the Ohmic-only model.
    
- **p. 117, “dead zone”:** Dead with respect to which process? Suppressing MRI turbulence does not necessarily stop accretion. Could hydrodynamic instabilities or an organized magnetic torque still transport angular momentum here? **Confidence: 90%.**  
    **Reason:** The conceptual answer is firm. Determining which alternative actually operates requires the disk’s magnetic, thermal and dynamical conditions.
    
- **p. 117, three coupling regimes:** What precisely does “tied to the magnetic field” mean? Write down the comparisons between gyrofrequency and collision frequency for electrons and ions in each regime. **Confidence: 95%.**  
    **Reason:** The inequalities are standard. The remaining care concerns using the appropriate momentum-transfer frequency and stating the simplified species assumptions.
    
- **p. 117, neglected dust:** How much does including charged grains change this picture? Small grains also remove free electrons. Could grain growth or settling change the extent of the dead zone? **Confidence: 75%.**  
    **Reason:** Quantifying the effect requires grain sizes, abundances, charging chemistry and ionization sources. There is no generally valid numerical answer.
    
- **p. 118, Eq. 3.116:** Need to quantify the timescale separation that allows charged-particle inertia to be neglected. Where in the disk atmosphere might this approximation fail? **Confidence: 85%.**  
    **Reason:** I can derive the validity conditions, but locating their failure requires a specified atmospheric structure and relevant dynamical scales.
    
- **p. 119, Eq. 3.123:** Interesting that the bulk momentum equation has the ideal-MHD form even for weak ionization. The important difference is in how the magnetic field evolves relative to the neutral gas. **Confidence: 95%.**  
    **Reason:** This follows from the supplied derivation. An exhaustive explanation must retain its assumptions about negligible charged-species inertia and pressure.
    
- **p. 120, Eq. 3.127:** Keep the collision-frequency subscripts straight: an electron encounters many neutrals, while a neutral encounters very few electrons. The collision frequencies differ even though momentum exchange is equal and opposite. **Confidence: 95%.**  
    **Reason:** The distinction follows directly from the definitions. The remaining uncertainty is bookkeeping of densities, masses and momentum-transfer coefficients.
    
- **pp. 120–121, Eq. 3.128:** Why is the ion–neutral collision coefficient approximately independent of temperature? How does the long-range interaction change its cross-section compared with electron–neutral collisions? **Confidence: 90%.**  
    **Reason:** The underlying explanation is established, but the approximations and their accuracy depend on the interacting species and collision energies.
    
- **p. 123, Eq. 3.144:** Need a clearer physical interpretation of each term. Which species move together, and which drift relative to one another, in the Ohmic, Hall and ambipolar limits? **Confidence: 95%.**  
    **Reason:** The limiting regimes have clear interpretations. An exhaustive answer must also explain that intermediate conditions do not separate into perfectly distinct categories.
    
- **pp. 123–124 and 127, field polarity:** Why does reversing the field change Hall-dominated evolution? What makes alignment with the disk angular momentum physically different from anti-alignment? **Confidence: 90%.**  
    **Reason:** The symmetry argument is firm, but the resulting instability and transport depend on field geometry and the balance of non-ideal terms.
    
- **pp. 124–125, Figs. 3.7–3.8:** Being the largest non-ideal term does not necessarily mean it is important compared with induction. Also, how much do these boundaries move when the assumed magnetic field strength changes? **Confidence: 85%.**  
    **Reason:** I can derive changes within the book’s parameterization. Actual spatial boundaries require a disk structure, field distribution and charge-carrier model.
    
- **p. 126, Eqs. 3.151–3.152:** How do the Elsasser criteria connect to the earlier magnetic Reynolds criterion? With these definitions, (\Lambda_{\rm O}=(v_A/c_s)\mathrm{Re}_M), so the numerical thresholds cannot simply be interchanged. **Confidence: 95%.**  
    **Reason:** The relation is algebraically exact with these definitions. The physical thresholds remain approximate and depend on the characteristic scales and field geometry.
    
- **p. 126, outer-disk ambipolar diffusion:** Why can magnetic coupling become poor at low density even where ionizing radiation penetrates more easily? Need to separate the ionization fraction from the rate of momentum exchange with neutrals. **Confidence: 95%.**  
    **Reason:** The physical distinction is well established. Care is needed to separate changes in ionization fraction from changes in the absolute ion density.
    
- **p. 126, nondissipative Hall effect:** How can the Hall term modify or generate an instability without dissipating energy? Where does the growing disturbance obtain its energy? **Confidence: 95%.**  
    **Reason:** The absence of direct Hall dissipation is demonstrable analytically. A complete instability explanation also requires tracking energy exchange with differential rotation.
    
- **pp. 117–127, connection to substructure:** Could a transition in magnetic transport cause gas to accumulate and form a pressure maximum? Would this connect dead-zone boundaries to dust rings, particle trapping, and possibly the Rossby wave instability? **Confidence: 80%.**  
    **Reason:** This is a plausible mechanism, not an automatic outcome. Accumulation, pressure maxima and RWI each require additional conditions on transport and disk structure.
    

**3.7 — Disk Winds**

- **p. 127, Eq. 3.153:** Why does the surface torque depend on (B_zB_\phi)? Need to derive the factor of (2\pi), counting both disk surfaces, and check which field orientation removes angular momentum. **Confidence: 95%.**  
    **Reason:** The stress-tensor derivation is standard. The surface normals, field signs and counting of both surfaces require explicit checking.
    
- **p. 128, Eq. 3.156:** Where does the enhancement by (r/h) come from physically? Why does making the disk thinner favor a wind torque over internal angular momentum transport? **Confidence: 95%.**  
    **Reason:** The geometric scaling is derivable. Its interpretation must preserve the assumptions about comparable surface and interior magnetic stresses.
    
- **p. 128, ideal-MHD assumption:** The preceding section describes a poorly ionized disk. Where must ideal MHD apply for this launching model to work—at the surface, throughout the interior, or along the entire accelerating flow? **Confidence: 85%.**  
    **Reason:** A satisfactory answer must connect an idealized wind to a non-ideal disk. That connection depends on vertical coupling and magnetic-field slippage.
    
- **p. 129, Eq. 3.159:** How can the field be approximately force-free and still exert the torque needed for accretion? Which departure from the force-free approximation transfers angular momentum? **Confidence: 85%.**  
    **Reason:** The apparent contradiction can be resolved, but quantifying the small departure requires a consistent wind solution rather than the force-free approximation alone.
    
- **pp. 129–130, bead-on-wire analogy:** The magnetic force has no component along the field, yet the field enables acceleration. Is the energy ultimately extracted from disk rotation through the torque enforcing corotation? **Confidence: 95%.**  
    **Reason:** The energy source is established. A complete explanation needs careful distinctions between inertial and rotating frames, magnetic work and motion along the field.
    
- **pp. 130–131, Eqs. 3.161–3.163:** Need to work through this derivative. Why is the launching criterion based on the second derivative? Does the first derivative at the footpoint vanish for every inclination because the disk is Keplerian? **Confidence: 95%.**  
    **Reason:** This is a direct calculus exercise within the stated model. The remaining care concerns the assumptions and the marginal case at the critical angle.
    
- **p. 131, critical angle:** The (30^\circ) condition applies to a cold, ideal-MHD wind. How does thermal support change the launching condition? Could heating allow escape along a more nearly vertical field? **Confidence: 80%.**  
    **Reason:** There is no single replacement angle. The answer depends on heating, field geometry, mass loading and the wind’s critical-point conditions.
    
- **pp. 131–132, Eqs. 3.164–3.165:** What determines the Alfvén radius and the magnetic lever arm? Need to understand the factor of two, whether the mass flow rates are local or integrated, and how the angular momentum initially carried by escaping gas is counted. **Confidence: 80%.**  
    **Reason:** The Alfvén radius requires a global wind solution, while the rate relation needs careful interpretation of local quantities and wind angular-momentum accounting.
    
- **p. 132, Eq. 3.166:** Where is the mass actually lost in the wind? This equation includes radial advection caused by the wind torque but no explicit mass-loss sink. Are we assuming the escaping mass is negligible? **Confidence: 95%.**  
    **Reason:** The missing explicit sink is directly identifiable. The small uncertainty concerns the author’s intended approximation, which is not fully spelled out there.
    
- **p. 132, disk contraction:** Why must a wind-driven disk shrink? Does “radius” mean the position of gas parcels, a characteristic radius, or an observed outer edge? Could gas and dust radius measurements give different impressions? **Confidence: 80%.**  
    **Reason:** The outcome depends on the radial torque profile and radius definition. Observed gas and dust edges introduce additional transport and emission effects.
    
- **p. 132, laminar accretion:** So an accretion rate does not uniquely determine the turbulence level. Can a disk accrete efficiently while retaining a strongly settled dust layer? An effective accretion (\alpha) need not describe dust diffusion. **Confidence: 90%.**  
    **Reason:** The distinction between accretion stress and dust diffusion is firm. Quantitative settling also depends on grain properties, vertical motions and wind entrainment.
    
- **p. 132, Eq. 3.167:** Over what surface, and under which boundary conditions, is net magnetic flux conserved? A local dynamo can maintain magnetic fields, but changing the disk’s net flux requires transport through its boundaries. **Confidence: 95%.**  
    **Reason:** The conservation argument is established. It requires precise specification of the integration surface and whether its boundary moves with the fluid.
    
- **p. 133, Eq. 3.168:** Need to derive the extra (h/r) in the outward flux-diffusion timescale. Also, is assuming (\eta\sim\nu) justified for the almost-laminar wind-driven disk described on the preceding page? **Confidence: 85%.**  
    **Reason:** The thin-disk estimate is explainable, but flux transport depends on vertical structure, and the turbulent (\eta\sim\nu) assumption does not automatically apply to laminar accretion.
