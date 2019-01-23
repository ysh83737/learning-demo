
class MyPromise {
    constructor(fn) {

        this.__succ_res = null;     //保存成功的返回结果
        this.__err_res = null;      //保存失败的返回结果
        this.status = 'pending';    //标记处理的状态
        this.__queue = [];          //事件队列
        //箭头函数绑定了this，如果使用es5写法，需要定义一个替代的this
        let _this = this;
        function resolver(...arg) {
            setTimeout(() => {
                if (_this.status === 'pending') {
                    //如果状态已经改变，不再执行本代码
                    _this.__succ_res = arg;
                    _this.status = 'success';
                    _this.__queue.forEach(json => {
                        json.resolve(...arg);
                    });
                };                
            }, 0);
        };
        function rejecter(...arg) {
            setTimeout(() => {
                if (_this.status === 'pending') {
                    //如果状态已经改变，不再执行本代码
                    _this.__err_res = arg;
                    _this.status = 'error';
                    _this.__queue.forEach(json => {
                        json.reject(...arg);
                    });
                };                
            }, 0);
        };
        try {
            fn(resolver, rejecter);
        } catch(err) {
            this.__err_res = [err];
            this.status = 'error';
            this.__queue.forEach(json => {
                json.reject(...err);
            });
        };
    }
    then(onFulfilled, onRejected) {
        //箭头函数绑定了this，如果使用es5写法，需要定义一个替代的this
        return new MyPromise((resFn, rejFn) => {
            function handle(value) {
                //then方法的onFulfilled有return时，使用return的值，没有则使用回调函数resolve的值
                let returnVal = value;
                if (onFulfilled instanceof Function) {
                    try {
                        returnVal = onFulfilled(value);
                    } catch(err) {
                        //代码错误处理
                        rejFn(err);
                        return;
                    }
                };
                if (returnVal && returnVal['then'] instanceof Function) {//如果onFulfilled返回的是新Promise对象，则调用它的then方法
                    returnVal.then(res => {
                        resFn(res);
                    }, err => {
                        rejFn(err);
                    });
                } else {
                    resFn(returnVal);
                };
            };
            function errBack(reason) {
                //如果有onRejected回调，执行一遍
                if (onRejected instanceof Function) {
                    try {
                        let returnVal = onRejected(reason);
                        //执行onRejected回调有返回，判断是否thenable对象
                        if (typeof returnVal !== 'undefined' && returnVal['then'] instanceof Function) {
                            returnVal.then(res => {
                                resFn(res);
                            }, err => {
                                rejFn(err);
                            });
                        } else {
                            //不是thenable的，直接丢给新对象resFn回调
                            resFn(returnVal);
                        };
                    } catch(err) {
                        //代码错误处理
                        rejFn(err);
                        return;
                    }
                } else {//传给下一个reject回调
                    rejFn(reason);
                };
            };
            if (this.status === 'success') {
                handle(...this.__succ_res);
            } else if (this.status === 'error') {
                errBack(...this.__err_res);
            } else {
                this.__queue.push({resolve: handle, reject: errBack});
            };
        })
    }
    catch(errHandler) {
        return this.then(undefined, errHandler);
    }
    finally(finalHandler) {
        return this.then(finalHandler, finalHandler);
    }
};
MyPromise.all = (arr) => {
    if (!Array.isArray(arr)) {
        throw new TypeError('参数应该是一个数组!');
    };
    return new MyPromise(function(resolve, reject) {
        let i = 0, result = [];
        next();
        function next() {
            //如果不是MyPromise对象，需要转换
            MyPromise.resolve(arr[i]).then(res => {
                result.push(res);
                i++;
                if (i === arr.length) {
                    resolve(result);
                } else {
                    next();
                };
            }, reject);
        };
    })
};
MyPromise.race = arr => {
    if (!Array.isArray(arr)) {
        throw new TypeError('参数应该是一个数组!');
    };
    return new MyPromise((resolve, reject) => {
        let done = false;
        arr.forEach(item => {
            //如果不是MyPromise对象，需要转换
            MyPromise.resolve(item).then(res => {
                if (!done) {
                    resolve(res);
                    done = true;
                };
            }, err => {
                if (!done) {
                    reject(err);
                    done = true;
                };
            });
        })
    })

}
MyPromise.resolve = (arg) => {
    if (typeof arg === 'undefined' || arg == null) {//无参数/null
        return new MyPromise((resolve) => {
            resolve(arg);
        });
    } else if (arg instanceof MyPromise) {
        return arg;
    } else if (arg['then'] instanceof Function) {
        return new MyPromise((resolve, reject) => {
            arg.then((res) => {
                resolve(res);
            }, err => {
                reject(err);
            });
        });
    } else {
        return new MyPromise(resolve => {
            resolve(arg);
        });
    }
};
MyPromise.reject = (arg) => {
    return new MyPromise((resolve, reject) => {
        reject(arg);
    });
};