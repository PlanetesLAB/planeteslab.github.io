---
tags:
  - observations
  - modeling
status: review
---
Channel maps are 2D spatial slices at specific spectral (velocity) intervals. Each map shows emission at a narrow velocity bin. Further, we can obtain the spectrum of each pixel by slicing intensity values across all channels. 

But *what* channel maps are tells us nothing about *why* they are useful. To understand their utility, consider a molecule (say $\mathrm{CO}$) rotating around the central star at some radius as part of the gaseous disk at [[Gas Kinematics|Keplerian speed]]. Separately from its orbital motion, this molecule has internal rotational energy levels and can emit photons through transitions between them. The photons reaching us here on Earth will have frequencies shifted by the [[Doppler effect]] according to whether the molecule was moving towards or away from us. Let us write the velocities that make up the molecule's line-of-sight (LOS) velocity, expressed in the [[Kinematic Local Standard of Rest|LSRK frame]].

$$
v_{\mathrm{LOS}} \approx v_{\mathrm{sys}} + v_{\mathrm K}
$$

Here, $v_{\mathrm{sys}}$ is the overall LOS velocity of the star-disk system in the LSRK frame, also called the *systemic* velocity, and $v_{\mathrm{K}}$ is the LOS component of the molecule's Keplerian velocity


>[!Related] See also
>[[Moment Maps]]