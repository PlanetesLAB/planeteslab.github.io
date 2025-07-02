---
title: Notes
description: Repository for research notes
---
## Index of Knowledge

Browse by domain:

- [[A Glossary of Protoplanetary Disks/index|A Glossary of Protoplanetary Disks]]
- [[At the Fringes of Planet Formation/index|At the Fringes of Planet Formation]]
- [[Ice Modelling/index|Ice Modelling]]
- [[Machine Learning and Planetary Science/index|Machine Learning and Planetary Science]]
- [[Physics and Chemistry of Planet Formation/index|Physics and Chemistry of Planet Formation]]
- [[Planet Formation At Large/index|Planet Formation At Large]]
- [[Solar System In Context/index|Solar System In Context]]
- [[Surveys for Planetary Science/index|Surveys for Planetary Science]]
- [[The Observation Toolkit/index|The Observation Toolkit]]
- [[Thesis/index|Thesis]]


For the aforementioned dust and stellar properties, we perform a monochromatic Monte Carlo radiative transfer using \texttt{RADMC-3D} to calculate the 2D distribution of frequency-dependent mean intensities, $J_\nu(r,z)$. For simplicity, we assume that radiation is scattered isotropically by dust particles and compute the UV flux, $F_{\text{UV}}(r,z)$, using the following expression:  

$$
\begin{align}  
    F_{\text{UV}}(r,z) = \int_{\text{UV}} I_{\nu}(r,z)\Omega d\Omega = 4\pi \int_{\text{UV}} J_{\nu}(r,z) d\nu \label{eq:Fuv}  
\end{align}  
$$

The fourth panel in Figure \ref{fig:phy_struct} shows the F$_{\text{UV}}$ distribution in the disk. We calculate the visual extinction, $A_V(r,z)$ from F$_{\text{UV}}$ following the prescription by \citet{Du2014},  

$$
\begin{align}  
    A_V(r,z) = -1.086 \ln{\left[ \frac{F_{\text{UV}}(r,z)}{F_{\text{UV},0}(r, z)} \right]} 
\end{align}  
$$

where $( F_{\text{UV},0}(r, z) )$ represents the unattenuated UV flux from the star as received at the same point assuming the fall in flux only due to the inverse-square-law.