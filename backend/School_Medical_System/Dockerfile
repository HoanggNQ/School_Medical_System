FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /schoolmedicalsystem
COPY . .
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jdk-jammy AS deloy
WORKDIR /schoolmedicalsystem
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "schoolmedicalsystem.jar"]
