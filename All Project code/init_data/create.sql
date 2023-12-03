DROP TABLE IF EXISTS users CASCADE;
CREATE table users (
    username VARCHAR(100) PRIMARY KEY,
    email VARCHAR(100),
    password CHAR(60) NOT NULL,
    user_type BIT NOT NULL
);

DROP TABLE IF EXISTS user_reports CASCADE;
CREATE TABLE user_reports (
    report_id SERIAL PRIMARY KEY,
    observations VARCHAR(250) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    image_path VARCHAR(200),
    location VARCHAR(100)
);

DROP TABLE IF EXISTS reports_to_user CASCADE;
CREATE TABLE reports_to_user (
    username VARCHAR(100) NOT NULL,
    report_id INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users (username),
    FOREIGN KEY (report_id) REFERENCES user_reports (report_id)
);

DROP TABLE IF EXISTS home_reports CASCADE;
CREATE TABLE home_reports (
  report_id SERIAL PRIMARY KEY,
  image_path VARCHAR(200),
  danger_rating VARCHAR(50) NOT NULL,
  avalanche_type VARCHAR(50) NOT NULL,
  synopsis VARCHAR(250) NOT NULL,
  date TIMESTAMPTZ NOT NULL
);