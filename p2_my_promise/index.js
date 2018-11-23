//测试用例
function renderBtns(testCount) {
    let myDiv = document.getElementById('my-promise'),
        es6Div = document.getElementById('es6-promise');
    //我的Promise
    for (let i=1; i<=testCount; i++) {
        let elem = document.createElement("input");
        elem.type = 'button';
        elem.onclick = window[`test${i}`].bind(null, MyPromise);
        elem.value = window[`test${i}`].info;
        myDiv.appendChild(elem);
    };
    //原生Promise
    for (let i=1; i<=testCount; i++) {
        let elem = document.createElement("input");
        elem.type = 'button';
        elem.onclick = window[`test${i}`].bind(null, Promise);
        elem.value = window[`test${i}`].info;
        es6Div.appendChild(elem);
    };
};
window.onload = () => { renderBtns(14) };


//异步测试--resolve
test1.info = '异步测试--resolve';
function test1(_Promise) {
    function fn1(resolve, reject) {
        setTimeout(function() {
            console.log('fn1执行');
            resolve(1);
        },2000);
    };
    new _Promise(fn1).then((val) => {
        console.log(val);
    });
};

//异步测试--reject
test2.info = '异步测试--reject';
function test2(_Promise) {
    function fn2(resolve, reject) {
        setTimeout(function() {
            console.log('fn2执行');
            reject(2);
        },1000);
    };
    new _Promise(fn2).then((val) => {
        console.log(val);
    }, err => {
        console.log('rejected', err);
    });
};

//同步写法测试
test3.info = '同步写法测试';
function test3(_Promise) {
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
    new _Promise(fn1).then(val => {
        console.log(val);
        return new _Promise(fn2);
    }).then(val => {
        console.log(val);
    });
};

//链式调用--resolve
test4.info = '链式调用--resolve';
function test4(_Promise) {
    function fn3(resolve, reject) {
        console.log('fn3===');
        resolve(33);
    };
    function fn4(resolve, reject) {
        console.log('fn4===');
        resolve(44);
    };
    new _Promise(fn3).then(res => {
        console.log(res);
        return new _Promise(fn4);
    }).then(res => {
        console.log(res);
        return 55;
    }).then(res => {
        console.log(res);
    });
};

//链式调用--reject
test5.info = '链式调用--reject';
function test5(_Promise) {
    function fn3(resolve, reject) {
        console.log('fn3===');
        reject('reject at fn3');
    };
    function fn4(resolve, reject) {
        console.log('fn4===');
        resolve(44);
    };
    new _Promise(fn3).then(res => {
        console.log(res);
        return new _Promise(fn4);
    }, err => console.log('then1==',err)).then(res => {
        console.log(res);
        return '55';
    }, err => console.log('then2==',err)).then(res => {
        console.log(res);
    }, err => console.log('then3==',err));
};

//all方法
test6.info = 'all方法';
function test6(_Promise) {
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
    let p5 = new _Promise(fn5),
        p6 = new _Promise(fn6);
    _Promise.all([p5, p6]).then(res => {
        console.log(res);
    }, err => {
        console.log(err);
    });
}

//catch测试
test7.info = 'catch测试';
function test7(_Promise) {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.log('fn7执行');
            reject('rejeted');
        }, 1000);
    };
    new _Promise(fn7).then(res => {
        console.log(res);
    }).catch(err => {
        console.log('catch==', err);
    });
}
//catch测试——链式调用reject状态的catch（冒泡）
test8.info = 'catch测试——reject冒泡';
function test8(_Promise) {
    function fn7(resolve, reject) {
        console.log('fn7执行');
        reject('reject at fn7');
    };
    function fn8(resolve, reject) {
        console.log('fn8执行');
        resolve(88);
    };
    new _Promise(fn7).then(res => {
        console.log(res);
        return new _Promise(fn8);
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
function test9(_Promise) {
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
    new _Promise(fn7).then(res => {
        console.log(res);
        return new _Promise(fn8);
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
function test10(_Promise) {
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
    new _Promise(fn7).then(res => {
        console.log(res);
        return new _Promise(fn8);
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

//catch测试——代码错误捕获
test11.info = 'catch测试——代码错误捕获';
function test11(_Promise) {
    function fn9(resolve, reject) {
        throw new Error('err@fn9');
        resolve(99);
    };
    function fn10(resolve, reject) {
        console.log('fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.log(res);
        return new _Promise(fn10);
    }, err => {
        console.log('then1==',err);
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

//catch测试——代码错误捕获（异步）
test12.info = 'catch测试——代码错误捕获（异步）';
function test12(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            throw new Error('err@fn9');
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.log('fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.log(res);
        return new _Promise(fn10);
    }, err => {
        console.log('then1==',err);
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

//catch测试——then代码错误捕获
test13.info = 'catch测试——then回调代码错误捕获';
function test13(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.log('fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.log(res);
        throw new Error('err@fn9');
        return new _Promise(fn10);
    }, err => {
        console.log('then1==',err);
    }).then(res => {
        console.log(res);
        return 99;
    }, err => {
        console.log('then2==',err);
    }).then(res => {
        console.log(res);
        return 1111;
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}

//catch测试——代码错误catch捕获——提示会更加详细
test14.info = 'catch测试——代码错误catch捕获';
function test14(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.log('fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.log(res);
        throw new Error('err@fn9');
        return new _Promise(fn10);
    }).then(res => {
        console.log(res);
        return 99;
    }).then(res => {
        console.log(res);
        return 1111;
    }).then(res => {
        console.log(res);
    }).catch( err => {
        console.log('catch==', err);
    });
}