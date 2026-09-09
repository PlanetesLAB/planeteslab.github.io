---
tags:
  - mathematics
  - "#interferometry"
status: writing
---
# The Sifting property

$$
\int_{-\infty}^{+\infty} f(t)\delta(t-T)dt = f(T)
$$

The sifting property is an extremely neat property of the Dirac delta function. Consider the Fourier transform of a function $f(x)$

$$
F(s) = \int_{-\infty}^{+\infty} f(x) e^{-j2 \pi sx}dx
$$
and the inverse transform

$$
f(x) = \int_{-\infty}^{+\infty} F(s) e^{j2 \pi sx}ds
$$

In context of interferometry, it makes more sense to write the transformation in the time-frequency domain, where they can be written as

$$
F(\omega) = \int_{-\infty}^{+\infty} f(t) e^{-j \omega t}dt
$$
and

$$
f(t) = \frac{1}{2\pi} \int_{-\infty}^{+\infty} F(\omega) e^{-j \omega t}d \omega
$$
