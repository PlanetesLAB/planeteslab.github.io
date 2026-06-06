---
tags:
  - journal
---
# December 2025

## 2025-12-12



## 2025-12-11

### Leaky Gaps

Rixin Li has kindly hosted a tutorial on how to run hydro models with `Athena++` at his [webpage](https://rixinli.me/LeakyGaps/). This includes instructions to run/compile the code, as well as how to setup problem generators and even provides additional scripts to analyze, process and visualize the simulation data in a better way.

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



