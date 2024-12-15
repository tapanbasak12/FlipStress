# FlipStress: Noise Injection Defenses Against CPU-Cache-Based Web Attacks

## This repository contains resources for installing, running, and experimenting with **FlipStress**, a browser extension that injects noise to counter CPU-cache-based web attacks, specifically Targeted Deanonymization (TD) and Website Fingerprinting (WF). 
---

## Installation Instructions

### Installing FlipStress on Chrome
1. Download the `FlipStress:Chrome` folder from this repository.
2. Open Chrome and navigate to **Extensions** (or type `chrome://extensions/` in the address bar).
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the downloaded `FlipStress:Chrome` folder.

### Installing FlipStress on Firefox/Tor
1. Download the `FlipStress:Firefox` folder from this repository.
2. Open Firefox and go to `about:debugging` -> **This Firefox** -> **Load Temporary Add-On**.
3. Select any file from the downloaded folder (e.g., `manifest.json`).

---

## Features

### Data Collection
The `Data_Collection` folder contains Selenium automation scripts to automate the collection of cache traces for targeted deanonymization attacks.

> **Note:** Before running the scripts, ensure that the target page and non-target page are hosted and inserted into the automation script. After loading the FlipStress extension, start it in your browser before beginning data collection.

### Cache Trace Data
The `Cache_Trace_Data` folder includes:
- Cache trace data for **TD** under the influence of all fixed stressors and FlipStress.
- Due to the large size of the **WF** cache trace data, the complete dataset could not be included in this repository. Instead, demo data from two websites is provided in the `WF_Data` folder for reference.

### Models and Scripts
The `Python_Files` folder contains:
- All models described in the paper.
---

## Getting Started
1. Clone or download this repository.
2. Follow the installation instructions for your preferred browser to load the FlipStress extension.
3. Use the data collection scripts to collect cache traces or experiment with the provided cache traces and models to analyze the impact of FlipStress.

---


