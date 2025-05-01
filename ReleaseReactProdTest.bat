cd CousinPCMS.React
call npm install
call npx vite build --mode prodtest
xcopy /E /I /Y dist ..\reactpublishDev
cd..