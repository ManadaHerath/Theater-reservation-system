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
('show38', 'movie2', 'theatre2', '2024-06-15 23:30:00', '2024-06-16 01:42:00');

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


