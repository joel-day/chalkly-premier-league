# ChalkLand

This is a fictional sports league where there are 18 teams and 1000s of players equiped with unique strengths across 3 primary and 5 secondary skills. Each team and player has a location on the map, which influences both trait generation and player preference for teams. Just like in real-world major sports leagues, the teams draft players, play seasonal matchups, and fight for the championship. The draft occurs in the offseason, and considers the custom team and player preferences (teams prefer players with certain skills, while players prefer teams based on location and last years performance). The teams and players are generated using notebooks and the draft and games are executed using python scripts as packages within the repo. 

## Installation

```bash
# Clone the repository
git clone https://github.com/joel-day/chalkland.git
cd chalkland

# To make sure uv installs things into this environment, activate it first.
# Create and activate virtual environment.
uv venv .venv
.venv/bin/activate  # Mac/Linux: source .venv\Scripts\activate

# Install dependencies in the main .toml file
uv install

# How it works: sync your environment based on a defined list of dependencies (without changing the versions of installed packages that already match what's listed).
uv pip sync

#How it works: ensure everything in your environment is fully up to date according to your pyproject.toml, including upgrading or downgrading packages to the exact versions specified.
uv sync --all-packages
```

## Features coming soon
