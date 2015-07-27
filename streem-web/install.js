require('shelljs/global');

cd('src/static/');
exec('npm install');
cd('../visualizer/');
exec('npm install');
exec('bower install');




