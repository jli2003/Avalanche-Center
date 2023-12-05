
/*
INSERT INTO reports (report_id, observations, date, image_path, location) VALUES 
(1, 'Observation detail here', '2023-11-14 10:00:00+00', '/images/report1.jpg', 'Location 1'),
(2, 'Another observation detail', '2023-11-14 11:00:00+00', '/images/report2.jpg', 'Location 2'),
(3, 'More observations here', '2023-11-14 12:00:00+00', '/images/report3.jpg', 'Location 3');


INSERT INTO reports_to_user (username, report_id) VALUES 
('user1', 1),
('user2', 2),
('user3', 3);
*/

INSERT INTO home_reports (image_path, danger_rating, avalanche_type, synopsis, date) VALUES 
('https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Shrek.Shrek.webp', 5, 'Snowy, it is bad', 'very bad', CURRENT_TIMESTAMP),
(NULL, 4, 'another', 'bad too', CURRENT_TIMESTAMP);

INSERT INTO users (username, email, password, user_type) VALUES 
('shrek1', 'shrek@gmail.com', 'shrek', B'0'),
('shrek2', 'shrek2@gmail.com', 'shrek3', B'0'),
('extra', 'extra@gmail.com','extra', B'0');

INSERT INTO user_reports (report_id, observations, date, image_path, location) VALUES
(1051, 'its green', CURRENT_TIMESTAMP, 'https://cdn.britannica.com/51/93451-050-4C57C2D5/Shrek-sidekick-Donkey.jpg','my swamp'),
(1052, 'more green', CURRENT_TIMESTAMP, 'https://www.looper.com/img/gallery/things-only-adults-notice-in-shrek/intro-1683876129.jpg', 'his swamp'),
(1060, 'no location, img', CURRENT_TIMESTAMP, NULL, NULL),
(1061, 'no image', CURRENT_TIMESTAMP, NULL, 'HERE'),
(1053, 'greenest', CURRENT_TIMESTAMP, 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Shrek.Shrek.webp', 'theswamp');

INSERT INTO reports_to_user (username, report_id) VALUES 
('shrek1', 1051),
('shrek2', 1052),
('shrek2', 1053),
('shrek1', 1060),
('shrek1', 1061);
