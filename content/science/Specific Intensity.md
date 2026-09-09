---
tags:
  - physics
status: live
---
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
$$

We define $I_{\nu}$ as the **specific intensity** and $\theta$ is the angle between the vector normal to $dA$ and direction of $\mathrm{d} \Omega$. Here it is useful to introduce a unit vector $\mathbf{n}$ which points in the direction of the propagation of radiation. The solid angle element $\mathrm{d}\Omega$ represents an infinitesimal range of directions centered around $\mathbf{n}$. Thus, $\theta$ is the angle between, the propagation direction $\mathbf{n}$ and the normal to the surface element $\mathrm{d}A$.

The way to understand this expression is quite simple. We want to know *how much energy*
1. is going to cross the infinitesimally small area $\mathrm{d}A$,
2. towards direction given by $\mathrm{d} \Omega$,
3. in time $\mathrm{d}t$,
4. in the frequency range $\mathrm{d}\nu$.
The factor $\cos \theta$ accounts for the fact that the rays do not necessarily cross the surface perpendicularly. The effective area presented to the radiation is the projected area $\mathrm{d}A \cos \theta$. In particular, when the radiation is normally incident, $\theta = 0$, and the projected area is simply $\mathrm{d}A$.  

Because it gives a more detailed description of the radiation field, it is much more instructive to derive other quantities (like flux) from the specific intensity. One way to derive other quantities is to calculate the [[Moment|moments]] of $I_{\nu}$. 

# Moments of Specific Intensity

Before we derive any moments, let us write equation for $dE$ a bit more generally in terms of the unit normal $\hat{\mathbf{m}}$. Here $\hat{\mathbf{m}}$ is the unit vector normal to the surface element $\mathrm{d}A$. It describes the orientation of the surface, whereas $\mathbf{n}$ describes the direction in which the radiation is traveling. These are therefore two different vectors.  

$$
dE = I_{\nu} (\mathbf{r}, \mathbf{n} \cdot \hat{\mathbf{m}}) \, dA\; dt\; d \Omega\; d\nu
$$

The geometrical factor can be written as  

$$
\mathbf n\cdot\hat{\mathbf m}=\cos\theta,  
$$

so the expression above is the same as the previous expression. More precisely, we will generally write the specific intensity as $I_\nu(\mathbf r,\mathbf n)$, since its angular dependence is on the propagation direction $\mathbf n$, while $\mathbf n\cdot\hat{\mathbf m}$ describes the projection of the surface onto the direction of propagation.

This essentially means all the rays are aligned with $\mathbf{\hat{m}}$. This statement refers to the special case of normally incident radiation, where $\mathbf n=\hat{\mathbf m}$. In the general case, $\mathbf n$ and $\hat{\mathbf m}$ need not be aligned. 

Next is to ask about the nature of the independent variable for which we will be calculating the moments for. For specific intensity, it is more constructive to think in terms of direction. From the definition, it is clear that $I_{\nu}$ is not a spatial density, but rather a function of direction[^1]. Therefore, it makes sense to derive angular moments.

## Zeroth moment (Radiation Energy Density)

By definition, zeroth moment of a quantity is something which is does not depend of our independent variable (direction in our case). So we want to derive the quantity which is describes how much radiation is present locally, regardless of the direction. This essentially defines *energy density* at that location. 

To calculate this energy density, we can once again use the isotropic scenario, and imagine a point which is absorbing incoming radiation from all directions. If in time $dt$, they cross an area $dA$ while traveling at speed $c$, then, we can write energy density for the photons in the frequency bin $d\nu$ as

$$
\begin{equation}
\begin{split}
u_{\nu} 
&= \dfrac{dE}{dV d\nu} \\[5pt]
&= \dfrac{ I_{\nu} (\mathbf{r}, \mathbf{n} \cdot \hat{\mathbf{m}}) \, dA\; dt\; d \Omega\; d\nu}{c\,dt\,dA\,d\nu} \\[5pt]
&= \dfrac{I_{\nu} (\mathbf{r}, \mathbf{n} \cdot \hat{\mathbf{m}}) \, d \Omega\;}{c} \\
\end{split}
\end{equation}
$$

Here we have used $(\mathrm d V=c\cdot \mathrm dt\cdot \mathrm dA)$. The distance travelled by the radiation in time $(\mathrm dt)$ is $c \cdot dt$, so the volume swept out by the radiation through the area $\mathrm dA$ is $\mathrm dA \cdot (c\cdot \mathrm dt)$. Now, this energy density is only the contribution from the rays aligned with $\mathbf{\hat{m}}$, so we can integrate over all directions to get the total energy density. More precisely, this is the contribution from radiation within the particular solid-angle element $\mathrm d\Omega$. To obtain the total energy density, we sum the contributions from all possible propagation directions.

$$
u_{\nu} = \dfrac{1}{c} \int I_{\nu}\; d\Omega
$$
The angular integral here is over the entire sphere of possible propagation directions, so  

$$  
\int d\Omega=4\pi.  
$$

A closely associated quantity to $I_{\nu}$ is the **mean intensity**, which is defined as:

$$
J_{\nu} = \dfrac{1}{4 \pi} \int I_{\nu} \; d \Omega
$$

Consequently, we can write:

$$
u_{\nu} = \dfrac{4\pi}{c} J_{\nu}
$$
Finally, we can also calculate total radiation density

$$
u = \int u_{\nu} \; d\nu = \dfrac{4\pi}{c} \int J_{\nu}\; d\nu
$$

## First moment (Flux)

The zeroth moment tells us how much radiation energy is present locally, but it does not tell us whether the radiation is preferentially travelling in some direction. To describe the *net transport of radiation energy*, we need to retain one power of the propagation direction $\mathbf n$.

Recall that $\hat{\mathbf m}$ is the unit normal to the surface, while $\mathbf n$ is the direction of propagation of the radiation. Thus,

$$
\cos \theta = \mathbf n \cdot \hat{\mathbf m}
$$

From

$$
\mathrm d E = I_{\nu} (\mathbf n \cdot \hat{\mathbf m}) \mathrm dA\ \mathrm dt\ \mathrm d \Omega\ \mathrm d \nu,
$$

the energy crossing the surface per unit area, per unit time, and per unit frequency is

$$
\mathrm dF_{\nu} = I_{\nu} (\mathbf n \cdot \hat{\mathbf m}) \mathrm d \Omega
$$

Integrating over all directions gives us the net flux through the surface:

$$
F_{\nu} (\hat{\mathbf m}) = \int I_{\nu} (\mathbf n \cdot \hat{\mathbf m})\ \mathrm d\Omega
$$

or, equivalently,

$$
F_{\nu} = \int I_{\nu} \cos \theta\ \mathrm d\Omega
$$

The word _net_ is important here. Radiation travelling in the direction of $\hat{\mathbf m}$ contributes positively, while radiation traveling in the opposite direction contributes negatively. For an isotropic field, $I_{\nu}$ is independent of direction. In this case, radiation traveling in opposite directions contributes equally but with opposite signs, and therefore

$$
F_{\nu} = 0
$$

Thus, an isotropic radiation field can have a non-zero energy density but zero net flux. We can also integrate over the frequencies to get the *integrated* flux:

$$
F = \int F_{\nu}\ \mathrm d\nu
$$

## Second moment (Momentum flux)

Radiation carries both energy and momentum. For a photon with energy $E$, its momentum has magnitude 

$$
p = \dfrac{E}{c}
$$

Therefore, we can similarly ask for the rate at which radiation momentum crosses a surface.

For radiation travelling at an angle $\theta$ to the surface normal, there is one factor of $\cos\theta$ from the projected area and another factor of $\cos\theta$ because only the component of momentum normal to the surface contributes.

Thus, the momentum flux is

$$
p_{\nu} = \dfrac{1}{c} \int I_{\nu} \cos^2 \theta \mathrm d\omega
$$

This is called the **second moment** because the angular dependence now contains two powers of the direction cosine, $\cos^2\theta$.

For isotropic radiation, 

$$
p_{\nu} = \dfrac{I_{\nu}}{c} \int \cos^2 \theta \mathrm d \Omega
$$

Using

$$
\int \cos^2 \theta \mathrm d\Omega = \dfrac{4\pi}{3}
$$

we obtain, 

$$
p_{\nu} = \dfrac{4\pi I_{\nu}}{3c}
$$

so,

$$
p_{\nu} = \dfrac{u_{\nu}}{3}
$$

This is the familiar relation between the energy density and pressure of an isotropic radiation field. Like flux, we can again integrate over all frequencies to get:

$$
p = \int p_{\nu}\ \mathrm d\nu, \quad p = \dfrac{u}{3}
$$

## Specific intensity along a ray

Specific intensity remains constant along a ray if there is no absorption and emission (in other words, through free space) by simply the virtue of conservation of energy. This does not mean flux is constant along a ray. Flux can decrease because the solid angle subtended by the source decreases, even though the intensity of each individual ray remains unchanged. 








[^1]: Note that we are trying to define $I_{\nu}$ as a density function. So although, it does depend on $\mathbf{r}$, it is not a density function in $\mathbf{r}$.
