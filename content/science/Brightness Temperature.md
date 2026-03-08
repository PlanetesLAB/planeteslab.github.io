---
tags:
  - physics
---
Telescopes usually observe the flux density $S_{\nu}$ (in mJy) from the sky. Images themselves are usually in the units of Jy per beam. Brightness temperature is a way to convert this intensity into an equivalent temperature of a blackbody that would produce the same surface brightness at that frequency.

One can do this conversion by using [[Planck's law]]. We have

$$
\begin{split}
I_{\nu} (T) &= \dfrac{2 h \nu^3}{c^2} \dfrac{1}{e^{h\nu/(k_BT_b)} - 1} \\
\implies T_b &= \dfrac{h\nu}{k_B} \left[\ln \left(1+\dfrac{2h\nu^3}{I_{\nu}c^2}\right)\right]^{-1}
\end{split}
$$

Now, flux density per beam, $S_{\nu}$ is:

$$
S_{\nu} = I_{\nu} \Omega_{\text{beam}}
$$

where $\Omega_{\text{beam}}$ is the beam solid angle. We can apply Rayleigh-Jeans approximation under which $h \nu \ll k_B T_b$ which reduces the exponent and gives a slightly simpler explanation

$$
e^{h \nu/ (k_B T_b)} \approx 1 + \dfrac{h \nu}{k_B T} \implies I_{\nu} \approx \dfrac{2 k_B T_b \nu^2}{c^2} \implies T_b \approx \dfrac{c^2}{2k_B \nu^2} I_{\nu}
$$