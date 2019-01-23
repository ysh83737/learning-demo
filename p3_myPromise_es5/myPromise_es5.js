const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(callback) {
    this.status = PENDING; //储存状态
    this.__succ__res = null; //储存resolve结果
    this.__err__res = null; //储存reject结果
    this.__queue = []; //事件队列

    var _this = this;
    function resolver(res) {
        setTimeout(() => {
            if (_this.status === PENDING) {
                _this.status = FULFILLED;
                _this.__succ__res = res;
                _this.__queue.forEach(item => {
                    item.resolve(res);
                });
            };            
        }, 0);
    };
    function rejecter(rej) {
        setTimeout(() => {
            if (_this.status === PENDING) {
                _this.status = REJECTED;
                _this.__err__res = rej;
                _this.__queue.forEach(item => {
                    item.reject(rej);
                });
            };            
        }, 0);
    };
    try {
        callback(resolver, rejecter);
    } catch (err) {
        this.__err__res = err;
        this.status = REJECTED;
        this.__queue.forEach(function(item) {
            item.reject(err);
        });
    };
};

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    var _this = this;
    return new MyPromise(function(resFn, rejFn) {
        if (_this.status === FULFILLED) {
            handleFulfilled(_this.__succ__res);
        } else if (_this.status === REJECTED) {
            handleRejected(_this.__err__res);
        } else {//pending状态
            _this.__queue.push({resolve: handleFulfilled, reject: handleRejected});
        };

        function handleFulfilled(value) {
            var returnVal = value;
            // 获取 onFulfilled 函数的返回结果
            if (onFulfilled instanceof Function) {
                try {
                    returnVal = onFulfilled(value);
                } catch (err) { // 代码错误处理
                    rejFn(err);
                    return;
                };
            };

            if (returnVal && returnVal['then'] instanceof Function) {
                returnVal.then(function(res) {
                    resFn(res);
                },function(rej) {
                    rejFn(rej);
                });
            } else {
                resFn(returnVal);
            };
        };
        function handleRejected(reason) {
            if (onRejected instanceof Function) {
                var returnVal
                try {
                    returnVal = onRejected(reason);
                } catch (err) {
                    rejFn(err);
                    return;
                };

                if (typeof returnVal !== 'undefined' && returnVal['then'] instanceof Function) {
                    returnVal.then(function(res) {
                        resFn(res);
                    },function(rej) {
                        rejFn(rej);
                    });
                } else {
                    resFn(returnVal);
                };
            } else {
                rejFn(reason)
            }
        }

    })
};
MyPromise.resolve = function(arg) {
    if (typeof arg === 'undefined' || arg === null) {   //undefined 或者 null
        return new MyPromise(function(resolve) {
            resolve(arg);
        });
    } else if (arg instanceof MyPromise) {      // 参数是MyPromise实例
        return arg;
    } else if (arg['then'] instanceof Function) {   // 参数是thenable对象
        return new MyPromise(function(resolve, reject) {
            arg.then(function (res) {
                resolve(res);
            }, function (rej) {
                reject(rej);
            });
        });
    } else {    // 其他值
        return new MyPromise(function (resolve) {
            resolve(arg);
        });
    };
};
MyPromise.reject = function(arg) {
    return  new MyPromise(function(resolve, reject) {
        reject(arg);
    });
};
MyPromise.all = function(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('参数应该是一个数组!');
    };
    return new MyPromise(function(resolve, reject) {
        var i = 0, result = [];
        next();
        function next() {
            // 对于不是MyPromise实例的进行转换
            MyPromise.resolve(arr[i]).then(function (res) {
                result.push(res);
                i++;
                if (i === arr.length) {
                    resolve(result);
                } else {
                    next();
                };
            }, reject);
        }
    })
};
MyPromise.race =  function(arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('参数应该是一个数组!');
    };
    return new MyPromise(function(resolve, reject) {
        var done = false;
        arr.forEach(function(item) {
            MyPromise.resolve(item).then(function (res) {
                if (!done) {
                    resolve(res);
                    done = true;
                };
            }, function(rej) {
                if (!done) {
                    reject(rej);
                    done = true;
                };
            });
        })
    });
};

MyPromise.prototype.catch = function(errHandler) {
    return this.then(undefined, errHandler);
};
MyPromise.prototype.finally = function(finalHandler) {
    return this.then(finalHandler, finalHandler);
};