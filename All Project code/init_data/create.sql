DROP TABLE IF EXISTS users CASCADE;
CREATE table users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS reports CASCADE;
CREATE TABLE reports(
    report_id INT PRIMARY KEY,
    observations TEXT NOT NULL,
    date DATE NOT NULL,
    username VARCHAR(50) NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username)   
);