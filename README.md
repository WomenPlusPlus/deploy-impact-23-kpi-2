# deploy-impact-23-kpi-2: Knights of Performance Insights

![Knights](https://github.com/WomenPlusPlus/deploy-impact-23-kpi-2/assets/9113484/a193d790-b8d5-466a-9bf4-46913c057f9a)

Welcome to the KPI Tracking App repository of the Knights of Performance Insights (KPI2), a centralized solution crafted to replace traditional tools like Excel sheets for monitoring Key Performance Indicators (KPIs). Tailored for organizations like Pro Juventute, this platform aims to offer a unified system for tracking diverse KPIs, many of which aren't automatically measurable. Leveraging modern technologies, this app streamlines the process of data collection, visualization, and decision-making. From team economists inputting monthly data to gatekeepers defining and maintaining KPIs, this project serves as a one-stop solution to drive efficiency, transparency, and data-driven growth. Dive into the sections below for a comprehensive understanding of the project's purpose, technical stack, requirements, and more.

---

## Repository Structure
- **[backend](./backend/)**: Contains all the server-side logic, database models, and API endpoints.
- **[datascience](./datascience/)**: Houses data analysis scripts, Jupyter notebooks, and other data-related assets.
- **[frontend](./frontend/)**: Dedicated to the user interface of the app, built with Typescript and ReactJs.
- **[venv](./venv/)**: This directory contains the virtual environment for the project. It ensures that the project has its own isolated space for Python dependencies, separate from system-wide installations. It's crucial to activate the virtual environment before running or developing the project locally.


## 1.1 Project Purpose and Justification
Organizations like Pro Juventute, with a diverse set of programs and activities, often track their KPIs, many of which cannot be measured automatically. This project aims to move away from traditional methods like Excel sheets and create a centralized KPI tracking system that enhances efficiency and transparency.

## 1.2 Context and Opportunity
- **Context**: Many organizations define goals/OKRs/KPIs, but not all can be measured automatically.
- **Opportunity**: By creating a dedicated app for this purpose, the project can enhance efficiency, streamline processes, and enable data-driven decisions for diverse teams.

## 1.3 Vision and Goal
- **Vision**: To build a platform that allows the collection of data that will help Pro Juventute define goals and grow towards them.
- **Goal**: Enable team members to manually input KPI values with minimal effort for visualization in a dashboard.

## 1.4 Project Description and Solution
Develop an Open Source, Enterprise-ready web app to facilitate the consistent tracking, amendment, and visualization of KPIs while supporting visualization tools integration.

## 1.5 Personas
- **Gita (Team Economist)**:
  - **Purpose**: Enable consistent KPI tracking.
  - **Tasks**: Frequently insert valid KPI values (max once per month).
  - **Pains**: Confusion and errors in entering data.
  - **Needs**: A straightforward method to input values.
  
- **Helga (Gatekeeper)**:
  - **Purpose**: Define and maintain KPIs.
  - **Tasks**: Collaborate on KPI definition and manage the app.
  - **Pains**: Maintenance effort of the current excel file.
  - **Needs**: Ensure data quality.

## 1.6 Requirements
- **Functional**:
  - Single Sign On (SSO)
  - CRUD operations for KPIs
  - KPI actual data visualization
  - KPI progression & performance visualization
  - Change log traceability
  - Option to enter targets for KPIs
  
- **Non-Functional**:
  - UX: Familiar/simple UI, Gatekeeper-defined KPIs
  - Tooltips with info for the user
  
- **Out of Scope**:
  - AI assistance for KPI definition
  - Team/circle hierarchy definition by gatekeepers
  - Automatic data ingestion from DWH
  - Integration with Jira, Trello, etc.
  - m:n (one KPI can be used by multiple teams with different values)
  - 1:n (one KPI can be used by multiple teams)

## 1.7 Technology Stack
- **Data Science**: Python & Flask. Visualizations on Apache Echarts JS library. Flask.
- **UX/UI**: Figma, [boards available here](https://www.figma.com/file/4C32qXR71cVyO6ykukVgMT/Pro-Juventute-Design-System?type=design&node-id=115-883&mode=design&t=GCG8SJHGtCUVTYyX-0)
- **Backend**: Python, Flask.
- **Frontend**: Typescript, ReactJs.
- **Database**: PostgreSQL for development, SQLite for testing, and ElephantSQL for production.
- **Cloud Storage**: Preference for Swiss region, European entity, and GDPR compliant solutions.
- **Deployments**: Render

---

To get started with the project, follow the setup instructions in each subdirectory. Contributions, feedback, and improvements are always welcome!
