Spy Hunt Server

Spy Hunt Server is the backend for the Spy Hunt game. It is for the developer who runs the game.

Each phone sends its game code, team, and position. The server answers with the other players in the same game who reported in the last 30 seconds. Players who stay quiet for a minute are forgotten.

Latest change. 2026-11-10, v2026.11.10. Created the Spy Hunt server, which keeps track of where each player in a game is. Each phone sends its position and gets back the other players it has seen recently. Players who go quiet for a minute are dropped.

Full history is in CHANGELOG.md.
