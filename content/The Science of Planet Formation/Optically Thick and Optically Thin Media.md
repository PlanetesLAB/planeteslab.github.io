---
tags:
  - physics
---
# Optical Depth

In the most simplest terms, optical depth refers to the level of transparency of a medium. There are multiple ways to define it mathematically, but the most straightforward way is:
$$
\tau = \int_0^z \alpha dz
$$
where $\alpha$ is the extinction coefficient of the medium. Other definitions include
$$
\tau = -\ln \left( \dfrac{I}{I_0} \right) = \sigma N = 
$$



# Dust Extinction

Light emitted from light sources like stars as it reaches to us (observers) can attenuate through dust in three major ways:
1. Absorption by the dust present along the line of sight to the observer.
2. Scattering *out* of the line of sight to the observer.
3. Scattering *into* the line of sight to the observer (also called *[[Forward Scattering|forward scattering]]*).

From the definition of [[Magnitude|magnitude]], we can express visual extinction as 

$$
A_V \coloneqq -2.5 \log_{10} \left(\dfrac{F_V}{F_{V, \text{unatten}}}\right)
$$
More generally, 
$$
A_{\lambda} \coloneqq -2.5 \log_{10} \left( \dfrac{F_{\lambda}}{F_{\lambda, \text{unatten}}} \right)
$$
Simplifying by substituting the expression for [[Optically Thick and Optically Thin Media#Optical Depth|optical depth]], $F_{\lambda} = F_{\lambda, \text{unatten}} e^{-\tau_{\lambda}}$
$$
A_{\lambda} = 1.086 \tau_V
$$
where $1.086 = 2.5 \log_{10}(e)$.

Observationally, the measurement of overall amplitude of extinction (that is, what we see, implying the part of spectrum which lies in the visual band) and reddening of light are separate tasks and it is better to model them using separate quantities. Thus, we define

$$
\tau_{\lambda} = \tau_{V} Q_{\lambda}
$$
The latter factor represents dust extinction and accounts for grain composition and shape, but more importantly also is a function of local geometry of dust and stars along the line of sight as well the global geometry of the galaxy. There are multiple empirical derivation for values of $Q_{\lambda}$, with one of them being the defined as the slopes of the (dust) attenuation curves. The value for this factor used in Tielens (2005), uses $Q_{\lambda} = 2.6$ (see Equation 3.19). 

Now, given this formulation, if one were to express visual extinction ($A_V$) using, say, UV flux or intensities, the final expression comes together as follows

$$
\begin{align}
A_V &= 1.086 \tau_V \\
&= 1.086 \dfrac{\tau_{\lambda}}{Q_{\lambda}} \\
&= - 1.086 \ln \left( \dfrac{F_{UV}}{F_{UV, \text{unatten}}} \right) \cdot \dfrac{1}{Q_{\lambda}}
\end{align}
$$
which is the same form as described in Du & Bergin (2014).

>[!References]
>1. [Wild et al, 2011](https://ui.adsabs.harvard.edu/abs/2011MNRAS.417.1760W/abstract)
>2. [Tielens, 2005](https://ui.adsabs.harvard.edu/abs/2005pcim.book.....T/abstract)
>3. [Du & Bergin, 2014](http://dx.doi.org/10.1088/0004-637X/792/1/2)
