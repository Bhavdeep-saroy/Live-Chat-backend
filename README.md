# Live Chat Application Backend


This is the backend of a Live Chat Application built using Node.js. The backend leverages various tools and libraries to ensure robust functionality, high performance, and user security. Below is an overview of the key technologies and features implemented in this project:

## Key Features and Tools Used

Real-Time Communication:
* Used Socket.IO for real-time, bidirectional communication between users in the chat application.

Authentication:
* Implemented JWT (JSON Web Token) for secure user authentication.
* Passwords are securely hashed using the bcrypt library to enhance security.

Input Validation:
* Integrated Joi for server-side input validation to ensure data integrity.

Email Functionality:
* Integrated NodeMailer to send emails to users and used it to send OTPs (One-Time Passwords) for verifying user email addresses during account creation.

API Design:
* Developed clean and asynchronous APIs for smooth and efficient operations, adhering to modern backend development practices.

Why These Tools Were Chosen:
* Socket.IO ensures seamless real-time chat functionality.
* JWT and bcrypt enhance user security by providing secure authentication and password management.
* Joi guarantees that data entering the system meets the required format and standards.
* NodeMailer allows for effective user verification, improving user trust and engagement.
