# ChalkLand

This is a fictional sports league where there are 18 teams and 1000s of players equiped with unique strengths across 3 primary and 5 secondary skills. Each team and player has a location on the map, which influences both trait generation and player preference for teams. Just like in real-world major sports leagues, the teams draft players, play seasonal matchups, and fight for the championship. 

The draft occurs in the offseason, and considers the custom team and player preferences (teams prefer players with certain skills, while players prefer teams based on location and last years performance). The teams and players are generated using notebooks and the draft and games are executed using python scripts as packages within the repo. 

## Installation

```bash
# Clone the repository
git clone https://github.com/joel-day/chalkland.git

# Move to repository directory
cd chalkland

# Create the virtual environment
uv venv .venv

# Activate the virtual environment
source .venv\bin\activate # Mac/Linux
.venv\Scripts\activate   # Windows

# Sync environment based on dependencies in top-level pyproject.toml file
uv sync

# (OPTIONAL) Sync environment based on dependencies across all packages' pyproject.toml files
uv sync --all-packages
```

## Included Tools & Packages

- **UV**: Used for package management and virtual environment creation. Configured to manage environments in a monorepo setup, ensuring consistency across the project.

- **GitHub Actions**: Ensures that the code works across multiple operating systems (Linux, Mac, and Windows) and supports Python versions 3.10, 3.11, and 3.12. It's a part the CI pipeline and is configured to run on pull requests to main.

- **Pytest**: Configured to run tests and verify the correctness of code execution. It ensures that the codebase remains functional and that new changes don’t introduce unexpected behavior.
```bash
pytest
```
- **Flake8**: Used for checking code compliance with PEP8 standards. It helps maintain a clean and consistent code style across the project by enforcing formatting and style guidelines.
```bash
flake8 .
```

## Features Coming Soon
