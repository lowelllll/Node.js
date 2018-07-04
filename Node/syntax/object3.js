// oop

var o = {
    v1:'v1',
    v2:'v2',
    f1:function(){ // 그룹핑
        console.log(this.v1);
    } ,
    f2:function(){
        console.log(this.v2);
    }
}


o.f1();
o.f2();

// 객체는 값을 저장하는 그릇
// 함수는 그룹
