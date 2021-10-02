DROP TABLE games;
DROP TABLE players;

CREATE TABLE games (
    ID CHAR(6) PRIMARY KEY,
    HAS_STARTED BOOLEAN,
    RUNNER_BEEN_FOUND BOOLEAN,
    ROUND_NUMBER INTEGER,
    LOCATION_UPDATE_NUMBER INTEGER,
    LOCATION_UPDATE_INTERVAL INTEGER,
    LOCATION_SHOW_TIME INTEGER,
    RUNNER_LAST_LATITUDE DECIMAL,
    RUNNER_LAST_LONGITUDE DECIMAL
);

CREATE TABLE players (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(20),
    SOCKET_ID VARCHAR(50),
    IS_RUNNER BOOLEAN,
    IS_HOSTING BOOLEAN,
    GAME_ID CHAR(6)
);