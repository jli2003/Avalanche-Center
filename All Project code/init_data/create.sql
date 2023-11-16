DROP TABLE IF EXISTS users CASCADE;
CREATE table users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL,
    user_type BIT NOT NULL
);

DROP TABLE IF EXISTS reports CASCADE;
CREATE TABLE reports(
    report_id INT PRIMARY KEY,
    observations TEXT NOT NULL,
    date DATETIME NOT NULL
);

DROP TABLE IF EXISTS reports_to_user CASCADE;
CREATE TABLE reports_to_user (
    username VARCHAR(50) NOT NULL,
    report_id INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username),
    FOREIGN KEY (report_id) REFERENCES reports (report_id)
);