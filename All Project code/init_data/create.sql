DROP TABLE IF EXISTS users cascade;
CREATE table users (
    username VARCHAR(50) PRIMARY KEY,
    id int NOT NULL
);

DROP TABLE IF EXISTS reports CASCADE;
CREATE table reports (
    report_id INT PRIMARY KEY,
    observations LONGTEXT NOT NULL,
    date DATETIME NOT NULL,
    username VARCHAR(50) NOT NULL REFERENCES users (username) ON DELETE CASCADE

);