DROP TABLE IF EXISTS users CASCADE;
CREATE table users (
    username VARCHAR(100) PRIMARY KEY,
    email VARCHAR(100),
    password CHAR(60) NOT NULL,
    user_type BIT NOT NULL
);

DROP TABLE IF EXISTS reports CASCADE;
CREATE TABLE reports(
    report_id INT PRIMARY KEY,
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
    FOREIGN KEY (report_id) REFERENCES reports (report_id)
);

CREATE OR DROP TYPE avalanche_type AS ENUM (
  'wind_slab',
  'storm_slab',
  'wet_slab',
  'dry_loose',
  'wet_loose',
  'persistent_slab',
  'none'
);

CREATE OR DROP TYPE danger_rating AS ENUM (
  'low',
  'medium',
  'high',
  'extreme'
);

DROP TABLE IF EXISTS home_reports CASCADE;
CREATE TABLE home_reports (
  report_id SERIAL PRIMARY KEY,
  image_path VARCHAR(200),
  location VARCHAR(100),
  avy_type avalanche_type NOT NULL,
  danger_rating danger_rating NOT NULL,
  observations VARCHAR(250) NOT NULL,
  date TIMESTAMPTZ NOT NULL
);