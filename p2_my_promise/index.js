//测试用例
function fn1(resolve, reject) {
    setTimeout(function() {
        console.log('步骤一：执行');
        resolve('1');
    },5000);
}

function fn2(resolve, reject) {
    setTimeout(function() {
        console.log('步骤二：执行');
        resolve('2');
    },1000);
}

// new Promise2(fn1).then(function(val){
//     console.log(val);
//     return new Promise2(fn2);
// }).then(function(val){
//     console.log(val);
//     return 33;
// }).then(function(val){
//     console.log(val);
// });

function fn3(resolve, reject) {
    console.log('fn3===');
    reject('reject===');//reject会一直传递下去，和原生reject不一样
    // resolve(33);
};
function fn4(resolve, reject) {
    console.log('fn4===');
    resolve(44);
};
new Promise2(fn3).then(res => {
    console.log(res);
    return new Promise2(fn4);
}, err => console.log('111==',err)).then(res => {
    console.log(res);
    return '55';
}, err => console.log('222==',err)).then(res => {
    console.log(res);
    // throw Error('err===');
}, err => console.log('333==',err));