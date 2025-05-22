# ChalkLand

This is a fictional sports league where there are 32 Pro teams, 64 Club teams, and 100s of players equiped with unique strengths across 4 primary skills. Each team and player has a location on the map, which influences both trait generation and player preference for teams. Just like in real-world major sports leagues, the teams draft players, play seasonal matchups, and fight for the championship. 

Each team is guided my a machine learning model trained on the previous game data. Club team locations are determined using KNN, emulating organic sports league growth. 

The draft occurs in the offseason, and considers the custom team and player preferences (teams prefer players with certain skills, while players prefer teams based on location and last years performance). The teams and players are generated using notebooks and the draft and games are executed using python scripts as packages within the repo. 


## To-Do
- create teams and players and be able to visduale them on the globe. a list of all player on that spot should appear. 

## Create Globe

https://www.piskelapp.com/p/create/sprite

- 4 continent
- 8 teams on each continent
- 32 pro teams, 2 club teams each. 
- regular season play determines premier league qualification. 
- players have unique colors, pets, & blood types
- 2 club teams play to see who get to go to globe wide 32 team tourny for scouting exposure
- only teams in tourmants withou other contnents can get seen by cities on those contonents
- 12 teams int he premier league. each play each other once . play inter contnent teams 2 times on the first week. Makign ti 9 weeks toal. then a 2 week liong 8 team bracket to determine league seasonal champ.
- 4 seaons a year, 
9 regular season 2 weeks post season, 1 week draft
- teams in the premier league also play in the regual league. Regualr season is 9 weeks long. Top 2 teams ion each contnetn qualify for nexct years premier legue. Then overe the two week premier tournamnt. the 3-6 seeds on each contnent have a 4 team bracket to determine the theird team that qualidufies. 
- each tile offers a club team certain perks
- Teams can have 12 guys max.8 guys min. 
- three players are named captain and have to be played 3 times per game. Then the remaining 5-9 players have to be played at least once, but no more than twice.
- each game has 18 rounds. where each player uses two of the three available game perks. 
- beofre the match scrtahc one of the three non-contnent traits. each contnent has a perk that will always be one of the three randomly chosen at each 1v1 player matchup
- at the end of each seaon teams must drop 2 - (players that retuired) from their team. Each player has a retuired trait that is hidden and has a mean of 30 season . this will move dpeending on team performwce. 
- this means about 25 new players are geenrated per continent each seaosn. New player every 3 years. 
- player have a cluthc trait that helps when a game point is on the line or if it is the playoffs

