# ChalkLand

This is a fictional sports league where there are 32 Pro teams, 64 Club teams, and 100s of players equipped with unique strengths across 4 primary skills. Each team and player have a location on the map, which influences both trait generation and player preference for teams. Just like in real-world major sports leagues, the team’s draft players, play seasonal matchups, and fight for the championship. 

Each team is guided by a machine learning model trained on the previous game data. Club team locations are determined using KNN, emulating organic sports league growth. 

The draft occurs in the offseason and considers the custom team and player preferences (teams prefer players with certain skills, while players prefer teams based on location and last year’s performance). The teams and players are generated using notebooks and the draft and games are executed using python scripts as packages within the repo. 

## To-Do
- create teams and players and be able to visualize them on the globe. A list of all players on that spot should appear. 

## Create Globe

![Globe May 2025](/data/globe_may_2025.png)

- https://www.piskelapp.com/p/create/sprite source to custom draw pixel map
- 4 continents
- 8 teams on each continent
- 32 pro teams, 2 club teams each. 
- regular season play determines premier league qualification. 
- players have unique colors, pets, & blood types
- 2 club teams play to see who get to go to globe wide 32 team tourney for scouting exposure
- only teams in tournaments without other continents can be seen by cities on those continents
- 12 teams int he premier league. each play each other once. play inter continent teams 2 times in the first week. Making it 9 weeks total. Then a 2-week long 8 team brackets to determine league seasonal champion.
- 4 seasons a year, 
9 regular season 2 weeks post season, 1 week draft
- teams in the premier league also play in the regular league. Regular season is 9 weeks long. Top 2 teams in each continent qualifies for next year’s premier league. Then over the two-week premier tournament. The 3-6 seeds on each continent have a 4-team bracket to determine the third team that qualifies. 
- each tile offers a club team certain perks
- Teams can have 12 guys max.8 guys min. 
- three players are named captain and have to be played 3 times per game. Then the remaining 5-9 players have to be played at least once, but no more than twice.
- each game has 18 rounds. where each player uses two of the three available game perks. 
- before the match scratch one of the three non-continent traits. Each continent has a perk that will always be one of the three randomly chosen at each 1v1 player matchup.
- at the end of each season teams must drop 2 - (players that retired) from their team. Each player has a retired trait that is hidden and has a mean of 30 seasons. This will move depending on team performance. 
- this means about 25 new players are generated per continent each season. New player every 3 years. 
- players have a clutch trait that helps when a game point is on the line or if it is the playoffs.


