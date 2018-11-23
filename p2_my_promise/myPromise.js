
class MyPromise {
    constructor(fn) {

        this.__succ_res = null;     //保存成功的返回结果
        this.__err_res = null;      //保存失败的返回结果
        this.status = 'pending';    //标记处理的状态
        this.__queue = [];          //事件队列
        //箭头函数绑定了this，如果使用es5写法，需要定义一个替代的this
        try {
            fn((...arg) => {
                this.__succ_res = arg;
                this.status = 'success';
                this.__queue.forEach(json => {
                    json.resolve(...arg);
                });
            }, (...arg) => {
                this.__err_res = arg;
                this.status = 'error';
                this.__queue.forEach(json => {
                    json.reject(...arg);
                });
            });
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
                    });
                } else {
                    resFn(returnVal);
                }
            };
            function errBack(reason) {
                // reason = onRejected instanceof Function && onRejected(reason) || reason;
                // rejFn(reason);//这里会将reject一直传递下去——————no
                if (onRejected instanceof Function) {
                    //冒泡处理，如果当前then有onRejected方法，则不需要冒泡，直接使用，而且要调用下一个Promise的resolve，不停止后面的代码
                    onRejected(reason);
                    resFn();//这样处理，和原生一样，不影响后面的Promise——yes-----处理异步操作的时候（then先于回调执行），还是不能正确处理，前面的reject会影响后面的继续执行
                } else {
                    rejFn(reason);//如果then没有传入onRejected方法，则使用下一个Promise的then，一直到catch--冒泡
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
        // if (this.status === 'error') {
        //     errHandler(...this.__err_res);
        // } else {
        //     this.__queue.push({resolve: () => {}, reject: errHandler});//处理最后一个Promise的时候，队列resolve推入一个空函数，不造成影响，不会报错----如果没有，则会报错
        // };
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
            //如果不是Promise对象，需要转换
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
            //如果不是Promise对象，需要转换
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
            arg.then((res) => {//调用其then方法，但转换出来的状态都是resolved
                resolve(res);
            }, err => {
                resolve(err);
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