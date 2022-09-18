cd ./front
rmdir /q /s node_modules
call npm install --package-lock=false --audit=false --fund=false
cd ../
node build.js