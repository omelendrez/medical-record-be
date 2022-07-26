@echo off
set file_name=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%_heroku_b3627cd1b200890_PRODUCTION.sql

echo %file_name%

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" -u %VMR_USER% --routines --column-statistics=0 --no-create-db -h us-cdbr-east-06.cleardb.net --password=%VMR_PASSWORD% heroku_b3627cd1b200890 > %file_name%

pause
