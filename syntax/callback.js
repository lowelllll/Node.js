// callback

var a = function(){
    console.log('A');
}
// 변수 a에 익명함수를 넣음 .
// 함수도 값이 될 수 있음.

function slowFunc(callback){
    callback(); // a();
}

slowFunc(a);

