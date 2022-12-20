# Simple game to test WebSockets 'Draw-Challenge'

### Objective: Two players have 5min to draw an random object. Once time ends playes on lobby will be able to vote. Drawings with more vote win the game.

> Installation:
    - Download source.
    - Start the server: https://github.com/SkyVox/DrawChallenge/tree/master/drawserver
    - Start the client: https://github.com/SkyVox/DrawChallenge/tree/master/drawclient
    - Address to connect: localhost:3000
    
TODOS:
    - [ ] - Handle when users disconnect.
    - [x] - Make the page layout.
    - [x] - Min of two players to play.
    - [x] - If lobby has more than two players, choose two random users.
    - [x] - When time is over, users in the lobby should be able to vote in a draw.
    - [x] - 5min timer limit to draw.
    - [x] - Be able to draw together.
    - [x] - Create chat, so users can discuss about their drawings.
    - [x] - Way to see when board is locked.
