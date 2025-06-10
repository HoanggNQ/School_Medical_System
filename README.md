# School Medical Management

## Overview
School Medical Management is a web-based application designed to manage medical records and health-related activities for a school environment. The system allows administrators, medical staff, and authorized users to track student health records, manage medical appointments, and generate reports.

- **Backend**: Built with Spring Boot, providing a robust and scalable RESTful API.
- **Database**: PostgreSQL for reliable and efficient data storage.
- **Frontend**: ReactJS for a modern, responsive, and dynamic user interface.

## Features
- Manage student medical profiles (e.g., allergies, medical history, vaccinations).
- Schedule and track medical appointments.
- Generate health reports for students or groups.
- Role-based access control for administrators, medical staff, and teachers.
- Secure user authentication and authorization.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Java**: JDK 21, **Spring Boot** 3.4.5
- **Maven**: 4.0.0
- **Node.js**: 16.x or later (includes npm)
- **PostgreSQL**: 16 or later
- **Git**: For cloning the repository

## Project Structure
```
School_Medical_System/
├── backend/School_Medical_System/      # Spring Boot backend
│   ├── src/                            # Source code
│   ├── pom.xml                         # Maven dependencies
│   ├── mvnw                            # Maven Wrapper
│   ├── application.properties          # Backend configuration
├── frontend/                           # ReactJS frontend
│   ├── src/                            # React source code
│   ├── package.json                    # Node dependencies
│   ├── public/                         # Public assets
├── README.md                           # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/HoangNQstoine/School_Medical_System.git
cd school-medical-system
```

### 2. Backend Setup (Spring Boot)
1. **Navigate to the backend directory**:
   ```bash
   cd backend/School_Medical_System
   ```

2. **Configure PostgreSQL**:
   - Create a database in PostgreSQL:
     ```sql
     CREATE DATABASE school_medical_db;
     ```
   - Update the database configuration in `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/school_medical_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     ```

3. **Run the backend**:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.

### 3. Frontend Setup (ReactJS)
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint**:
   - Update the API base URL in the frontend code (e.g., in `src/config.js` or equivalent) to point to the backend:
     ```javascript
     export const API_URL = 'http://localhost:8080/api';
     ```

4. **Run the frontend**:
   ```bash
   npm start
   ```
   The frontend will start at `http://localhost:3000`.

### 4. Access the Application
- Open your browser and navigate to `http://localhost:3000` to access the frontend.
- The frontend will communicate with the backend API at `http://localhost:8080`.

## Development Guidelines
- **Backend**:
  - Use Spring Boot best practices for REST API development.
  - Follow the repository-service-controller pattern.
  - Ensure proper exception handling and validation.
- **Frontend**:
  - Use functional components and hooks in React.
  - Implement Tailwind CSS for styling (if applicable).
  - Follow a modular structure for components and services.
- **Database**:
  - Use migrations for schema changes (e.g., Flyway or Liquibase).
  - Ensure proper indexing for performance.

## Running Tests
- **Backend Tests**:
  ```bash
  cd backend/School_Medical_System
  ./mvnw test
  ```
- **Frontend Tests**:
  ```bash
  cd frontend
  npm test
  ```

## Line Endings Configuration
To ensure consistent line endings across platforms, the project includes a `.gitattributes` file:
```
/mvnw text eol=lf
*.cmd text eol=crlf
*.java text eol=lf
*.properties text eol=lf
```
Run the following to apply line ending normalization:
```bash
git add --renormalize .
git commit -m "Normalize line endings"
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For issues or questions, please contact [hoangtoc202@gmail.com] or open an issue on GitHub.
