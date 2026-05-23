---
tags:
  - journal
---
# April 2026



# March 2026
# February 2026
# January 2026

## 2026-01-01

### Key Points Learned

- Athena’s `--eos=isothermal` corresponds to a **globally isothermal** setup, not locally isothermal.
- Our problem requires **locally isothermal conditions** (isothermal only in the vertical direction).
- Removing IEN and IPR terms was incorrect and unnecessarily complicated the implementation.
- Rixin’s code already had the correct mechanism (`Isothermal_Flag`) for this setup.

### Actions I Took

- Reverted changes where I removed IEN and IPR terms.
- Enabled the existing `Isothermal_Flag` in Rixin’s implementation.
- Re-ran simulations with the corrected EOS configuration.
- Generated updated plots to verify consistency.

### Mistakes Identified

- Misinterpreted Athena’s EOS configuration.
- Overcomplicated the implementation instead of using existing code features.
- Spent time modifying parts of the code that did not need changes.

### Current Status

- Results now look consistent with expectations.
- Remaining task is parameter tuning to reproduce results from Dong & Fung (2017).


# December 2025

## 2025-12-26

### Key Points Learned

- Debugging failed because multiple bugs were interacting; isolation is necessary.
- A known working baseline is more effective than modifying a broken implementation.
- Quantities like vϕv_\phivϕ​ must be interpreted consistently between simulation and plotting.
- At t=0t = 0t=0, perturbations should be ~0; deviations usually indicate analysis errors.
- Physical assumptions (e.g., isothermal vs non-isothermal) directly affect results.
- Plotting pipelines must align with how data is generated.

### Actions I Took

- Switched to Rixin’s implementation as the base and removed extra physics first.
- Ran a clean baseline simulation before introducing modifications.
- Verified outputs at t=0t = 0t=0 to isolate issues in initial conditions.
- Compared my plots with Rixin’s results to validate correctness.
- Identified and fixed inconsistency in how vϕv_\phivϕ​ was handled during plotting.
- Reviewed existing plotting scripts instead of relying on custom ones.

### Mistakes Identified

- Modified unfamiliar code without full understanding.
- Introduced multiple bugs simultaneously.
- Double-handled Keplerian subtraction in vϕv_\phivϕ​.
- Used inconsistent definitions between simulation output and plotting.
- Assumed analytical reconstruction of quantities was equivalent to initial conditions.

### What I Will Do Going Forward

- Always establish a working baseline before making changes.
- Isolate and fix one bug at a time.
- Maintain consistency between simulation definitions and analysis scripts.
- Validate results at simple checkpoints (e.g., t=0t = 0t=0).
- Refer to existing, well-documented tools before building new ones.

## 2025-12-25

Established a working visualization pipeline (HDF5 → FITS → movies) and continued debugging boundary artifacts resembling multiple “ghost planets” near the outer radial boundary.

### Key fixes and updates:

- Corrected plotting script error that caused apparent radial offset of the planet.
- Fixed planet motion issue:
    - Error: mixed inertial-frame acceleration (planet) with co-moving frame (gas).
    - Current approach: fix planet at (r,ϕ,z)=(1,0,0)(r,\phi,z) = (1,0,0)(r,ϕ,z)=(1,0,0) in rotating frame.
- Corrected planet potential (previously missing factor from derivation).

### Current issues:

- Spiral arms have disappeared despite fixes.
- Boundary artifacts persist.
- Movies (all midplane) show unphysical behavior across all quantities (ρ,vr,vθ,vϕ\rho, v_r, v_\theta, v_\phiρ,vr​,vθ​,vϕ​).
- vθv_\thetavθ​ shows non-physical feature near r≈2.4r \approx 2.4r≈2.4, inconsistent with midplane symmetry.
- Density minimum incorrectly aligns with damping zone instead of r=1r=1r=1.
- Planet-free run still develops:
    - Inward-moving low-density region from outer damping zone,
    - Ring-like density structures without a planet.

### Domain and setup:

- r∈[0.3,3.0]r \in [0.3, 3.0]r∈[0.3,3.0], ϕ∈[−π,π]\phi \in [-\pi, \pi]ϕ∈[−π,π], θ=π/2±arctan⁡(0.5)\theta = \pi/2 \pm \arctan(0.5)θ=π/2±arctan(0.5) (symmetric).
- Damping zones:
    - Inner: 0.3→0.3570.3 \to 0.3570.3→0.357,
    - Outer: 2.52→3.02.52 \to 3.02.52→3.0.
- Ghost zone size unspecified (default from Athena).

### Critical diagnosis:

- Magnitude of δvϕ/vϕ,0\delta v_\phi / v_{\phi,0}δvϕ​/vϕ,0​ is ~2 orders larger than expected (vs. Bae+23).
- At t=0t=0t=0, vϕv_\phivϕ​ perturbation is non-zero → fundamental error.
    - Indicates either:
        - Incorrect initial condition for vϕv_\phivϕ​, or
        - Misinterpretation of plotted quantity.

### Conclusion:

- Plotting pipeline is validated (correct reproduction of exoALMA data).
- Core issue lies in the problem generator (initial conditions and/or source terms).

### New debugging direction:

- Treat t=0t=0t=0 diagnostics as primary validation:
    - vϕv_\phivϕ​ perturbation must be identically zero initially.
- Re-check entire problem generator (not just boundary/source updates).
- Continue planet-free runs to isolate disk physics from planet-related errors.
- Inspect all plotted quantities critically; obvious inconsistencies (like non-zero initial perturbations) should be used as immediate rejection criteria.

### Next steps:

- Fix vϕv_\phivϕ​ initialization and verify at t=0t=0t=0.
- Revalidate problem generator against Rixin’s implementation.
- Re-run planet-free case and confirm absence of artificial structures.
- Only after baseline is correct, reintroduce planet physics.


## 2025-12-21

A radial velocity plot at ~383 orbits confirms a major issue: the planet has moved from its expected fixed position (r=1,ϕ=0r=1, \phi=0r=1,ϕ=0), which is physically incorrect for the intended setup.

This displacement is not a late-time artifact; the planet is incorrectly positioned from the beginning of the simulation. This reinforces that there are multiple underlying implementation errors, not a single isolated issue.

### Supervisor guidance emphasizes a shift in debugging strategy:

- Avoid diagnosing based on isolated plots; current simulation likely contains multiple concurrent errors.
- Adopt a systematic approach to identify all issues rather than fixing them incrementally in isolation.

### Recommended diagnostic methodology:

- Generate time-resolved movies for all key quantities:
    - Density (ρ\rhoρ)
    - Radial, azimuthal, and vertical velocity components
- Limit movie duration to ~100 orbits; full 500-orbit runs are unnecessary at this stage.
- Closely examine earliest timesteps:
    - t=0,Δt,2Δt,3Δtt = 0, \Delta t, 2\Delta t, 3\Delta tt=0,Δt,2Δt,3Δt, etc.
    - Early-time behavior is critical for detecting initialization and implementation errors before nonlinear evolution obscures them.
- Use logarithmic time scaling in visualization to better resolve early evolution.

### Data handling and visualization improvements:

- Store early outputs in formats optimized for interactive inspection (e.g., FITS).
- Use tools like DS9 to dynamically:
    - Adjust spatial regions of interest,
    - Modify color scales,
    - Rapidly inspect evolving structures without regenerating plots.

### Current understanding:

- Planet position calculation remains incorrect and must be fixed.
- Multiple additional issues are likely present (boundary conditions, gravitational implementation, possibly initialization).
- A structured, time-resolved diagnostic pipeline is now necessary to isolate and correct errors efficiently.

### Next steps:

- Generate short-duration, high-temporal-resolution movies (including logarithmic time scaling).
- Export early timestep outputs in FITS format for interactive inspection.
- Systematically trace emergence of errors from initial conditions onward.
- Continue debugging with focus on identifying all failure modes before attempting long runs.


## 2025-12-20

I spent two days refining the simulation using Rixin Li’s implementation as reference. Boundary conditions remain imperfect, but there is clear progress: for the first time, the planet and its induced spiral arms are visible in the radial velocity field (midplane, ~159 orbits).

### Key observations and issues:

- Spiral arms become prominent once the planet reaches its full mass (10−3M⋆10^{-3} M_\star10−3M⋆​, ~100 orbits).
- Velocity magnitudes now appear reasonable compared to earlier runs.
- However, a mistake in the implementation of the planet’s gravity was identified after starting this run; results shown are therefore not fully reliable.
- Boundary conditions, especially radial, are still not behaving correctly.

### Supervisor feedback based on movie diagnostics:

- Time evolution is critical for debugging; static snapshots are insufficient.
- Required outputs: density (ρ\rhoρ) and all three velocity components as functions of time.
- Early-time behavior:
    - The disk initially settles into a quasi-steady state, which appears correct.
    - At ~50 orbits, when the planet becomes noticeable, it is already displaced from r=1r=1r=1, indicating incorrect position calculation.
- Boundary artifacts:
    - Non-physical structures appear near the outer boundary once the planet influence grows.
    - These resemble spiral arms, suggesting artificial “ghost planets” just outside the boundary.
    - Likely cause: incorrect implementation of the planet’s gravitational potential, possibly creating aliased copies near r≈2.5r \approx 2.5r≈2.5.

### Identified implementation issues:

- Missing smoothing term in planet potential.
- Incorrect calculation of planet position, especially azimuthal evolution.
- These errors likely explain both the displacement of the planet and boundary-induced artifacts.

### Workflow and infrastructure considerations:

- Movie generation is essential for diagnosing temporal behavior.
- Preferred approach:
    - Perform post-processing directly on the cluster to avoid large data transfers.
    - Integrate plotting and movie generation into job scripts (post-processing stage after simulation).
- Current pipeline plan:
    - Convert Athena HDF5 outputs → visualization format (e.g., FITS).
    - Generate frame sequences.
    - Use ffmpeg (or Python bindings) to assemble movies.
- Bottleneck: Athena’s HDF5 parsing utilities in Python are slow or cumbersome; alternative solutions may be needed.
- If workflow setup becomes time-consuming (>1 hour), recommended to seek existing solutions (Slack, Yu Wang, Rixin Li).

### Next steps:

- Correct planet potential (include smoothing and fix position calculation).
- Extend plotting scripts to include density and full velocity vector fields.
- Build automated pipeline for movie generation on the cluster.
- Use high time-resolution movies to isolate when and how non-physical features emerge.
- Continue iterative debugging, focusing on boundary behavior and gravitational implementation.



## 2025-12-12

I reviewed code and files from Rixin Li’s implementation, not to run directly but to compare against my own approach and identify discrepancies.

### Key differences identified:

- Rixin’s setup includes gas + dust dynamics, whereas my work is 3D gas-only and therefore simpler.
- His implementation uses cylindrical coordinates and omits stellar gravity.
- I corrected my model by:
    - Re-evaluating the computation of Keplerian angular velocity (including coordinate system considerations),
    - Adding stellar gravity,
    - Reverting to outflow boundary conditions in the radial direction.

### Supervisor feedback clarified a prior issue in my radial velocity field plot:

- A straight-line feature showed velocities with opposite signs across it, which is unphysical.
- Interpreted in Cartesian terms, this corresponds to gas moving away from a circular region on both sides, implying a vacuum—indicative of boundary condition errors.
- This diagnosis was largely experience-driven; there is no universal checklist for identifying such issues.

### Further debugging observations:

- A feature near r≈2.5r \approx 2.5r≈2.5 likely arises from incorrect implementation of wave-killing (damping) zones.
- Rixin’s code includes proper damping prescriptions (de Val-Borro et al. 2006), which I can use to fix this.
- In recent runs, the midplane radial velocity field appears static, with perturbations only visible at higher Z/RZ/RZ/R, which is clearly incorrect.

### Supervisor guidance on methodology:

- Simulation failures are diverse; diagnosis must be case-specific.
- Recommended workflow:
    1. Start from a minimal configuration (e.g., remove planet or set its mass to zero).
    2. Run for very short timescales (even a few timesteps) to detect early anomalies.

### My current approach:

- Minimal modifications from Rixin’s instructions so far, focusing first on correcting fundamental differences.
- Plan to incrementally fix issues (boundary conditions, damping zones, etc.) to build understanding.
- Planet removal can be implemented by keeping its mass at zero instead of ramping to 10−3M⋆10^{-3} M_\star10−3M⋆​.
- Using code units: G=1G = 1G=1, M⋆=1M_\star = 1M⋆​=1, so velocities must be interpreted accordingly (e.g., v=1v=1v=1 is Keplerian at r=1r=1r=1).

### Additional insights:

- Observed velocities are too large relative to expected Keplerian values.
- Spiral features in disk simulations should emerge within a few orbits, not only at late times (e.g., 500 orbits).
- It is acceptable—and expected—to cancel runs early; multiple (tens of) attempts may be required to achieve a correct setup.

### Next steps:

- Validate behavior in short runs before committing to long simulations.
- Use Rixin’s implementation to correct damping zones.
- Compare against known simulation behavior (e.g., via visual references such as published simulations or videos).
- Continue iterative refinement and report progress.
