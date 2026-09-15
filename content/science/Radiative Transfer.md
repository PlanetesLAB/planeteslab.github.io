---
tags:
  - physics
status: writing
---
The theory of radiative transfer describes how electromagnetic radiation travels through a medium. The matter can absorb, (re-)emit and/or scatter radiation and change its intensity. We will start with developing an equation which can describe how intensity changes in the absence of scattering as radiation travels through matter. Therefore, 

# Emission

# Absorption

# Thermal Radiative Transfer

We have

$$
\dfrac{\mathrm dI_{\nu}}{\mathrm ds} = -\alpha_{\nu}I_{\nu} + j_{\nu}
$$

We know from [[Blackbody Radiation#Universality of blackbody radiation|Kirchhoff's law]]:

$$
j_{\nu} = \alpha_{\nu} B_{\nu} (T)
$$

Therefore, 

$$
\dfrac{\mathrm dI_{\nu}}{\mathrm ds} = -\alpha_{\nu}I_{\nu} + \alpha_{\nu}B_{\nu} (T)
$$

or

$$
\dfrac{\mathrm dI_{\nu}}{\mathrm d\tau_{\nu}} = -I_{\nu} + B_{\nu} (T)
$$

This implies if $I_{\nu} > B_{\nu}$, the radiation gets dimmer further we travel in the medium and if $I_{\nu} < B_{\nu}$, then the radiation gets brighter. Thus, matter attempts to drive $I_{\nu}$ towards $B_{\nu} (T)$. If $T$ is constant:

$$
I_{\nu} (\tau_{\nu}) = I_{\nu}(0) e^{-\tau_{\nu}} + B_{\nu} (T)(1-e^{-\tau_{\nu}})
$$

so $\tau_{\nu} \gg 1 \implies I_{\nu} \simeq B_{\nu}(T)$, explaining why optically thick emission resembles blackbody.

# Scattering

In case of true absorption, the incident photon disappears and its energy is transferred to the material it was incident on. The material may 


>[!Related]- See also
>[[Optically Thick and Optically Thin Media#Dust Extinction]]