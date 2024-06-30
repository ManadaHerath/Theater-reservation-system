CREATE SCHEMA `theatre_management_system`;

USE `theatre_management_system`;

CREATE TABLE `users` (
  `id` varchar(24) NOT NULL,
  `email` varchar(128),
  `phone_number` varchar(32),
  `full_name` varchar(128),
  `gender` ENUM('male', 'female'),
  `avatar` varchar(512),
  `address` varchar(512),
  `birthday` date,
  `location` POINT,
  `role` ENUM('admin', 'customer'),
  `is_completed` tinyint(1),
  `is_active` tinyint(1),
  `stripe_customer_id` varchar(128),
  `password` varchar(128), -- Added password column temporarily
  PRIMARY KEY (`id`)
);

CREATE TABLE `movies` (
  `id` varchar(24) NOT NULL,
  `title` varchar(1024),
  `trailer_video_url` varchar(512),
  `poster_url` varchar(512),
  `overview` text,
  `released_date` date,
  `duration` int(11),
  `original_language` varchar(32),
  `age_type` ENUM('G', 'PG', 'PG-13', 'R', 'NC-17'),
  `is_active` tinyint(1),
  PRIMARY KEY (`id`)
);

CREATE TABLE `theatres` (
  `id` varchar(24) NOT NULL,
  `name` varchar(512),
  `address` varchar(512),
  `location` POINT,
  `mobile_number` varchar(24),
  `email` varchar(90),
  `details` varchar(1024),
  `is_active` tinyint(1),
  `no_of_seats` int,
  `no_of_rows` int,
  `no_of_columns` int,
  `image_url` varchar(512),
  PRIMARY KEY (`id`)
);

CREATE TABLE `show_times` (
  `id` varchar(24) NOT NULL,
  `movie_id` varchar(24) NOT NULL,
  `theatre_id` varchar(24) NOT NULL,
  `start_time` datetime,
  `end_time` datetime,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`),
  FOREIGN KEY (`theatre_id`) REFERENCES `theatres`(`id`)
);

-- CREATE TABLE purchases (
--   id varchar(24) NOT NULL,
--   theatre_id varchar(24) NOT NULL,
--   show_time_id varchar(24) NOT NULL,
--   seats varchar(255),
--   status varchar(24),
--   PRIMARY KEY (id),
--   FOREIGN KEY (theatre_id) REFERENCES theatres(id),
--   FOREIGN KEY (show_time_id) REFERENCES show_times(id)
-- );

CREATE TABLE temp_purchases (
  id varchar(24) NOT NULL,
  theatre_id varchar(24) NOT NULL,
  show_time_id varchar(24) NOT NULL,
  seats varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (theatre_id) REFERENCES theatres(id),
  FOREIGN KEY (show_time_id) REFERENCES show_times(id)
);
CREATE TABLE purchases (
  id varchar(24) NOT NULL,
  theatre_id varchar(24) NOT NULL,
  show_time_id varchar(24) NOT NULL,
  seats varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (theatre_id) REFERENCES theatres(id),
  FOREIGN KEY (show_time_id) REFERENCES show_times(id)
);
-- TEMPORARY TABLE TO STORE PURCHASES INTO TWO TABLES

CREATE TABLE `reservation` (
  `id` varchar(24) NOT NULL,
  `user_id` varchar(24) NOT NULL,
  `show_time_id` varchar(24) NOT NULL,
  `mobile_number` varchar(24),
  `email` varchar(24),
  `original_price` int(11),
  `coupon_code` varchar(24),
  `total_price` int(11),
  `is_active` tinyint(1),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`show_time_id`) REFERENCES `show_times`(`id`)
);

CREATE TABLE `people` (
  `id` varchar(24) NOT NULL,
  `avatar` varchar(512),
  `full_name` varchar(512),
  `is_active` tinyint(1),
  PRIMARY KEY (`id`)
);

CREATE TABLE `movie_director` (
  `id` varchar(24) NOT NULL,
  `person_id` varchar(24) NOT NULL,
  `movie_id` varchar(24) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`person_id`) REFERENCES `people`(`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);



CREATE TABLE `movie_actor` (
  `id` varchar(24) NOT NULL,
  `person_id` varchar(24) NOT NULL,
  `movie_id` varchar(24) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`person_id`) REFERENCES `people`(`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);

CREATE TABLE `categories` (
  `id` varchar(24) NOT NULL,
  `name` varchar(512),
  PRIMARY KEY (`id`)
);

CREATE TABLE `movie_category` (
  `id` varchar(24) NOT NULL,
  `category_id` varchar(24) NOT NULL,
  `movie_id` varchar(24) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);



CREATE TABLE `comments` (
  `id` varchar(24) NOT NULL,
  `comment_data` varchar(1024),
  `user_id` varchar(24) NOT NULL,
  `movie_id` varchar(24) NOT NULL,
  `is_active` tinyint(1),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);

CREATE Table seatCategories (
id varchar(24) not null,
theatre_id varchar(24) NOT NULL,
`row` varchar(24),
type Enum("Economy","Executive","Balcony","Luxury"),

 FOREIGN KEY (theatre_id) REFERENCES theatres(id)

);

-- Price Categories Table
CREATE TABLE price_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Seat Types Table
CREATE TABLE seat_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(255) NOT NULL
);

CREATE TABLE rows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  theatre_id varchar(24) NOT NULL,
  row_label CHAR(1) NOT NULL,
  price_category_id INT NOT NULL,
  FOREIGN KEY (theatre_id) REFERENCES theatres(id),
  FOREIGN KEY (price_category_id) REFERENCES price_categories(id)
);

-- Seats Table
CREATE TABLE seats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  row_id INT NOT NULL,
  seat_number INT NOT NULL,
  seat_type_id INT NOT NULL,
  FOREIGN KEY (row_id) REFERENCES rows(id),
  FOREIGN KEY (seat_type_id) REFERENCES seat_types(id)
);

-- Add a column for a refresh token in the users table

ALTER TABLE users
ADD COLUMN refresh_token VARCHAR(255) NULL;



--Trigger for new user insert--
DELIMITER //

CREATE TRIGGER user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE max_ID INT;
    SELECT MAX(CAST(SUBSTRING(id, 5) AS UNSIGNED)) INTO max_ID FROM users;
    IF max_ID IS NULL THEN 
        SET max_ID = 0;
    END IF;
    SET NEW.id = CONCAT('user', max_ID + 1);
END //

DELIMITER ;

--Trigger for new movie insert --

DELIMITER //

CREATE TRIGGER movie_insert
BEFORE INSERT ON movies
FOR EACH ROW
BEGIN
    DECLARE max_ID INT;
    SELECT MAX(CAST(SUBSTRING(id, 6) AS UNSIGNED)) INTO max_ID FROM movies;
    IF max_ID IS NULL THEN 
        SET max_ID = 0;
    END IF;
    SET NEW.id = CONCAT('movie', max_ID + 1);
END;
//

DELIMITER ;

--Trigger for new theatre insert --

DELIMITER //

CREATE TRIGGER theatre_insert
BEFORE INSERT ON theatres
FOR EACH ROW
BEGIN
    DECLARE max_ID INT;
    SELECT MAX(CAST(SUBSTRING(id, 8) AS UNSIGNED)) INTO max_ID FROM theatres;
    IF max_ID IS NULL THEN 
        SET max_ID = 0;
    END IF;
    SET NEW.id = CONCAT('theatre', max_ID + 1);
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER temp_purchases_insert
BEFORE INSERT ON temp_purchases
FOR EACH ROW
BEGIN
    DECLARE max_ID INT;
    SELECT MAX(CAST(SUBSTRING(id, 9) AS UNSIGNED)) INTO max_ID FROM temp_purchases;
    IF max_ID IS NULL THEN 
        SET max_ID = 0;
    END IF;
    SET NEW.id = CONCAT('purchase', max_ID + 1);
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER purchases_insert
BEFORE INSERT ON purchases
FOR EACH ROW
BEGIN
    DECLARE max_ID INT;
    SELECT MAX(CAST(SUBSTRING(id, 9) AS UNSIGNED)) INTO max_ID FROM purchases;
    IF max_ID IS NULL THEN 
        SET max_ID = 0;
    END IF;
    SET NEW.id = CONCAT('purchase', max_ID + 1);
END;
//

DELIMITER ;


-- Event for deleting old showtimes

CREATE EVENT daily_cleanup
ON SCHEDULE
  EVERY 1 DAY
  STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
  DELETE FROM show_times WHERE start_time < CURDATE();
  


-- Insert sample data for users
INSERT INTO `users` (id, email, phone_number, full_name, gender, avatar, address, birthday, location, role, is_completed, is_active, stripe_customer_id)
VALUES 
('user1', 'john.doe@example.com', '123-456-7890', 'John Doe', 'male', 'avatar1.png', '123 Main St, City, Country', '1980-01-01', ST_GeomFromText('POINT(1 1)'), 'customer', 1, 1, 'cus_ABC123'),
('user2', 'jane.doe@example.com', '987-654-3210', 'Jane Doe', 'female', 'avatar2.png', '456 Elm St, City, Country', '1985-05-05', ST_GeomFromText('POINT(2 2)'), 'customer', 1, 1, 'cus_DEF456'),
('user3', 'admin@example.com', '555-555-5555', 'Admin User', 'male', 'avatar3.png', '789 Oak St, City, Country', '1990-10-10', ST_GeomFromText('POINT(3 3)'), 'admin', 1, 1, 'cus_GHI789');

-- Insert sample data for movies
INSERT INTO `movies` (id, title, trailer_video_url, poster_url, overview, released_date, duration, original_language, age_type, is_active)
VALUES 
('movie1', 'Inception', 'trailer1.mp4', 'https://m.media-amazon.com/images/I/71thFiIUSpL._AC_UF1000,1000_QL80_.jpg', 'A mind-bending thriller.', '2010-07-16', 148, 'English', 'PG-13', 1),
('movie2', 'The Matrix', 'trailer2.mp4', 'https://cdna.artstation.com/p/assets/images/images/034/061/748/large/andrew-sebastian-kwan-the-matrix-poster-web.jpg?1611285175', 'A hacker discovers reality is an illusion.', '1999-03-31', 136, 'English', 'R', 1),
('movie3', 'Toy Story', 'trailer3.mp4', 'https://m.media-amazon.com/images/I/71iSIVGZQUL.__AC_SX342_SY445_QL70_FMwebp_.jpg', 'Toys come to life.', '1995-11-22', 81, 'English', 'G', 1);

-- Insert sample data for theatres
INSERT INTO `theatres` (`name`, `address`, `location`, `mobile_number`, `email`, `details`, `is_active`, `no_of_seats`, `no_of_rows`, `no_of_columns`, `image_url`) VALUES 
('Grand Theatre', '123 Main St, Springfield, IL', POINT(39.7817, -89.6501), '555-1234', 'grand@example.com', 'A historic theatre with a grand interior.', 1, 300, 15, 20, 'https://archives1.dailynews.lk/sites/default/files/styles/node-detail/public/news/2020/12/27/theatres_1.jpeg?itok=CLRwXoz1'),
('Capitol Cinema', '456 Elm St, Springfield, IL', POINT(39.8017, -89.6401), '555-5678', 'capitol@example.com', 'Modern cinema with the latest technology.', 1, 250, 12, 20, 'https://media.timeout.com/images/101889423/image.jpg'),
('Riviera Theatre', '789 Maple St, Springfield, IL', POINT(39.7917, -89.6301), '555-9012', 'riviera@example.com', 'Art-deco style theatre with luxurious seating.', 1, 200, 10, 20, 'https://media.timeout.com/images/101889429/750/422/image.jpg');

-- Insert sample data for show_times
INSERT INTO `show_times` (id, movie_id, theatre_id, start_time, end_time)
VALUES 
('show1', 'movie1', 'theatre1', '2024-06-15 19:00:00', '2024-06-15 21:28:00'),
('show2', 'movie2', 'theatre2', '2024-06-16 20:00:00', '2024-06-16 22:16:00'),
('show3', 'movie3', 'theatre3', '2024-06-17 18:00:00', '2024-06-17 19:21:00'),
('show4', 'movie2', 'theatre1', '2024-06-18 17:30:00', '2024-06-18 19:45:00'),
('show5', 'movie2', 'theatre2', '2024-06-19 16:00:00', '2024-06-19 18:12:00'),
('show6', 'movie1', 'theatre3', '2024-06-20 19:45:00', '2024-06-20 22:00:00'),
('show7', 'movie3', 'theatre1', '2024-06-21 21:00:00', '2024-06-21 23:15:00'),
('show8', 'movie2', 'theatre2', '2024-06-22 18:30:00', '2024-06-22 20:42:00'),
('show9', 'movie2', 'theatre1', '2024-06-18 20:30:00', '2024-06-18 21:45:00'),
('show10', 'movie1', 'theatre2', '2024-06-15 14:00:00', '2024-06-15 16:28:00'),
('show11', 'movie1', 'theatre3', '2024-06-15 21:30:00', '2024-06-15 23:58:00'),
('show12', 'movie3', 'theatre2', '2024-06-17 15:00:00', '2024-06-17 16:21:00'),
('show13', 'movie3', 'theatre1', '2024-06-17 20:00:00', '2024-06-17 21:21:00'),
('show14', 'movie2', 'theatre3', '2024-06-18 14:30:00', '2024-06-18 16:45:00'),
('show15', 'movie2', 'theatre1', '2024-06-18 19:00:00', '2024-06-18 21:15:00'),
('show16', 'movie2', 'theatre2', '2024-06-19 10:00:00', '2024-06-19 12:12:00'),
('show17', 'movie2', 'theatre1', '2024-06-19 12:30:00', '2024-06-19 14:42:00'),
('show18', 'movie1', 'theatre3', '2024-06-20 16:00:00', '2024-06-20 18:28:00'),
('show19', 'movie1', 'theatre1', '2024-06-20 20:00:00', '2024-06-20 22:28:00'),
('show20', 'movie3', 'theatre3', '2024-06-21 18:00:00', '2024-06-21 20:15:00'),
('show21', 'movie3', 'theatre2', '2024-06-21 22:00:00', '2024-06-21 23:15:00'),
('show22', 'movie2', 'theatre1', '2024-06-22 10:00:00', '2024-06-22 12:12:00'),
('show23', 'movie2', 'theatre3', '2024-06-22 13:30:00', '2024-06-22 15:42:00'),
('show24', 'movie2', 'theatre2', '2024-06-22 21:00:00', '2024-06-22 23:12:00'),
('show25', 'movie1', 'theatre1', '2024-06-23 11:00:00', '2024-06-23 13:28:00'),
('show26', 'movie3', 'theatre3', '2024-06-23 14:00:00', '2024-06-23 16:15:00'),
('show27', 'movie2', 'theatre1', '2024-06-23 17:00:00', '2024-06-23 19:12:00'),
('show28', 'movie2', 'theatre2', '2024-06-23 20:00:00', '2024-06-23 22:12:00'),
('show29', 'movie3', 'theatre3', '2024-06-24 12:00:00', '2024-06-24 14:15:00'),
('show30', 'movie1', 'theatre1', '2024-06-24 15:00:00', '2024-06-24 17:28:00'),
('show31', 'movie1', 'theatre1', '2024-06-15 10:00:00', '2024-06-15 12:28:00'),
('show32', 'movie2', 'theatre2', '2024-06-15 12:30:00', '2024-06-15 14:46:00'),
('show33', 'movie3', 'theatre3', '2024-06-15 15:00:00', '2024-06-15 16:21:00'),
('show34', 'movie2', 'theatre1', '2024-06-15 17:00:00', '2024-06-15 19:15:00'),
('show35', 'movie2', 'theatre2', '2024-06-15 19:30:00', '2024-06-15 21:42:00'),
('show36', 'movie1', 'theatre3', '2024-06-15 20:00:00', '2024-06-15 22:28:00'),
('show37', 'movie3', 'theatre1', '2024-06-15 22:00:00', '2024-06-15 23:15:00'),
('show38', 'movie2', 'theatre2', '2024-06-15 23:30:00', '2024-06-16 01:42:00'),
('show39', 'movie1', 'theatre1', '2024-06-25 10:00:00', '2024-06-25 12:28:00'),
('show40', 'movie2', 'theatre2', '2024-06-25 12:30:00', '2024-06-25 14:46:00'),
('show41', 'movie3', 'theatre3', '2024-06-25 15:00:00', '2024-06-25 16:21:00'),
('show42', 'movie2', 'theatre1', '2024-06-25 17:00:00', '2024-06-25 19:15:00'),
('show43', 'movie2', 'theatre2', '2024-06-25 19:30:00', '2024-06-25 21:42:00'),
('show44', 'movie1', 'theatre3', '2024-06-25 20:00:00', '2024-06-25 22:28:00'),
('show45', 'movie3', 'theatre1', '2024-06-25 22:00:00', '2024-06-25 23:15:00'),
('show46', 'movie2', 'theatre2', '2024-06-25 23:30:00', '2024-06-26 01:42:00'),
('show47', 'movie1', 'theatre1', '2024-06-26 10:00:00', '2024-06-26 12:28:00'),
('show48', 'movie2', 'theatre2', '2024-06-26 12:30:00', '2024-06-26 14:46:00'),
('show49', 'movie3', 'theatre3', '2024-06-26 15:00:00', '2024-06-26 16:21:00'),
('show50', 'movie2', 'theatre1', '2024-06-26 17:00:00', '2024-06-26 19:15:00'),
('show51', 'movie2', 'theatre2', '2024-06-26 19:30:00', '2024-06-26 21:42:00'),
('show52', 'movie1', 'theatre3', '2024-06-26 20:00:00', '2024-06-26 22:28:00'),
('show53', 'movie3', 'theatre1', '2024-06-26 22:00:00', '2024-06-26 23:15:00'),
('show54', 'movie2', 'theatre2', '2024-06-26 23:30:00', '2024-06-27 01:42:00'),
('show55', 'movie1', 'theatre1', '2024-06-27 10:00:00', '2024-06-27 12:28:00'),
('show56', 'movie2', 'theatre2', '2024-06-27 12:30:00', '2024-06-27 14:46:00'),
('show57', 'movie3', 'theatre3', '2024-06-27 15:00:00', '2024-06-27 16:21:00'),
('show58', 'movie2', 'theatre1', '2024-06-27 17:00:00', '2024-06-27 19:15:00'),
('show59', 'movie2', 'theatre2', '2024-06-27 19:30:00', '2024-06-27 21:42:00'),
('show60', 'movie1', 'theatre3', '2024-06-27 20:00:00', '2024-06-27 22:28:00'),
('show61', 'movie3', 'theatre1', '2024-06-27 22:00:00', '2024-06-27 23:15:00'),
('show62', 'movie2', 'theatre2', '2024-06-27 23:30:00', '2024-06-28 01:42:00'),
('show63', 'movie1', 'theatre1', '2024-06-28 10:00:00', '2024-06-28 12:28:00'),
('show64', 'movie2', 'theatre2', '2024-06-28 12:30:00', '2024-06-28 14:46:00'),
('show65', 'movie3', 'theatre3', '2024-06-28 15:00:00', '2024-06-28 16:21:00'),
('show66', 'movie2', 'theatre1', '2024-06-28 17:00:00', '2024-06-28 19:15:00'),
('show67', 'movie2', 'theatre2', '2024-06-28 19:30:00', '2024-06-28 21:42:00'),
('show68', 'movie1', 'theatre3', '2024-06-28 20:00:00', '2024-06-28 22:28:00'),
('show69', 'movie3', 'theatre1', '2024-06-28 22:00:00', '2024-06-28 23:15:00'),
('show70', 'movie2', 'theatre2', '2024-06-28 23:30:00', '2024-06-29 01:42:00'),
('show71', 'movie1', 'theatre1', '2024-06-29 10:00:00', '2024-06-29 12:28:00'),
('show72', 'movie2', 'theatre2', '2024-06-29 12:30:00', '2024-06-29 14:46:00'),
('show73', 'movie3', 'theatre3', '2024-06-29 15:00:00', '2024-06-29 16:21:00'),
('show74', 'movie2', 'theatre1', '2024-06-29 17:00:00', '2024-06-29 19:15:00'),
('show75', 'movie2', 'theatre2', '2024-06-29 19:30:00', '2024-06-29 21:42:00'),
('show76', 'movie1', 'theatre3', '2024-06-29 20:00:00', '2024-06-29 22:28:00'),
('show77', 'movie3', 'theatre1', '2024-06-29 22:00:00', '2024-06-29 23:15:00'),
('show78', 'movie2', 'theatre2', '2024-06-29 23:30:00', '2024-06-30 01:42:00'),
('show79', 'movie1', 'theatre1', '2024-06-30 10:00:00', '2024-06-30 12:28:00'),
('show80', 'movie2', 'theatre2', '2024-06-30 12:30:00', '2024-06-30 14:46:00'),
('show81', 'movie3', 'theatre3', '2024-06-30 15:00:00', '2024-06-30 16:21:00'),
('show82', 'movie2', 'theatre1', '2024-06-30 17:00:00', '2024-06-30 19:15:00'),
('show83', 'movie2', 'theatre2', '2024-06-30 19:30:00', '2024-06-30 21:42:00'),
('show84', 'movie1', 'theatre3', '2024-06-30 20:00:00', '2024-06-30 22:28:00'),
('show85', 'movie3', 'theatre1', '2024-06-30 22:00:00', '2024-06-30 23:15:00'),
('show86', 'movie2', 'theatre2', '2024-06-30 23:30:00', '2024-07-01 01:42:00'),
('show87', 'movie1', 'theatre1', '2024-07-01 10:00:00', '2024-07-01 12:28:00'),
('show88', 'movie2', 'theatre2', '2024-07-01 12:30:00', '2024-07-01 14:46:00'),
('show89', 'movie3', 'theatre3', '2024-07-01 15:00:00', '2024-07-01 16:21:00'),
('show90', 'movie2', 'theatre1', '2024-07-01 17:00:00', '2024-07-01 19:15:00'),
('show91', 'movie2', 'theatre2', '2024-07-01 19:30:00', '2024-07-01 21:42:00'),
('show92', 'movie1', 'theatre3', '2024-07-01 20:00:00', '2024-07-01 22:28:00'),
('show93', 'movie3', 'theatre1', '2024-07-01 22:00:00', '2024-07-01 23:15:00'),
('show94', 'movie2', 'theatre2', '2024-07-01 23:30:00', '2024-07-02 01:42:00'),
('show95', 'movie1', 'theatre1', '2024-07-02 10:00:00', '2024-07-02 12:28:00'),
('show96', 'movie2', 'theatre2', '2024-07-02 12:30:00', '2024-07-02 14:46:00'),
('show97', 'movie3', 'theatre3', '2024-07-02 15:00:00', '2024-07-02 16:21:00'),
('show98', 'movie2', 'theatre1', '2024-07-02 17:00:00', '2024-07-02 19:15:00'),
('show99', 'movie2', 'theatre2', '2024-07-02 19:30:00', '2024-07-02 21:42:00'),
('show100', 'movie1', 'theatre3', '2024-07-02 20:00:00', '2024-07-02 22:28:00'),
('show101', 'movie3', 'theatre1', '2024-07-02 22:00:00', '2024-07-02 23:15:00'),
('show102', 'movie2', 'theatre2', '2024-07-02 23:30:00', '2024-07-03 01:42:00'),
('show103', 'movie1', 'theatre1', '2024-07-03 10:00:00', '2024-07-03 12:28:00'),
('show104', 'movie2', 'theatre2', '2024-07-03 12:30:00', '2024-07-03 14:46:00'),
('show105', 'movie3', 'theatre3', '2024-07-03 15:00:00', '2024-07-03 16:21:00'),
('show106', 'movie2', 'theatre1', '2024-07-03 17:00:00', '2024-07-03 19:15:00'),
('show107', 'movie2', 'theatre2', '2024-07-03 19:30:00', '2024-07-03 21:42:00'),
('show108', 'movie1', 'theatre3', '2024-07-03 20:00:00', '2024-07-03 22:28:00'),
('show109', 'movie3', 'theatre1', '2024-07-03 22:00:00', '2024-07-03 23:15:00'),
('show110', 'movie2', 'theatre2', '2024-07-03 23:30:00', '2024-07-04 01:42:00'),
('show111', 'movie1', 'theatre1', '2024-07-04 10:00:00', '2024-07-04 12:28:00'),
('show112', 'movie2', 'theatre2', '2024-07-04 12:30:00', '2024-07-04 14:46:00'),
('show113', 'movie3', 'theatre3', '2024-07-04 15:00:00', '2024-07-04 16:21:00'),
('show114', 'movie2', 'theatre1', '2024-07-04 17:00:00', '2024-07-04 19:15:00'),
('show115', 'movie2', 'theatre2', '2024-07-04 19:30:00', '2024-07-04 21:42:00'),
('show116', 'movie1', 'theatre3', '2024-07-04 20:00:00', '2024-07-04 22:28:00'),
('show117', 'movie3', 'theatre1', '2024-07-04 22:00:00', '2024-07-04 23:15:00'),
('show118', 'movie2', 'theatre2', '2024-07-04 23:30:00', '2024-07-05 01:42:00'),
('show119', 'movie1', 'theatre1', '2024-07-05 10:00:00', '2024-07-05 12:28:00'),
('show120', 'movie2', 'theatre2', '2024-07-05 12:30:00', '2024-07-05 14:46:00'),
('show121', 'movie3', 'theatre3', '2024-07-05 15:00:00', '2024-07-05 16:21:00'),
('show122', 'movie2', 'theatre1', '2024-07-05 17:00:00', '2024-07-05 19:15:00'),
('show123', 'movie2', 'theatre2', '2024-07-05 19:30:00', '2024-07-05 21:42:00'),
('show124', 'movie1', 'theatre3', '2024-07-05 20:00:00', '2024-07-05 22:28:00'),
('show125', 'movie3', 'theatre1', '2024-07-05 22:00:00', '2024-07-05 23:15:00'),
('show126', 'movie2', 'theatre2', '2024-07-05 23:30:00', '2024-07-06 01:42:00'),
('show127', 'movie1', 'theatre1', '2024-07-06 10:00:00', '2024-07-06 12:28:00'),
('show128', 'movie2', 'theatre2', '2024-07-06 12:30:00', '2024-07-06 14:46:00'),
('show129', 'movie3', 'theatre3', '2024-07-06 15:00:00', '2024-07-06 16:21:00'),
('show130', 'movie2', 'theatre1', '2024-07-06 17:00:00', '2024-07-06 19:15:00'),
('show131', 'movie2', 'theatre2', '2024-07-06 19:30:00', '2024-07-06 21:42:00'),
('show132', 'movie1', 'theatre3', '2024-07-06 20:00:00', '2024-07-06 22:28:00'),
('show133', 'movie3', 'theatre1', '2024-07-06 22:00:00', '2024-07-06 23:15:00'),
('show134', 'movie2', 'theatre2', '2024-07-06 23:30:00', '2024-07-07 01:42:00'),
('show135', 'movie1', 'theatre1', '2024-07-07 10:00:00', '2024-07-07 12:28:00'),
('show136', 'movie2', 'theatre2', '2024-07-07 12:30:00', '2024-07-07 14:46:00'),
('show137', 'movie3', 'theatre3', '2024-07-07 15:00:00', '2024-07-07 16:21:00'),
('show138', 'movie2', 'theatre1', '2024-07-07 17:00:00', '2024-07-07 19:15:00'),
('show139', 'movie2', 'theatre2', '2024-07-07 19:30:00', '2024-07-07 21:42:00'),
('show140', 'movie1', 'theatre3', '2024-07-07 20:00:00', '2024-07-07 22:28:00'),
('show141', 'movie3', 'theatre1', '2024-07-07 22:00:00', '2024-07-07 23:15:00'),
('show142', 'movie2', 'theatre2', '2024-07-07 23:30:00', '2024-07-08 01:42:00'),
('show143', 'movie1', 'theatre1', '2024-07-08 10:00:00', '2024-07-08 12:28:00'),
('show144', 'movie2', 'theatre2', '2024-07-08 12:30:00', '2024-07-08 14:46:00'),
('show145', 'movie3', 'theatre3', '2024-07-08 15:00:00', '2024-07-08 16:21:00'),
('show146', 'movie2', 'theatre1', '2024-07-08 17:00:00', '2024-07-08 19:15:00');

-- Insert sample data for purchases
INSERT INTO purchases (id, theatre_id, show_time_id, seats)
VALUES 
('purchase1', 'theatre1', 'show1', 'A1,A2'),
('purchase2', 'theatre2', 'show2', 'B1,B2');


-- Insert sample data for temparory purchases
INSERT INTO temp_purchases (id, theatre_id, show_time_id, seats)
VALUES 
('purchase3', 'theatre3', 'show3', 'C1,C2');

-- Insert sample data for reservation
INSERT INTO `reservation` (id, user_id, show_time_id, mobile_number, email, original_price, coupon_code, total_price, is_active)
VALUES 
('reservation1', 'user1', 'show1', '123-456-7890', 'john.doe@example.com', 20, 'DISCOUNT10', 18, 1),
('reservation2', 'user2', 'show2', '987-654-3210', 'jane.doe@example.com', 25, 'SUMMER20', 20, 1),
('reservation3', 'user3', 'show3', '555-555-5555', 'admin@example.com', 15, 'NONE', 15, 1);

-- Insert sample data for people
INSERT INTO `people` (id, avatar, full_name, is_active)
VALUES 
('person1', 'avatar1.png', 'Christopher Nolan', 1),
('person2', 'avatar2.png', 'Keanu Reeves', 1),
('person3', 'avatar3.png', 'Tom Hanks', 1);

-- Insert sample data for movie_director
INSERT INTO `movie_director` (id, person_id, movie_id)
VALUES 
('md1', 'person1', 'movie1'),
('md2', 'person2', 'movie2'),
('md3', 'person3', 'movie3');

-- Insert sample data for movie_actor
INSERT INTO `movie_actor` (id, person_id, movie_id)
VALUES 
('ma1', 'person2', 'movie1'),
('ma2', 'person2', 'movie2'),
('ma3', 'person3', 'movie3');

-- Insert sample data for categories
INSERT INTO `categories` (id, name)
VALUES 
('category1', 'Action'),
('category2', 'Sci-Fi'),
('category3', 'Animation');

-- Insert sample data for movie_category
INSERT INTO `movie_category` (id, category_id, movie_id)
VALUES 
('mc1', 'category1', 'movie1'),
('mc2', 'category2', 'movie2'),
('mc3', 'category3', 'movie3');

-- Insert sample data for comments
INSERT INTO `comments` (id, comment_data, user_id, movie_id, is_active)
VALUES 
('comment1', 'Amazing movie!', 'user1', 'movie1', 1),
('comment2', 'Mind-blowing effects!', 'user2', 'movie2', 1),
('comment3', 'A classic for all ages.', 'user3', 'movie3', 1);

-- Insert sample data for seatCategories
INSERT INTO seatCategories (id, theatre_id, `row`, type)
VALUES 
('seatCat1', 'theatre1', 'A', 'Economy'),
('seatCat2', 'theatre2', 'B', 'Executive'),
('seatCat3', 'theatre3', 'C', 'Balcony');


INSERT INTO price_categories (id, category_name, price) VALUES 
(1, 'Standard', 10.00), 
(2, 'VIP', 20.00), 
(3, 'Couples', 30.00);

-- Seat Types Table
INSERT INTO seat_types (id, type_name) VALUES 
(1, 'Standard'), 
(2, 'VIP'), 
(3, 'Couples');

-- Rovs Table
INSERT INTO rovs (id, theatre_id, row_label, price_category_id) VALUES 
(1, 'theatre1', 'A', 1), 
(2, 'theatre1', 'B', 1), 
(3, 'theatre1', 'C', 1), 
(4, 'theatre1', 'D', 2), 
(5, 'theatre1', 'E', 3);

-- Seats Table
-- For row A
INSERT INTO seats (id, row_id, seat_number, seat_type_id) VALUES 
(1, 1, 1, 1), (2, 1, 2, 1), (3, 1, 3, 1), (4, 1, 4, 1), 
(5, 1, 5, 1), (6, 1, 6, 1), (7, 1, 7, 1), (8, 1, 8, 1), 
(9, 1, 9, 1), (10, 1, 10, 1), (11, 1, 11, 1), (12, 1, 12, 1), 
(13, 1, 13, 1), (14, 1, 14, 1), (15, 1, 15, 1), (16, 1, 16, 1), 
(17, 1, 17, 1), (18, 1, 18, 1), (19, 1, 19, 1), (20, 1, 20, 1);

-- For row B
INSERT INTO seats (id, row_id, seat_number, seat_type_id) VALUES 
(21, 2, 1, 1), (22, 2, 2, 1), (23, 2, 3, 1), (24, 2, 4, 1), 
(25, 2, 5, 1), (26, 2, 6, 1), (27, 2, 7, 1), (28, 2, 8, 1), 
(29, 2, 9, 1), (30, 2, 10, 1), (31, 2, 11, 1), (32, 2, 12, 1), 
(33, 2, 13, 1), (34, 2, 14, 1), (35, 2, 15, 1), (36, 2, 16, 1), 
(37, 2, 17, 1), (38, 2, 18, 1), (39, 2, 19, 1), (40, 2, 20, 1);

-- For row C
INSERT INTO seats (id, row_id, seat_number, seat_type_id) VALUES 
(41, 3, 1, 1), (42, 3, 2, 1), (43, 3, 3, 1), (44, 3, 4, 1), 
(45, 3, 5, 1), (46, 3, 6, 1), (47, 3, 7, 1), (48, 3, 8, 1), 
(49, 3, 9, 1), (50, 3, 10, 1), (51, 3, 11, 1), (52, 3, 12, 1), 
(53, 3, 13, 1), (54, 3, 14, 1), (55, 3, 15, 1), (56, 3, 16, 1), 
(57, 3, 17, 1), (58, 3, 18, 1), (59, 3, 19, 1), (60, 3, 20, 1);

-- For row D (VIP)
INSERT INTO seats (id, row_id, seat_number, seat_type_id) VALUES 
(61, 4, 1, 2), (62, 4, 2, 2), (63, 4, 3, 2), (64, 4, 4, 2), 
(65, 4, 5, 2), (66, 4, 6, 2), (67, 4, 7, 2), (68, 4, 8, 2), 
(69, 4, 9, 2), (70, 4, 10, 2), (71, 4, 11, 2), (72, 4, 12, 2), 
(73, 4, 13, 2), (74, 4, 14, 2), (75, 4, 15, 2), (76, 4, 16, 2), 
(77, 4, 17, 2), (78, 4, 18, 2), (79, 4, 19, 2), (80, 4, 20, 2);

-- For row E (Couples)
INSERT INTO seats (id, row_id, seat_number, seat_type_id) VALUES 
(81, 5, 1, 3), (82, 5, 2, 3), (83, 5, 3, 3), (84, 5, 4, 3), 
(85, 5, 5, 3), (86, 5, 6, 3), (87, 5, 7, 3), (88, 5, 8, 3), 
(89, 5, 9, 3), (90, 5, 10, 3), (91, 5, 11, 3), (92, 5, 12, 3), 
(93, 5, 13, 3), (94, 5, 14, 3), (95, 5, 15, 3), (96, 5, 16, 3), 
(97, 5, 17, 3), (98, 5, 18, 3), (99, 5, 19, 3), (100, 5, 20, 3);