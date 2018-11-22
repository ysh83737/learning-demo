//测试用例

//异步测试--resolve
function test1() {
    function fn1(resolve, reject) {
        setTimeout(function() {
            console.log('fn1执行');
            resolve(1);
        },2000);
    };
    new MyPromise(fn1).then((val) => {
        console.log(val);
    });
};

//异步测试--reject
function test2() {
    function fn2(resolve, reject) {
        setTimeout(function() {
            console.log('fn2执行');
            reject(2);
        },1000);
    };
    new MyPromise(fn2).then((val) => {
        console.log(val);
    }, err => {
        console.log('rejected', err);
    });
};

//同步写法测试
function test3() {
    function fn1(resolve, reject) {
        setTimeout(function() {
            console.log('fn1执行');
            resolve(1);
        },2000);
    };
    function fn2(resolve, reject) {
        setTimeout(function() {
            console.log('fn2执行');
            resolve(2);
        },1000);
    };
    new MyPromise(fn1).then(val => {
        console.log(val);
        return new MyPromise(fn2);
    }).then(val => {
        console.log(val);
    });
};

//链式调用--resolve
function test4() {
    function fn3(resolve, reject) {
        console.log('fn3===');
        resolve(33);
    };
    function fn4(resolve, reject) {
        console.log('fn4===');
        resolve(44);
    };
    new MyPromise(fn3).then(res => {
        console.log(res);
        return new MyPromise(fn4);
    }).then(res => {
        console.log(res);
        return 55;
    }).then(res => {
        console.log(res);
    });
};

//链式调用--reject
function test5() {
    function fn3(resolve, reject) {
        console.log('fn3===');
        reject('reject at fn3');
    };
    function fn4(resolve, reject) {
        console.log('fn4===');
        resolve(44);
    };
    new MyPromise(fn3).then(res => {
        console.log(res);
        return new MyPromise(fn4);
    }, err => console.log('then1==',err)).then(res => {
        console.log(res);
        return '55';
    }, err => console.log('then2==',err)).then(res => {
        console.log(res);
    }, err => console.log('then3==',err));
};

//all方法
function test6() {
    //随机调用resolve或reject
    function fn5(resolve, reject) {
        setTimeout(() => {
            console.log('fn5执行');
            let randNum = Math.random();
            console.log(randNum);
            if (randNum > 0.5) {
                resolve('大于0.5');
            } else {
                reject('少于0.5');
            };
        }, 2000);
    };
    function fn6(resolve, reject) {
        setTimeout(() => {
            console.log('fn6执行');
            resolve(6);
        }, 1000);
    };
    let p5 = new MyPromise(fn5),
        p6 = new MyPromise(fn6);
    MyPromise.all([p5, p6]).then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    });
}

//catch测试
function test7() {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.log('fn7执行');
            reject('rejeted');
        }, 1000);
    };
    new MyPromise(fn7).then(res => {
        console.log(res);
    }).catch(err => {
        console.log('catch==', err);
    });
}
//catch测试——链式调用reject状态的catch（冒泡）
function test8() {
    function fn7(resolve, reject) {
        console.log('fn7执行');
        reject('reject at fn7');
        // setTimeout(() => {
        //     console.log('fn7执行');
        //     reject('reject at fn7');
        // }, 1000);
    };
    function fn8(resolve, reject) {
        console.log('fn8执行');
        resolve(88);
    };
    new MyPromise(fn7).then(res => {
        console.log(res);
        return new MyPromise(fn8);
    }, err => {
        console.log('then1==', err);
    }).then(res => {
        console.log(res);
        return 99;
    }, err => {
        console.log('then2==',err);
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}
//上例异步
function test9() {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.log('fn7执行');
            reject('reject at fn7');
        }, 1000);
    };
    function fn8(resolve, reject) {
        console.log('fn8执行');
        resolve(88);
    };
    new MyPromise(fn7).then(res => {
        console.log(res);
        return new MyPromise(fn8);
    }, err => {
        console.log('then1==', err);
    }).then(res => {
        console.log(res);
        return 99;
    }, err => {
        console.log('then2==',err);
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}