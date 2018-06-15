// object

var members = ['egoing', 'leeyejin', 'lowell']; // array

var i = 0;
while(i<members.length){
    console.log('arr loop',members[i]);
    i+=1;
}

var roles = { // object
    'programer':'leeyejin',
    'designer':'lowell2735',
}

for (var name in roles){
    console.log(`object => ${name} , value => ${roles[name]}`);
}