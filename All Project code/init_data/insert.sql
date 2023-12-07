-- <img src="https://drive.google.com/uc?id=YOUR_IMAGE_ID" alt="Description">
-- https://drive.google.com/file/d/1fTyZ1myGjDEj5Z3klSKoHrU0mUGotTZU/view?usp=sharing

INSERT INTO home_reports (image_path, danger_rating, avalanche_type, synopsis, date) VALUES 
('https://drive.google.com/uc?id=1fTyZ1myGjDEj5Z3klSKoHrU0mUGotTZU', 'High', 'Wind Slab / Persistent Slab', 'N aspect highly reactive with persitent slabs that have been wind loaded, NE moderate, the safest slopes are the thin S-W.', CURRENT_TIMESTAMP);

INSERT INTO users (username, email, password, user_type) VALUES 
('Dave', 'Dave@gmail.com', 'xxxx1', B'0'),
('Bobby', 'Bobby@gmail.com', 'xxxx2', B'0'),
('Earl', 'Earl@gmail.com','xxxx3', B'0');

INSERT INTO user_reports (report_id, observations, date, image_path, location) VALUES
(50, 'Observed signs of persistent slab instability on north-facing slopes above treeline', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1FI4D9-CU1ZCQeafpcw2bSXnu3Q5XI64i','N couloirs'),
(51, 'Encountered wind slab conditions on exposed ridgelines', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1Agf_K7L7BFiMu6BASYhqkprQU8UKg8Zz', 'S ridge'),
(52, 'Noted loose dry snow avalanches on steep, northerly aspects', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1XYtaQMHlFWZnIOQ_wQ-vBt-js4kH_Iqz', NULL),
(53, 'weak layers near the ground contributed to the release of a large avalanche with a long-running crown', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1NqHVxzGzY_W6fcl-HMek6wGB3R5wZMn3', NULL),
(54, 'Wet and Loose', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1JOAN9uWIQ449uytgLh1JfmdASEEnwCVi', 'SE Gully'),
(55, 'Dry and solid', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1I_ud8GqZiprhYrJ23E2IR6DaubzDJiXL', 'NW'),
(56, 'Powdery', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1FFwXQpFrFhlfQTI-V5Gvnz9iHFptqAJ3', NULL),
(57, 'Wet point release', CURRENT_TIMESTAMP, 'https://drive.google.com/uc?id=1JVf94TDWzNwpXEpPXiChkBUga1WV1Ie7', 'Silver Couloir');


INSERT INTO reports_to_user (username, report_id) VALUES 
('Dave', 50),
('Bobby', 51),
('Earl', 52),
('Dave', 53),
('Earl', 54),
('Dave', 55),
('Bobby', 56),
('Bobby', 57)
;


-- not yet used

-- USER
-- https://drive.google.com/uc?id=1sglRWeJhNajjOmPqwweH_jf9BVsJ94ii

-- HOME
-- https://drive.google.com/uc?id=17eWfAfiUXRsQJW0cw3FMo6_XayEYzEXf