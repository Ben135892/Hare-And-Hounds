DROP TABLE players;
DROP TABLE games; 

CREATE TABLE games (
    id CHAR(6) PRIMARY KEY NOT NULL,
    has_started BOOLEAN NOT NULL,
    runner_been_found BOOLEAN NOT NULL,
    round_number INTEGER NOT NULL,
    location_update_number INTEGER NOT NULL,
    location_update_interval INTEGER NOT NULL,
    location_show_time INTEGER NOT NULL,
    runner_last_latitude DECIMAL NOT NULL,
    runner_last_longitude DECIMAL NOT NULL
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY NOT NULL,
    NAME VARCHAR(20) NOT NULL,
    socket_id VARCHAR(50) NOT NULL,
    is_runner BOOLEAN NOT NULL,
    is_hosting BOOLEAN NOT NULL,
    game_id CHAR(6) NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);