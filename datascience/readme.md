# Data Science Repository Guide

Welcome to the `datascience` repository. This repository is organized into various directories, each serving a specific purpose in the data science workflow. Below is an overview of each directory:

## 1. [data](./data/)
This directory contains all raw and processed datasets used in our projects. Typically, it is subdivided into:

- `raw/`: Original, untouched datasets.
- `processed/`: Cleaned and preprocessed data ready for analysis.
- `external/`: Any external data sources, like third-party datasets or APIs.

## 2. [notebooks](./notebooks/)
Here, you'll find Jupyter notebooks that document the exploratory analyses, data cleaning processes, modeling, and other interactive content. It's a space for experimentation and prototyping. The notebooks are named in a sequence for easier navigation, e.g., `00_data_exploration.ipynb`, `01_KPI_design.ipynb`, etc.

## 3. [scripts](./scripts/)
This directory houses standalone scripts or modules. These can be utility functions, data cleaning scripts, modeling pipelines, or any other code that has been modularized/refactored from the notebooks for reusability and production.

## 4. [viz](./viz/)
The `viz` directory is dedicated to data visualization assets. It includes some sample visualisations used in both the Economist screens and the Gatekeeper screen.

---

The structure of this repository follows best practices for data science projects, ensuring a clear workflow from raw data to insights and production code. As you navigate through, you'll find detailed documentation and comments to guide you. Happy analyzing!
