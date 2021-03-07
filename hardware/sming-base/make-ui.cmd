cd web-ui\web-ui\
call npm run build
call npm run css-purge
cd ..\..
copy web-ui\web-ui\index.html files\index.html
copy web-ui\web-ui\app.js files\app.js
copy web-ui\web-ui\bs.css files\bs.css
