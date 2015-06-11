require('shelljs/global');
var Q = require('q');

var installStatic = function(){
    var deferred = Q.defer();
    exec('cd src/static/; npm install', function(code, output) {
        console.log('Exit code:', code);
        console.log('Static module:', output);
        deferred.resolve();
    });
    return deferred.promise;
}

var installVisualizer = function(){
    var deferred = Q.defer();
    exec('cd src/visualizer/; npm install', function(code, output) {
        console.log('Exit code:', code);
        console.log('Static module:', output);
        deferred.resolve();
    });
    return deferred.promise;
}

var installSubmodules = function(){
    var deferred = Q.defer();
    Q.all([installVisualizer(), installStatic()]).then(function(){
        deferred.resolve();
    });
    return deferred.promise;
}

installSubmodules().then(function(){

});




