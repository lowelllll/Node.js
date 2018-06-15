// Sync vs ASync
var fs = require('fs');

// readFileSync (동기)

console.log('A');
var result = fs.readFileSync('syntax/sync_sample.txt','utf-8');
console.log(result);
console.log('C'); 
// A B C


// readFile (비동기)

console.log('A');
fs.readFile('syntax/sync_sample.txt','utf-8', function(err, result){
    console.log(result);
});
console.log('C');
// A C B