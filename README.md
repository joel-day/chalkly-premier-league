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

## Features Coming Soon
