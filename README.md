# Chalkly Premier league - CPL

This is a fictional sports league where there are 32 Pro teams, 64 Club teams, and 100s of players equipped with unique strengths across 4 primary skills. Each team and player have a location on the map, which influences both trait generation and player preference for teams. Just like in real-world major sports leagues, the team’s draft players, play seasonal matchups, and fight for the championship. 

Each team is guided by a machine learning model trained on the previous game data. Club team locations are determined using KNN, emulating organic sports league growth. 

The draft occurs in the offseason and considers the custom team and player preferences (teams prefer players with certain skills, while players prefer teams based on location and last year’s performance). The teams and players are generated using notebooks and the draft and games are executed using python scripts as packages within the repo. 

## To-Do
- create teams and players and be able to visualize them on the globe. A list of all players on that spot should appear. 

## Create Globe

![Globe May 2025](/data/globe_may_2025.png)
- https://www.piskelapp.com/p/create/sprite source to draw pixel map for custom geography

- 4 continents
- 8 cities on each continent (32 total)
- Each city has a pro team (32), and two clubs (64)

## Pro Teams 
- 8 teams on each continent
- 32 pro teams, one pro team per city. 
- 64 club teams - 2 clubs for each city. 
- The goal of each team in the pro league is to 1) qualify for the premier league 2) win the premier league.
- regular season play determines premier league qualification. 
- Every team in the premier league will still play in the pro league at the same time.
- Top 2 teams in each continent qualifies for next year’s premier league. Then over the two-week premier tournament. The 3-6 seeds on each continent have a 4-team bracket to determine the third team that qualifies. 
- Pro league games are mon-fri where every team plays every day. 
- Premier league games are on saturdays where each premier team plays twice.
- This regular season lasts 9 weeks. The top 8 premier league teams qualify for the premier championship bracket to determine premier league champion.
- the playoffs last 2 weeks and are followed by a week for the draft and roster adjustments.  
- the top two teams on each continent in the pro league qualify for the next seasons premier league. 
- A season is 3 months. - 4 seasons a year, 9 week regular season, 2 weeks post season, 1 week draft, extra time until next season start
- To determine the third qualifying team on each continent, the 3-6 seeds play in a tournament - the winner qualifying for the premier league.
- The bottom two teams on each island (8 total) get draft privilages. 

## Drafting
- knowledge of player talent is scarse and unequal across teams.
- Some teams may not even know about a player
- teams can buy game result information at three teirs. game outcome, player ranking (best to worst), all game data. 
- Instead of draft picks you get draft currency that you can bid on players. This can be a part of trades as well. 
- Only the bottom 8 teams get draft picks. They can select from the whole globe. This costs no money, distance doesnt matter. 
- Then the bidding begins, distance factors into player decisions. Premier league teams will earn less bidding money. 

## Trading
- Can trade players
- Can trade money
- Can trade conditional top 8 pick. 

## Chalkly Gameplay
- each tile offers a club team certain perks
- Teams can have 12 guys max.8 guys min. 
- three players are named captain and have to be played 3 times per game. Then the remaining 5-9 players have to be played at least once, but no more than twice.
- each game has 18 battles - over two 9 battle rounds. 
- in each battle, a team picks one player to use, then the opponent can chose an opponent based on that selelction. Then the two battle. specifics unknown. 
- the two teams alternate who presents the first player. 
- To score a point you need to win two consecutive battles. 
- 1 point for two in a row, 3 points for 3, 4 points for 4. 6 points for 5.
- streaks reset at the end of the first round. 
-OT is played as 9 battle rounds as needed until one teams has more than the other at any point.

## Battle
- TBD

## Players
- players have unique colors, pets, & blood types
- at the end of each season teams must drop 2 - (players that retired) from their team. Each player has a retired trait that is hidden and has a mean of 30 seasons. This will move depending on team performance. 
- this means about 25 new players are generated per continent each season. New player every 3 years. 
- players have a clutch trait that helps when a game point is on the line or if it is the playoffs.
- only players in tournaments on other continents can be seen by cities on those continents

## Club Teams
- are formed using KNN are are determined by location and not skill. 
- local club teams have to battle for global exposure
- 2 club teams play to see who get to go to globe wide 32 team tourney for scouting exposure
- As well as other smaller tournamnets hosted on other islands. 
- The invitations from other contonents cities are for the better of the two cities club teams - as determined by a single match right before the tournament. 


