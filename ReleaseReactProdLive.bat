cd CousinPCMS.React
call npm install
call npx vite build --mode production
xcopy /E /I /Y dist ..\reactpublishLive
cd..