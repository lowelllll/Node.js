// object

// 자바스크립트에서 함수는 값이 될 수 있음.
var f = function(){
    console.log(1);
    console.log(2);
}

var a = [f];
a[0]();

var o = {
    func:f
}
o.func();