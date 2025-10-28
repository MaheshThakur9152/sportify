# Sportify Backend - Spring Boot

Complete Spring Boot backend for the Sportify e-commerce application.

## Architecture

Frontend (Next.js) ↔ Backend (Spring Boot) ↔ Database (MySQL)

## Features

- **User Authentication**: JWT-based authentication with email verification
- **Order Management**: Complete order creation and management system
- **Email Integration**: SMTP email verification using Gmail
- **Security**: Spring Security with CORS configuration
- **Database**: JPA/Hibernate with MySQL

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or Docker for containerized database)

## Docker Setup (Recommended)

For easy development and deployment, use Docker to containerize the MySQL database:

### 1. Start MySQL Database with Docker

**Quick Start (Windows):**
```bash
# Double-click the start-db.bat file or run:
./start-db.bat
```

**Quick Start (Linux/Mac):**
```bash
# Make script executable and run:
chmod +x start-db.sh
./start-db.sh
```

**Manual Docker Commands:**
```bash
# Start MySQL database
docker-compose up -d mysql

# Check if the container is running
docker-compose ps

# View logs
docker-compose logs mysql
```

### 2. Database Configuration

The Docker setup automatically creates:
- Database: `sportify_db`
- User: `sportify_user`
- Password: `sportify_password`

The `application.properties` is already configured to work with the Docker container.

### 3. Stop Database

```bash
# Stop the container
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Full Containerization (Optional)

If you want to containerize the entire application (database + backend), use the full Docker setup:

```bash
# Start both MySQL and Spring Boot application
docker-compose -f docker-compose.full.yml up -d

# Build and start
docker-compose -f docker-compose.full.yml up --build
```

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `sportify_db`:

```sql
CREATE DATABASE sportify_db;
```

Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 2. Email Configuration

Update the email settings in `src/main/resources/application.properties`:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

**Note**: For Gmail, you need to generate an "App Password":
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for this application

### 3. JWT Secret

Update the JWT secret in `src/main/resources/application.properties`:

```properties
jwt.secret=yourSecretKeyHere123456789012345678901234567890
```

Use a strong, random secret key.

### 4. Build and Run

#### Option A: With Docker Database (Recommended)

```bash
# Start MySQL database
docker-compose up -d mysql

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

#### Option B: With Local MySQL

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify?token=xxx` - Email verification

### Orders

- `POST /api/orders/create` - Create new order (requires JWT)
- `GET /api/orders/my-orders` - Get user's orders (requires JWT)

## Project Structure

```
sportify-backend/
├── src/main/java/com/sportify/
│   ├── SportifyApplication.java
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── OrderController.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   └── ShippingAddress.java
│   ├── model/
│   │   ├── SignupRequest.java
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── OrderRequest.java
│   │   └── MessageResponse.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── OrderRepository.java
│   └── service/
│       ├── AuthService.java
│       ├── OrderService.java
│       ├── EmailService.java
│       └── JwtUtil.java
└── src/main/resources/
    └── application.properties
```

## Frontend Integration

The backend is designed to work with the Next.js frontend. Here's how to integrate:

### API Service (lib/api.js)

```javascript
const API_URL = 'http://localhost:8080/api';

export const signup = async (email, password, name) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

## Security Features

- JWT token-based authentication
- Password hashing with BCrypt
- Email verification for account activation
- CORS configuration for frontend integration
- Stateless session management

## Database Schema

The application uses JPA/Hibernate to automatically create the following tables:

- `users` - User accounts
- `orders` - Order records
- `order_items` - Individual order items

## Testing

Run tests with:

```bash
mvn test
```

## Deployment

For production deployment:

1. Update CORS origins in `SecurityConfig.java`
2. Configure production database settings
3. Set up proper email service
4. Use environment variables for sensitive data
5. Configure SSL/TLS

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Ensure MySQL is running and credentials are correct
2. **Email Not Sending**: Check Gmail app password and SMTP settings
3. **CORS Errors**: Verify frontend URL is in allowed origins
4. **JWT Token Issues**: Ensure secret key is properly configured

### Logs

Check application logs for detailed error information:

```bash
# With Maven
mvn spring-boot:run

# Or check logs in target/ directory after build
```