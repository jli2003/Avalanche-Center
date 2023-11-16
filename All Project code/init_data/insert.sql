-- INSERT INTO users (username, email, password, user_type) VALUES


INSERT INTO reports (report_id, observations, date, image_path, location) VALUES 
(1, 'Observation detail here', '2023-11-14 10:00:00+00', '/images/report1.jpg', 'Location 1'),
(2, 'Another observation detail', '2023-11-14 11:00:00+00', '/images/report2.jpg', 'Location 2'),
(3, 'More observations here', '2023-11-14 12:00:00+00', '/images/report3.jpg', 'Location 3');


INSERT INTO reports_to_user (username, report_id) VALUES 
('user1', 1),
('user2', 2),
('user3', 3);
