//测试用例
function myLog(_Promise, ...msg) {
    let outputContainer = null, mark = null;
    if (_Promise === Promise) {
        outputContainer = document.getElementById('res_native_pro');
        mark = 'nativePro';
    } else {
        outputContainer = document.getElementById('res_my_pro');
        mark = 'myPro';
    };
    let elem = document.createElement('p');
    elem.innerText = msg.join(' ');
    outputContainer.appendChild(elem);
};
function createBtns(testCount = 100) {
    let container = document.getElementById('operation_btns');
    for (let i = 0; i < testCount; i++) {
        if (typeof window[`test${i}`] === 'undefined') return;

        let elem = document.createElement("input");
        elem.type = 'button';
        elem.onclick = function() {//同时运行
            let nativeProInfo = document.getElementById('native_pro_test_info'),
                myproInfo = document.getElementById('my_pro_test_info'),
                nativeProOutput = document.getElementById('res_native_pro'),
                myProOutput = document.getElementById('res_my_pro'),
                testInfo = window[`test${i}`].info;
            nativeProInfo.innerText = `【${testInfo}】的结果：`;
            myproInfo.innerText = `【${testInfo}】的结果：`;
            nativeProOutput.innerHTML = '';
            myProOutput.innerHTML = '';
            window[`test${i}`](MyPromise, i);
            window[`test${i}`](Promise, i);
        };
        elem.value = window[`test${i}`].info;
        container.appendChild(elem);
    };
};
window.onload = () => {
    //改写系统日志打印
    window.console.mylog = function(...msg) {
        myLog(...msg);
    };
    createBtns();
};

//同步测试--resolve
test0.info = '0 同步测试--resolve';
function test0(_Promise) {
    function fn1(resolve, reject) {
        console.mylog(_Promise, 'fn1执行');
        resolve(1);
    };
    new _Promise(fn1).then((val) => {
        console.mylog(_Promise, val);
    });
};

//异步测试--resolve
test1.info = '1 异步测试--resolve';
function test1(_Promise) {
    function fn1(resolve, reject) {
        setTimeout(function() {
            console.mylog(_Promise, 'fn1执行');
            resolve(1);
        },2000);
    };
    new _Promise(fn1).then((val) => {
        console.mylog(_Promise, val);
    });
};

//异步测试--reject
test2.info = '2 异步测试--reject';
function test2(_Promise) {
    function fn2(resolve, reject) {
        setTimeout(function() {
            console.mylog(_Promise, 'fn2执行');
            reject(2);
        },1000);
    };
    new _Promise(fn2).then((val) => {
        console.mylog(_Promise, val);
    }, err => {
        console.mylog(_Promise, 'rejected', err);
    });
};

//同步写法测试
test3.info = '3 同步写法测试';
function test3(_Promise) {
    function fn1(resolve, reject) {
        setTimeout(function() {
            console.mylog(_Promise, 'fn1执行');
            resolve(1);
        },2000);
    };
    function fn2(resolve, reject) {
        setTimeout(function() {
            console.mylog(_Promise, 'fn2执行');
            resolve(2);
        },1000);
    };
    new _Promise(fn1).then(val => {
        console.mylog(_Promise, val);
        return new _Promise(fn2);
    }).then(val => {
        console.mylog(_Promise, val);
    });
};

//链式调用--resolve
test4.info = '4 链式调用--resolve';
function test4(_Promise) {
    function fn3(resolve, reject) {
        console.mylog(_Promise, 'fn3===');
        resolve(33);
    };
    function fn4(resolve, reject) {
        console.mylog(_Promise, 'fn4===');
        resolve(44);
    };
    new _Promise(fn3).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn4);
    }).then(res => {
        console.mylog(_Promise, res);
        return 55;
    }).then(res => {
        console.mylog(_Promise, res);
    });
};

//链式调用--reject
test5.info = '5 链式调用--reject';
function test5(_Promise) {
    function fn3(resolve, reject) {
        console.mylog(_Promise, 'fn3===');
        reject('reject at fn3');
    };
    function fn4(resolve, reject) {
        console.mylog(_Promise, 'fn4===');
        resolve(44);
    };
    new _Promise(fn3).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn4);
    }, err => console.mylog(_Promise, 'then1==',err)).then(res => {
        console.mylog(_Promise, res);
        return '55';
    }, err => console.mylog(_Promise, 'then2==',err)).then(res => {
        console.mylog(_Promise, res);
    }, err => console.mylog(_Promise, 'then3==',err));
};

//all方法
test6.info = '6 all方法';
function test6(_Promise) {
    //随机调用resolve或reject
    function fn5(resolve, reject) {
        setTimeout(() => {
            console.mylog(_Promise, 'fn5执行');
            let randNum = Math.random();
            console.mylog(_Promise, randNum);
            if (randNum > 0.5) {
                resolve('resovle==大于0.5');
            } else {
                reject('reject==少于0.5');
            };
        }, 2000);
    };
    function fn6(resolve, reject) {
        setTimeout(() => {
            console.mylog(_Promise, 'fn6执行');
            resolve(6);
        }, 1000);
    };
    let p5 = new _Promise(fn5),
        p6 = new _Promise(fn6);
    _Promise.all([p5, p6]).then(res => {
        console.mylog(_Promise, res);
    }, err => {
        console.mylog(_Promise, err);
    });
}

//catch测试
test7.info = '7 catch测试';
function test7(_Promise) {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.mylog(_Promise, 'fn7执行');
            reject('rejeted');
        }, 1000);
    };
    new _Promise(fn7).then(res => {
        console.mylog(_Promise, res);
    }).catch(err => {
        console.mylog(_Promise, 'catch==', err);
    });
}
//catch测试——链式调用reject状态的catch（冒泡）
test8.info = '8 catch测试——reject冒泡';
function test8(_Promise) {
    function fn7(resolve, reject) {
        console.mylog(_Promise, 'fn7执行');
        reject('reject at fn7');
    };
    function fn8(resolve, reject) {
        console.mylog(_Promise, 'fn8执行');
        resolve(88);
    };
    new _Promise(fn7).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn8);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}
//上例异步
test9.info = '9 catch测试——异步reject冒泡';
function test9(_Promise) {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.mylog(_Promise, 'fn7执行');
            reject('reject at fn7');
        }, 1000);
    };
    function fn8(resolve, reject) {
        console.mylog(_Promise, 'fn8执行');
        resolve(88);
    };
    new _Promise(fn7).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn8);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}
//reject冒泡
test10.info = '10 reject冒泡';
function test10(_Promise) {
    function fn7(resolve, reject) {
        setTimeout(() => {
            console.mylog(_Promise, 'fn7执行');
            reject('reject at fn7');
        }, 1000);
    };
    function fn8(resolve, reject) {
        console.mylog(_Promise, 'fn8执行');
        resolve(88);
    };
    new _Promise(fn7).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn8);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }, err => {
        console.mylog(_Promise, 'then2==',err);
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}

//catch测试——代码错误捕获
test11.info = '11 catch测试——代码错误捕获';
function test11(_Promise) {
    function fn9(resolve, reject) {
        throw new Error('err@fn9');
        resolve(99);
    };
    function fn10(resolve, reject) {
        console.mylog(_Promise, 'fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn10);
    }, err => {
        console.mylog(_Promise, 'then1==',err);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }, err => {
        console.mylog(_Promise, 'then2==',err);
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}

//catch测试——代码错误捕获（异步）
test12.info = '12 catch测试——代码错误捕获（异步）';
function test12(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            throw new Error('err@fn9');
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.mylog(_Promise, 'fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.mylog(_Promise, res);
        return new _Promise(fn10);
    }, err => {
        console.mylog(_Promise, 'then1==',err);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }, err => {
        console.mylog(_Promise, 'then2==',err);
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}

//catch测试——then代码错误捕获
test13.info = '13 catch测试——then回调代码错误捕获';
function test13(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.mylog(_Promise, 'fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.mylog(_Promise, res);
        throw new Error('err@fn9');
        return new _Promise(fn10);
    }, err => {
        console.mylog(_Promise, 'then1==',err);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }, err => {
        console.mylog(_Promise, 'then2==',err);
    }).then(res => {
        console.mylog(_Promise, res);
        return 1111;
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}

//catch测试——代码错误catch捕获——提示会更加详细
test14.info = '14 catch测试——代码错误catch捕获';
function test14(_Promise) {
    function fn9(resolve, reject) {
        setTimeout(() => {
            resolve(99);
        }, 1000);
    };
    function fn10(resolve, reject) {
        console.mylog(_Promise, 'fn10执行');
        resolve(1010);
    };
    new _Promise(fn9).then(res => {
        console.mylog(_Promise, res);
        throw new Error('err@fn9');
        return new _Promise(fn10);
    }).then(res => {
        console.mylog(_Promise, res);
        return 99;
    }).then(res => {
        console.mylog(_Promise, res);
        return 1111;
    }).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    });
}


//finally测试——正常状态
test15.info = '15 finally测试——正常';
function test15(_Promise) {
    function fn11(resolve, reject) {
        setTimeout(() => {
            resolve(1111);
        }, 1000);
    };
    new _Promise(fn11).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//finally测试——异步代码错误
test16.info = '16 finally测试——异步代码错误';
function test16(_Promise) {
    function fn11(resolve, reject) {
        setTimeout(() => {
            throw new Error('err@fn11');
            resolve(1111);
        }, 1000);
    };
    new _Promise(fn11).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//finally测试——同步代码错误
test17.info = '17 finally测试——同步代码错误';
function test17(_Promise) {
    function fn11(resolve, reject) {
        throw new Error('err@fn11');
        resolve(1111);
    };
    new _Promise(fn11).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——是MyPromise对象
test18.info = '18 resolve方法测试——是MyPromise对象';
function test18(_Promise) {
    function fn12(resolve, reject) {
        console.mylog(_Promise, 'fn12执行');
        resolve(1212);
    };
    _Promise.resolve(new _Promise(fn12)).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——是一个thenable对象（resolve）
test19.info = '19 resolve方法测试——是一个thenable对象（resolve）';
function test19(_Promise) {
    let thenable = {
        then: function(resolve, reject) {
            resolve('thenable resolved!');
        }
    };
    _Promise.resolve(thenable).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——是一个thenable对象（reject）
test20.info = '20 resolve方法测试——是一个thenable对象（reject）';
function test20(_Promise) {
    let thenable = {
        then: function(resolve, reject) {
            reject('thenable rejectd!');
        }
    };
    _Promise.resolve(thenable).then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——参数不是具有then方法的对象，或根本就不是对象
test21.info = '21 resolve方法测试——不具有then方法';
function test21(_Promise) {
    _Promise.resolve('Have no then func').then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——无参数
test22.info = '22 resolve方法测试——无参数';
function test22(_Promise) {
    let p = _Promise.resolve();
    // console.mylog(_Promise, '新Promise对象==', p);
    p.then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——参数是null
test23.info = '23 resolve方法测试——参数是null';
function test23(_Promise) {
    let p = _Promise.resolve(null);
    // console.mylog(_Promise, '新Promise对象==', p);
    p.then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//resolve方法测试——参数是空字符串
test24.info = '24 resolve方法测试——参数是空字符串';
function test24(_Promise) {
    let p = _Promise.resolve('');
    // console.mylog(_Promise, '新Promise对象==', p);
    p.then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//reject方法测试
test25.info = '25 reject方法测试';
function test25(_Promise) {
    let p = _Promise.reject('reject方法');
    p.then(res => {
        console.mylog(_Promise, res);
    }).catch( err => {
        console.mylog(_Promise, 'catch==', err);
    }).finally(() => {
        console.mylog(_Promise, 'finally func!')
    });
}

//race方法测试
test26.info = '26 race方法测试';
function test26(_Promise) {
    function fn5(resolve, reject) {
        setTimeout(() => {
            let randNum = Math.random();
            console.mylog(_Promise, 'fn5延迟2秒执行');
            if (randNum > 0.5) {
                resolve('fn5 resovle==大于0.5');
            } else {
                reject('fn5 reject==少于0.5');
            };
        }, 2000);
    };
    function fn6(resolve, reject) {
        setTimeout(() => {
            let randNum = Math.random();
            console.mylog(_Promise, 'fn6延迟1秒执行');
            if (randNum > 0.5) {
                resolve('fn6 resovle==大于0.5');
            } else {
                reject('fn6 reject==少于0.5');
            };
        }, 1000);
    };
    let p5 = new _Promise(fn5),
        p6 = new _Promise(fn6);
    _Promise.race([p5, p6]).then(res => {
        console.mylog(_Promise, res);
    }, err => {
        console.mylog(_Promise, err);
    });
}

//Promise状态多次改变
test27.info = '27 Promise状态多次改变';
function test27(_Promise) {
    function fn13(resolve, reject) {
        let count = 1,
            stopId = setInterval(() => {
                let isEven = count % 2 === 0;//是否偶数 偶数resolve，基数reject
                if (isEven) {
                    resolve(`resolve===${count}`);
                } else {
                    reject(`reject===${count}`);
                };
                count++;
                if (count > 5) clearInterval(stopId);
            }, 1000);
    };
    new _Promise(fn13).then(res => {
        console.mylog(_Promise, res);
    }, err => {
        console.mylog(_Promise, err);
    });
}

//then回调返回Promise对象
test28.info = '28 then回调返回Promise对象（reject）';
function test28(_Promise) {
    function fn1(resolve, reject) {
        resolve(1);
    };
    function fn2(resolve, reject) {
        reject(2);
    };
    new _Promise(fn1).then(val => {
        console.mylog(_Promise, 'res1==', val);
        return new _Promise(fn2);
    }, err => {
        console.mylog(_Promise, 'err1==',err);
    }).then(val => {
        console.mylog(_Promise, 'res2==', val);
        return 33;
    }, err => {
        console.mylog(_Promise, 'err2==', err);
        return 44;
    }).then((val) => {
        console.mylog(_Promise, 'res3==', val);
    }, err => {
        console.mylog(_Promise, 'err3==', err);
    }).catch(err => {
        console.mylog(_Promise, 'catch==', err);
    });
}

//then方法reject回调返回Promise对象
test29.info = '29 then方法reject回调返回Promise对象';
function test29(_Promise) {
    function fn1(resolve, reject) {
        reject(1);
    };
    function fn2(resolve, reject) {
        reject(2);
    };
    new _Promise(fn1).then(val => {
        console.mylog(_Promise, 'res1==', val);
    }, err => {
        console.mylog(_Promise, 'err1==',err);
        return new _Promise(fn2);
    }).then(val => {
        console.mylog(_Promise, 'res2==', val);
        return 33;
    }, err => {
        console.mylog(_Promise, 'err2==', err);
        return 44;
    }).then((val) => {
        console.mylog(_Promise, 'res3==', val);
    }, err => {
        console.mylog(_Promise, 'err3==', err);
    }).catch(err => {
        console.mylog(_Promise, 'catch==', err);
    });
}