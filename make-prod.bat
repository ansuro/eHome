rmdir /Q /S ..\ehome-prod
cd backend
call npm run compile
echo "copying backend"
xcopy /E lib ..\..\ehome-prod\backend\lib\
xcopy /E data ..\..\ehome-prod\backend\data\
xcopy /E config ..\..\ehome-prod\backend\config\
xcopy /E public ..\..\ehome-prod\backend\public\
copy package.json ..\..\ehome-prod\backend\
cd ..\frontend
call npm run build
echo "copying frontend"
xcopy /E build ..\..\ehome-prod\frontend\
cd ..\mobile\meHome
call expo build:web
echo "copying mobile-web"
xcopy /E web-build ..\..\..\ehome-prod\mobile-web\
cd ..\..
