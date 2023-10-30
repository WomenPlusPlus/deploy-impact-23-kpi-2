# Notebooks Usage Guide

This repository contains a series of Jupyter notebooks designed to walk you through various stages of data analysis and manipulation. Below is a brief overview of each notebook and its intended use:

## 1. [00_data_exploration.ipynb](./00_data_exploration.ipynb)
This notebook is dedicated to the initial exploration of the dataset. Here, you'll find preliminary analyses, data quality checks, and basic visualizations that help in understanding the dataset's structure, contents, KPI hierarchies and potential issues.

## 2. [01_KPI_design.ipynb](./01_KPI_design.ipynb)
In this notebook, we dive into the initial design and formulation of Key Performance Indicators (KPIs). It guides you through the process of determining relevant metrics that align with your objectives and how to compute them using the dataset.

## 3. [02_toy_dataset.ipynb](./02_toy_dataset.ipynb)
This notebook focuses on creating a toy dataset, integrating additional available datasets and filling up missing values.

## 4. [03_data_augmentation_ctgan.ipynb](./03_data_augmentation_ctgan.ipynb)
Here, we explore data augmentation using CTGAN (Conditional Generative Adversarial Networks). Data augmentation is a technique to artificially expand the size of your dataset, and in this notebook, we use CTGAN to generate synthetic data that complements our original dataset. We also integrate timeseries patters to the generated datasets to make it more realistic.

## 5. [04_new_input_data_structure.ipynb](./04_new_input_data_structure.ipynb)
In this notebook, we delve into restructuring the input data. This can involve tasks like reshaping, reformatting, or preprocessing the data to make it suitable for specific analyses, models, or visualizations. We add as well required columns for metrics design. The notebook also includes Process and Perfomance calculations.

## 6. [05_data_viz_js_snippets.ipynb](./05_data_viz_js_snippets.ipynb)
This notebook creates snippets of JavaScript code for data visualizations. It's a resource for those looking to integrate interactive visualizations into web applications or presentations, utilizing the power of Apache Echart. The code has functions to calculte data that flows into the viz and functions to create the viz as JS snippets, follwoing a set of rules.

---

Feel free to navigate to each notebook for a deeper dive into their contents and functionalities. Happy analyzing!
