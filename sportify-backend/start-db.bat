@echo off
echo Starting Sportify MySQL Database with Docker...
docker-compose up -d mysql
echo.
echo Waiting for MySQL to be ready...
timeout /t 10 /nobreak > nul
echo.
echo MySQL should now be running on localhost:3306
echo Database: sportify_db
echo User: sportify_user
echo Password: sportify_password
echo.
echo To stop the database, run: docker-compose down
echo To view logs: docker-compose logs mysql
pause