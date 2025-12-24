# Stage1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Server/Server.csproj", "Server/"]

RUN dotnet restore "Server.csproj"

COPY . .

RUN dotnet build "Server.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose API ports
EXPOSE 8080
EXPOSE 8081

# Copy publish output
COPY --from=publish /app/publish .

# Entry point để chạy ứng dụng khi container khởi động
ENTRYPOINT ["dotnet", "Server.dll"]