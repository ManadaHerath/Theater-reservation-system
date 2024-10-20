

Project Overview
The Movie Theater Reservation System is a web application that allows users to browse movies, select theaters, book tickets, and manage their reservations. It features user authentication, seat selection, payment integration, and an admin panel for managing movie schedules. The backend is powered by Node.js/Express, while MySQL (deployed on AWS RDS Free Tier) serves as the database.

Features

User Authentication: Users can register, log in, and manage their profiles.

Movie Browsing: Browse current and upcoming movies with detailed information.

Theater and Showtime Selection: View available theaters and showtimes by location.

Seat Reservation: Select and reserve specific seats for a chosen showtime.

Payment Integration: Make payments using Stripe for secure transactions.

Booking Management: View and cancel bookings from a personal dashboard.

Admin Panel: Admins can manage movies, theaters, showtimes, and bookings.



Technologies Used

Frontend: React, Material UI, Tailwind CSS
Backend: Node.js, Express.js
Database: MySQL (hosted on AWS RDS Free Tier)
Payment Gateway: Stripe
Testing: Jest, JMeter


Getting Started
To clone the project and set up the development environment, follow these steps.

Prerequisites
Make sure you have the following installed:

Node.js (v14 or higher)
MySQL (v8 or higher)
AWS CLI (if using AWS RDS)
Stripe Account
Firebase Account


Installation
Clone the repository:
bash
Copy code
git clone https://github.com/ManadaHerath/Theater-reservation-system.git
cd Theater-reservation-system
Install dependencies:
bash
Copy code
npm install

Start the server:
npm start

Contributors
Sithika Guruge
Manada Herath
Pramod Hasaranga
