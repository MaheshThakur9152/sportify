MINI PROJECT TITLE


S.E in Information Technology
By
Amol Yadav - 65
Shreyas Panchal - 9
Mahesh Thakur - 59
Dhruv Surti - 52


                                               
Supervisor(s):
Professor
                                                 Vaidehi Agarwal





Department of Information Technology Atharva College of Engineering
Malad West Mumbai University of Mumbai 2025-2026

(For Individual copy)





AET’S
ATHARVA COLLEGE OF ENGINEERING
CERTIFICATE

This is to certify that the S.E mini project entitled “” is a bonafide work of Amol Yadav (65), Shreyas Panchal (9), Mahesh Thakur (59), Dhruv Surti (52) submitted to the University of Mumbai in partial fulfillment of the requirement for S.E. in Information Technology.





 
      

Vaidehi Agarwal	
Supervisor/Guide	External Examiner


College Seal






Dr Bhavna Arora
Dr Ramesh Kulkarni
Internal Examiner
Head of Department



Principal





(For Department copy)




AET’S
ATHARVA COLLEGE OF ENGINEERING
CERTIFICATE

This is to certify that the S.E mini project entitled “” is a bonafide work of Amol Yadav (65), Shreyas Panchal (9), Mahesh Thakur (59), Dhruv Surti (52) submitted to the University of Mumbai in partial fulfillment of the requirement for S.E. in Information Technology.





            
	
Supervisor/Guide	External Examiner
	   Vaidehi Arora

College Seal














Internal Examiner
Head of Department
          Dr Bhavna Arora
Principal
Dr Ramesh Kulkarni



                                                                

Mini Project Report Approval for S.E.

This mini project synopsis entitled  by Vaidehi Agarwal is approved for the partial fulfillment of the requirement of S.E. in Information Technology.



Examiner 1.
2.









Date: Place:

(For Individual copy)
Declaration
We declare that this written submission represents our ideas in our own words and where others’ ideas or words have been included, we have adequately cited and referenced the original sources. We also declare that we have adhered to all principles of academic honesty and integrity and have not misrepresented or fabricated or falsified any idea/data/fact/source in our submission. We understand that any violation of the above will cause disciplinary action by the Institute and can also evoke penal action from the sources which have thus not been properly cited or from whom proper permission has not been taken when needed.


Signature
           Dhruv Surti (52)




Date:


(For Department copy)
Declaration
We declare that this written submission represents our ideas in our own words and where others’ ideas or words have been included, we have adequately cited and referenced the original sources. We also declare that we have adhered to all principles of academic honesty and integrity and have not misrepresented or fabricated or falsified any idea/data/fact/source in our submission. We understand that any violation of the above will cause disciplinary action by the Institute and can also evoke penal action from the sources which have thus not been properly cited or from whom proper permission has not been taken when needed.


Signature
Amol Yadav
                                                                                         
   Signature
Shreyas Panchal
                                                                                               
                                                                                                Signature
Mahesh Thakur
                                                                                                




Date:



Abstract

This mini project presents the development of Sportify, a full-stack e-commerce platform specializing in sports equipment, built using Java with Spring Boot for the backend and Next.js with React for the frontend. The application features secure user authentication via OTP-based email verification, comprehensive product browsing with detailed Nike product listings including shoes, clothing, and accessories, shopping cart management, and order processing. It employs MySQL for database management, JWT for secure session handling, and integrates SendGrid for email notifications. The system is designed with a responsive, user-centric interface using Tailwind CSS, aiming to deliver a seamless and engaging online shopping experience for athletes and sports enthusiasts. The report details the design, implementation, testing, and evaluation of the system, emphasizing its scalability, security, and modern web technologies.

Keywords: E-commerce, Sports Equipment, Spring Boot, React.js, JWT Authentication, OTP Verification, MySQL, Next.js

List of Figures
System Architecture Diagram: Illustrates the interaction between the frontend, backend, and database components.


Database Schema: Depicts the relational structure of the database, including tables for users, products, orders, and payments.


User Interface Screenshots: Showcases the design and layout of key pages such as the homepage, product listing, and checkout process.


Sequence Diagrams: Demonstrates the flow of data and user interactions within the application.



List of Tables
Technology Stack Comparison: Compares the chosen technologies (Java, Spring Boot, React.js) with alternative options, highlighting their advantages.


Feature Implementation Timeline: Details the timeline for implementing core features like user authentication, product management, and payment integration.


Testing Results: Presents the outcomes of various tests conducted to ensure the application's functionality and performance.



List of Abbreviations
API: Application Programming Interface


CRUD: Create, Read, Update, Delete


JWT: JSON Web Token


REST: Representational State Transfer


UI/UX: User Interface/User Experience






Existing System and Proposed System
Existing e-commerce systems often rely on monolithic architectures, leading to challenges in scalability and maintenance. The proposed system adopts a microservices architecture, utilizing Spring Boot for the backend and React.js for the frontend, to enhance modularity and scalability.

Methodology
4.1 Block Diagram
The block diagram illustrates the system's architecture, showing the interaction between the frontend, backend, and database components.
4.2 Technology Used

The project utilizes a modern tech stack to ensure scalability, security, and maintainability.

Backend:

- Programming Language: Java 17
- Framework: Spring Boot 3.2.0
- Security: Spring Security with JWT (JSON Web Tokens) for authentication
- Database: MySQL for production, H2 for testing
- ORM: Spring Data JPA for data persistence
- Email: Spring Mail with SendGrid and Jakarta Mail for notifications
- Validation: Spring Boot Validation
- Build Tool: Maven

Frontend:

- Framework: Next.js 16 with React 19
- Styling: Tailwind CSS
- State Management: React hooks (built-in)
- HTTP Client: Axios for API calls

Other Tools:

- Version Control: Git
- IDE: VS Code
- Containerization: Docker (for deployment)
- Testing: JUnit for backend

This stack was chosen for its robustness, community support, and alignment with industry standards.


4.3 Implementation Plan (Gantt Chart)
The Gantt chart outlines the project timeline, detailing the phases of development, including planning, design, implementation, testing, and deployment.
4.4 Algorithm/Flowchart
Flowcharts depict the logic for key processes such as user registration, product search, and order placement, providing a visual representation of the application's workflow.
4.5 Implementation

The backend was implemented using Spring Boot, following a layered architecture:

- Controller Layer: Handles HTTP requests and responses. Includes AuthController for user authentication with OTP-based signup and signin, CartController for shopping cart operations, OrderController for order management, and UserController for user profile management.

- Service Layer: Contains business logic. AuthService handles OTP generation, verification, and JWT token creation; CartService manages cart items and calculations; OrderService processes orders and updates inventory.

- Repository Layer: Interfaces for data access using Spring Data JPA. UserRepository for user data, CartItemRepository for cart items, OrderRepository for orders.

- Entity Layer: JPA entities representing database tables: User (with fields like id, name, email), CartItem (linking user, product, quantity), Order (with order details, status).

- Security: JwtAuthenticationFilter intercepts requests to validate JWT tokens, SecurityConfig configures CORS, authentication endpoints, and protected routes.

The frontend was built with Next.js, utilizing server-side rendering for improved SEO and performance. Key components include Navbar for navigation, HeroSection for homepage banner, ProductCard for displaying items, ProductGrid for listings, and ProductModal for detailed views. API calls are handled using Axios with proper error handling.

Integration between frontend and backend was achieved through RESTful APIs, with CORS enabled for cross-origin requests from localhost:3000. The application supports user registration via OTP sent to email, secure login with JWT, product browsing with filtering, cart management, and order placement.

Testing was performed using JUnit for backend unit tests, focusing on service methods and repository operations. Manual integration testing ensured end-to-end functionality, including user flows from signup to checkout.
4.6 Pseudo Code

Pseudo code for critical backend functions:

User Signup:
```
Function signup(email, name, password):
    Validate email format and password strength
    If user with email exists:
        Throw exception "User already exists"
    Create new User entity with email, name, hashed password, verified=false
    Generate 6-digit OTP
    Send OTP to email via SendGrid
    Save user to database
    Return "Signup successful! OTP sent to " + email
```

OTP Verification for Signup:
```
Function verifyOtp(email, otp):
    Retrieve user by email
    If user not found or already verified:
        Throw exception
    If OTP matches and not expired:
        Set user.verified = true
        Save user
        Return "Email verified! You can now login."
    Else:
        Throw exception "Invalid OTP"
```

Signin Request OTP:
```
Function requestSignInOtp(email):
    Retrieve user by email
    If user not found or not verified:
        Throw exception
    Generate 6-digit OTP
    Send OTP to email
    Return "OTP sent to " + email
```

Signin Verify OTP:
```
Function verifySignInOtp(email, otp):
    Retrieve user by email
    If OTP matches and not expired:
        Generate JWT token with user email and expiration
        Return token, userId, email, name
    Else:
        Throw exception "Invalid OTP"
```

Add to Cart:
```
Function addToCart(userId, productId, quantity):
    Retrieve user and product
    Check if cart item exists for user and product
    If exists, update quantity
    Else, create new CartItem
    Save to database
    Return updated cart
```

Place Order:
```
Function placeOrder(userId, cartItems):
    Calculate total amount
    Create Order entity with user, items, total, status=PENDING
    Save order
    Clear user's cart
    Send confirmation email
    Return order details
```

Results and Discussion
The application was tested for functionality, performance, and security. Results indicate that the system meets the specified requirements, with fast response times and secure transactions. User feedback suggests a positive experience, with intuitive navigation and responsive design.

Conclusion
The project successfully demonstrates the feasibility of building a full-stack e-commerce application using Java and React.js. It provides a scalable and secure platform that can be further enhanced with additional features such as recommendation systems and advanced analytics.

Future Scope
Future developments could include:
Integration of machine learning for personalized recommendations.


Implementation of a microservices architecture for better scalability.


Addition of multi-language and multi-currency support.


Deployment on cloud






























i

Table of Contents

Chapter
Topic
Page No.


Abstract
i


List of Figures
iii


List of Tables
List of Abbreviations
iv
v
Chapter 1
Introduction
1


1.1 Motivation
3


1.2 Problem Statement
4


1.3 Objectives
5


1.4 Scope
6
Chapter 2
Review of Literature
7
Chapter 3
Existing System and Proposed system
8
Chapter 4
Methodology
9


4.1 Block diagram
10


4.2 Technology Used
11


4.3 Implementation plan (Gantt Chart)
12


4.4 Algorithm/Flowchart
13


4.5 Implementation
15


4.6 Pseudo Code
16
Chapter 5
Results and Discussion (Screenshots of the output with description )
20
Chapter 6
Conclusion
21
Chapter 7
Future Scope
22


References
23



List of Figures



Figure No.
Figure Caption
Page No.
3.1


11
4.1


15
4.2


16
4.3


18
4.4


19
4.5


20
5.1


33


Important Note: Hide the table border before printing.

















iii

List of Tables


Table No.
Table Title
Page No.
3.1


11
3.2


15
3.3


16
3.4


18
3.5


19
4.1


24
4.2


25
4.3


27


Important Note: Hide the table border before printing.

















iv

List of Abbreviations


ACE
Atharva College of Engineering






























Important Note: Hide the table border before printing.
Also, abbreviations need to be added in alphabetical order.











v

Chapter 1
Introduction

In today's digital age, e-commerce has revolutionized the way consumers purchase goods, offering convenience, variety, and accessibility. This mini project presents the development of Sportify, a specialized e-commerce platform dedicated to sports equipment and apparel. The system integrates modern web technologies to provide athletes, fitness enthusiasts, and sports lovers with a seamless online shopping experience, featuring a curated selection of high-quality products from renowned brands like Nike.

The project encompasses both frontend and backend development, utilizing Java with Spring Boot for the server-side logic and Next.js with React for the client-side interface. Key features include secure user authentication via OTP verification, comprehensive product browsing, shopping cart management, and order processing, all supported by a robust database and email integration.

This report details the design, implementation, and evaluation of Sportify, highlighting its technical architecture, development process, and potential for real-world application.





1.1 Motivation

The rapid growth of online shopping, particularly in the sports and fitness industry, has created a demand for platforms that cater specifically to athletes' needs. Traditional e-commerce sites often lack specialized features for sports enthusiasts, such as detailed product specifications, size guides, and brand-specific collections. Additionally, with increasing concerns about online security, there is a need for reliable authentication methods that protect user data while providing a smooth login experience.

This project is motivated by the desire to bridge this gap by creating a dedicated sports e-commerce platform that combines user-friendly design with robust security measures. By focusing on sports equipment, the application aims to serve a niche market that values quality, performance, and authenticity in their purchases.
1.2 Problem Statement

Existing e-commerce platforms, while versatile, often face challenges in providing specialized experiences for niche markets like sports equipment. Issues include:

- Lack of specialized product categorization and filtering for sports items
- Inadequate security measures leading to potential data breaches
- Poor user experience on mobile devices
- Limited integration of modern authentication methods like OTP
- Scalability issues when handling large inventories of sports products

This project addresses these problems by developing a tailored e-commerce solution that prioritizes security, usability, and performance for sports-related purchases.
1.3 Objectives

The primary objectives of this project are:

- To develop a secure and scalable backend using Java and Spring Boot that handles user authentication, product management, and order processing
- To create an intuitive and responsive frontend using Next.js and React that provides an engaging user interface for browsing and purchasing sports equipment
- To implement OTP-based authentication for enhanced security
- To integrate a reliable database system (MySQL) for data persistence
- To ensure the application is optimized for performance and can handle concurrent users
- To provide a comprehensive shopping experience including product search, cart management, and checkout


1.4 Scope

The project scope includes:

- User registration and login with OTP verification
- Product catalog with Nike sports equipment (shoes, clothing, accessories)
- Shopping cart and wishlist functionality
- Order placement and management
- Responsive design for desktop and mobile devices
- Email notifications for user actions
- Basic admin features for product management

Out of scope:

- Payment gateway integration (beyond basic setup)
- Advanced analytics and reporting
- Inventory management system
- Multi-vendor support
- Advanced recommendation algorithms

This focused scope ensures the project delivers a functional and polished e-commerce platform within the given timeframe.





\






CHAPTER 2




Review of Literature
Previous studies and projects have explored various technologies and architectures for building e-commerce platforms. This project builds upon existing knowledge by integrating Java, Spring Boot, and React.js, which are known for their robustness and scalability. The literature review highlights the evolution of e-commerce technologies and the rationale behind choosing the current tech stack.
































1






























3

Problem Statement






Objectives
The objectives are as follows:
To get
To perform
To extract
To perform.
To implement
To show.





Scope






























4

Methodology

This chapter describes in depth how every aspect of the project was done, compiled, or created






























9