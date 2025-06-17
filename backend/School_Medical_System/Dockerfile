# Giai đoạn 1: Build ứng dụng với Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng, bỏ qua test để build nhanh
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image nhẹ để chạy
FROM eclipse-temurin:17-jdk-jammy

# Tạo thư mục chứa app
WORKDIR /app

# Copy file jar từ stage build
COPY --from=builder /app/target/*.jar app.jar

# Mở port ứng dụng
EXPOSE 8080

# Khởi động ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
