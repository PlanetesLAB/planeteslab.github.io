---
tags:
  - journal
status: wip
---
# December 2025

## 2025-12-25

### See Different things

Also it goes without saying that we need to look at different (all) diagnostics available to us. Looking just at density outputs may not always provide the full picture. Each other output (the three velocities, for instance) may provide some hint of what is going wrong. Developing an aptitude to study the outputs and knowing what is going wrong is as important as knowing how to run a model correctly.

## 2025-12-21

### More problems

One tip I got to know was to try seeing the outputs after and at initial time steps ($dt, 2dt, 3dt, \ldots$) as they allow us to see if things are going immediately wrong (they usually do) and how it's going wrong at those initial time steps often helps to understand what exactly the problem is, especially when we are not sure and there are too many parameters to consider. Also view them in DS9 instead of making unwieldy `matplotlib` images.

![Many many planets?](radial_velocity.mp4)

Another example of things going wrong. This times, likely some problem in the implementation of planet potential. Also, the movement of the planet in the azimuthal direction also means I am not calculating the planet position correctly to apply its gravity.

![What are those?](many-planets-1.png)

## 2025-12-12

### Boundary problems

![Things going wrong](things-wrong-1.png) 

Above is an example of things going wrong. The straight line slightly beyond $r = 2.5$ implies a circle in the Cartesian coordinates. The velocities with opposite signs on the two sides means gas is moving away from that circle on both sides which would produce a vacuum at that location. In other words, this is a good example of boundary conditions being not set correctly.

The steps to debug and sort out the problem are same as I'm already familiar with. Start with simple and most basic *reduced* form of the actual problem. Gradually add complexity, one at a time. See how things change. 
## 2025-12-11

### Leaky Gaps

Rixin Li has kindly hosted a tutorial on how to run hydro models with `Athena++` at his [webpage](https://rixinli.me/LeakyGaps/). This includes instructions to run/compile the code, as well as how to setup problem generators and even provides additional scripts to analyze, process and visualize the simulation data in a better way.

## 2025-12-05

### A writeup

The first step is to setup the problem generator file. For our problem, we need to define following interface functions manually:
```cpp
// This routine does two things: first is to read/parse the accompanying input file 
// and then enroll our custom defined source function (which in our case is the 
// planet-disk interaction) and BCs.
void Mesh::InitUserMeshData(ParameterInput *pin)

// This will be the core function that will setup the ICs.
void MeshBlock::ProblemGenerator(ParameterInput *pin)
```

### Initial conditions

First step, is to setup the density which is given by:

$$
\rho (R, Z) = \rho_p \left(\frac{R}{R_p}\right)^p \exp \left(\frac{GM_{\star}}{c_s^2} \left[\frac{1}{\sqrt{R^2+Z^2}} - \frac{1}{R}\right] \right)
$$

where $p = -2.25$. I assumed $GM_{\star} = 1$, as that seems logical given we are using *code units*. For $\rho_p$, we need to enforce the constraint that the total disk mass yields $0.01 M_{\odot}$ (although in *code units* might not be necessary?). I used $R_p = \sin \theta$, given $r = 1$ seems obvious from figures (1-4) of the paper as well, written explicitly for the SPH simulation. Further, as planet is supposed to be at mid-plane, $\theta = \frac{\pi}{2} \implies R_p = 1$. For sound speed, we can use the fact that they use vertically isothermal disk, so

$$
\begin{split}

P & = \rho c_s^2 \\

\implies c_s^2 & = \frac{P}{\rho} = kT \\

\implies c_s^2 & \propto T

\end{split}
$$

Now, we know,

$$
H = \frac{c_s}{\Omega_K}, \quad \Omega_K = \sqrt{\frac{GM_{\star}}{R^3}}
$$

we can use the temperature profile to find $c_s$:

$$
\begin{split}

T(R) & = T_p \left(\frac{R}{R_p}\right)^q, \quad q = -0.5 \\

\implies c_s (R) & = c_{s,p} \left(\frac{R}{R_p}\right)^{q/2} = c_{s,p} \left(\frac{R}{R_p}\right)^{-0.25}

\end{split}
$$

They chose $T_p$ such that:

$$
\begin{split}

\frac{H}{R} \bigg|_{R=R_p} & = 0.1 \\

\implies H_p & = 0.1 R_p

\end{split}
$$

which means

$$
c_{s,p} = H_p \Omega_K (R_p) = 0.1 R_p \sqrt{\frac{GM_{\star}}{R_p^3}} = 0.1 \sqrt{\frac{GM_{\star}}{R_p}}
$$

And, I think to get the final expression for $T_p$, we can absorb the value of the constant factor in *code units* again, which gives us $T_p = 0.01$. Finally, we can also get an expression for aspect ratio:

$$
\begin{split}

\frac{H(R)}{R} = \frac{c_s (R)}{\Omega_K} \cdot \frac{1}{R} & = c_{s,p} \left(\frac{R}{R_p}\right)^{q/2} \cdot \frac{1}{\Omega_K} \cdot \frac{1}{R} \\

& = c_{s,p} \left(\frac{R}{R_p}\right)^{q/2} \cdot \sqrt{\frac{R^3}{GM_{\star}}} \cdot \frac{1}{R} \\

& = 0.1 \sqrt{\frac{GM_{\star}}{R_p}} \left(\frac{R}{R_p}\right)^{q/2} \cdot \sqrt{\frac{R}{GM_{\star}}} \\

& = 0.1 \left(\frac{R}{R_p}\right)^{(q+1)/2} \\

\end{split}
$$

### Source function

This sets the ICs. Next, we need to set up the planet-disk source function. In the `athena++` wiki, this is the place where we can update the conserved variables at each time step, like momentum and energy, but because we are using isothermal EOS, we need to worry only about momentum.

```cpp
void MySource(MeshBlock *pmb, const Real time, const Real dt,
		const AthenaArray<Real> &prim,
		const AthenaArray<Real> &prim_scalar,
		const AthenaArray<Real> &bcc,
		AthenaArray<Real> &cons,
		AthenaArray<Real> &cons_scalar);
```

As I understand, for our case, I can just update the momentum by using the momentum density:

$$
\begin{split}  
\mathbf{m}  
&= \rho \mathbf{v} \\  
\implies \frac{d(\rho \mathbf{v})}{dt}  
&= \rho \frac{d\mathbf{v}}{dt}  
+ \mathbf{v} \frac{d\rho}{dt} \\  
&= \rho \mathbf{a}  
\end{split}
$$

where $\mathbf{a} = -\nabla \Phi_p$ and $\Phi_p$ is given by equation (4) in the paper. Under our *code units*,  $(G = 1)$, so I can just use the planetary mass at that instant to get the potential. As density is not going to change with time (except from fluxes), that term goes away. Finally,

$$
\begin{split}  
\mathbf{a}  
&= - \nabla \Phi_p \\  
&= - \frac{d\Phi_p}{dr} \, \nabla r \\  
&= - \frac{d\Phi_p}{dr} \, \frac{\mathbf{s}}{r} \\  
&= - \frac{d}{dr} \left(-\frac{GM}{r}\right) \frac{\mathbf{s}}{r} \\  
&= GM \frac{d}{dr} \left(r^{-1}\right) \frac{\mathbf{s}}{r} \\  
&= - \frac{GM}{r^3} \mathbf{s}  
\end{split}
$$

### Boundary conditions

From what I understand, for the radial direction, the authors have adopted *symmetric* BC, which I think `athena++` calls *reflective*. But instead of reversing sign, they use damping zones, which I think is similar to *outflow* BC. So I am not sure which one to use. I implemented the damping zones in the source function itself.

For meridional direction, we need to implement a custom BC, as given by equation (9) of the paper:

$$
\begin{split}  
\frac{1}{\rho} \cdot \frac{\partial}{\partial \theta}  
\left(\rho c_s^2\right)  
&= \frac{v_{\phi}^2}{\tan \theta} \\  
\implies \frac{c_s^2}{\rho} \cdot \frac{\partial \rho}{\partial \theta}  
&= \frac{v_{\phi}^2}{\tan \theta} \\  
\implies \frac{1}{\rho} \cdot \frac{\partial \rho}{\partial \theta}  
&= \frac{v_{\phi}^2}{c_s^2} \cdot \frac{1}{\tan \theta} \\  
\implies \frac{\partial}{\partial \theta}  
\left(\ln \rho\right)  
&= \frac{v_{\phi}^2}{c_s^2} \cdot \frac{1}{\tan \theta}  
\end{split}
$$

Now, we can integrate from active cell to ghost cell:

$$
\ln \rho(\theta_g) - \ln \rho(\theta_a)  
=  
\int_{\theta_a}^{\theta_g}  
\frac{v_{\phi}^2}{c_s^2}  
\cdot  
\frac{1}{\tan \theta}  
\,\mathrm{d}\theta
$$

For thin disk approximation, $\theta$ is small, so $\tan \theta \approx \theta$. Initially, $v_{\phi} = R\Omega$, and from paper's equation (3), $\Omega$ varies as $\propto (Z/R)^2$ as we move away from mid-plane. With $Z = r \cos \theta$, we get $\Delta Z \sim r (-\sin \theta) \Delta \theta$. Therefore, for small $\Delta \theta$, overall, $v_{\phi}$ also does not change much. In which case, we can simplify the integral as:

$$
\ln \rho (\theta_g) - \ln \rho (\theta_a) = \frac{v_{\phi,a}^2}{c_{s,a}^2} \cdot \frac{1}{\tan \theta_a} \cdot \int_{\theta_a}^{\theta_g} \mathrm{d}\theta
$$

Note I use the values of active cell as we are integrating from active to ghost cell and $\theta$ is small, *with respect to*, $\theta_a$. Integration of $\mathrm{d}\theta$ is trivial, which gives:

$$
\begin{split}  
\ln \left(\frac{\rho_g}{\rho_a}\right) & = \frac{v_{\phi,a}^2}{c_{s,a}^2} \cdot \frac{\Delta \theta}{\tan \theta_a} \\  
\implies \rho_g & = \rho_a \cdot \exp \left(\frac{v_{\phi,a}^2}{c_{s,a}^2} \cdot \frac{\Delta \theta}{\tan \theta_a}\right)  
\end{split}
$$

And for the azimuthal direction, I think *periodic* BC over the whole $\phi$ domain makes sense. For traversing the cells, I referred to the `athena++` wiki page on BCs.

### Azimuthal velocity in case of FARGO

In orbital advection runs, that is with FARGO enabled, the $v_{\phi}$ written to the output files is azimuthally averaged background velocity subtracted value. Let us calculate this azimuthally averaged background velocity. From Rixin's notes accompanying the plotting notebook, the background velocity is given by:

$$
v_{\phi, \text{bg}} = \sqrt{\frac{1}{r}} \sqrt{1 - \frac{11}{4} h^2} - v_{\text{fargo}}
$$
### A small note

The exoALMA paper also did not specify what order of orbital advection (FARGO) they used, so not sure which to use.

## 2025-12-03

### Baseline

The work of [@bergez2022constraining] forms one of our baselines. The thing to keep in mind is *images of the Solar System's natal protoplanetary disk*. We don't deal with dust-gas dynamics, just gas dynamics. And instead of looking in the ALMA range of mm/sub-mm, we are going to look in optical/infrared. This is perhaps the right time to introduce [Xuntian](https://en.wikipedia.org/wiki/Xuntian), or the [[The Chinese Space Station Survey Telescope (CSST)|Chinese space station survey telescope]] (CSST), the telescope that we will be targeting. 

## 2025-12-02

### Small jobs

When testing setups, especially for hydro models, it's always nice to test with smaller resolution models. They are faster to solve!

## 2025-12-01

### The exoALMA data

The data provided by [@bae2025exoalma] is available on the [web](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/HE8DXM). A good starting point was to obviously see if I can at least recreate the plots from the paper, from the paper's data. 
# November 2025

## 2025-11-29

### Project start

Setting up `Athena++` on my local machine and familiarizing myself with the usual workflow. The [official wiki](https://github.com/PrincetonUniversity/athena/wiki) hosted on GitHub is actually the best resource for getting accustomed to the codebase. But of course, for any meaningful simulations, one needs a distributed HPC cluster. Working with HPC means to learn how to submit and run jobs on a system whose resources are shared simultaneously by many. Resources for those:
1. [A bit on `sbatch`](https://docs.alliancecan.ca/wiki/Running_jobs#Use_sbatch_to_submit_jobs)
2. [A bit on job scheduling](https://docs.alliancecan.ca/wiki/Job_scheduling_policies)
3. [A bit on storage policies](https://docs.alliancecan.ca/wiki/Storage_and_file_management)

In the end, each cluster might have their own set of policies. Always refer to the documentation!



