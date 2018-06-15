// module

var M = {
    v:'v',
    f:function(){
        console.log(this.v);
    }
}

module.exports = M;
// 객체 M을 다른 파일에서도 사용할 수 있도록 exports 하겠다
