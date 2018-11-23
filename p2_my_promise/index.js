//测试用例
function renderBtns(testCount) {
    let oDiv = document.getElementById('app');
    for (let i=1; i<=testCount; i++) {
        let elem = document.createElement("input");
        elem.type = 'button';
        elem.onclick = window[`test${i}`];
        elem.value = window[`test${i}`].info;
        oDiv.appendChild(elem);
    };
};
window.onload = () => { renderBtns(10) };


//异步测试--resolve
test1.info = '异步测试--resolve';
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
test2.info = '异步测试--reject';
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
test3.info = '同步写法测试';
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
test4.info = '链式调用--resolve';
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
test5.info = '链式调用--reject';
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
test6.info = 'all方法';
function test6() {
    //随机调用resolve或reject
    function fn5(resolve, reject) {
        setTimeout(() => {
            console.log('fn5执行');
            let randNum = Math.random();
            console.log(randNum);
            if (randNum > 0.5) {
                resolve('resovle==大于0.5');
            } else {
                reject('reject==少于0.5');
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
test7.info = 'catch测试';
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
test8.info = 'catch测试——reject冒泡';
function test8() {
    function fn7(resolve, reject) {
        console.log('fn7执行');
        reject('reject at fn7');
    };
    function fn8(resolve, reject) {
        console.log('fn8执行');
        resolve(88);
    };
    new MyPromise(fn7).then(res => {
        console.log(res);
        return new MyPromise(fn8);
    }).then(res => {
        console.log(res);
        return 99;
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}
//上例异步
test9.info = 'catch测试——异步reject冒泡';
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
    }).then(res => {
        console.log(res);
        return 99;
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}
//reject冒泡
test10.info = 'reject冒泡';
function test10() {
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