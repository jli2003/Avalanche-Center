DROP TABLE IF EXISTS users CASCADE;
CREATE table users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);