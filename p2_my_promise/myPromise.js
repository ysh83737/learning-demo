
class Promise2 {
    constructor(fn) {

        this.__succ_res = null;     //保存成功的返回结果
        this.__err_res = null;      //保存失败的返回结果
        this.status = 'none';       //标记处理的状态
        this.__queue = [];          //事件队列
        //箭头函数绑定了this，如果使用es5写法，需要定义一个替代的this
        fn((...arg) => {
            this.__succ_res = arg;
            this.status = 'succ';
            this.__queue.forEach(json => {
                json.resolve(...arg);
            });
        }, (...arg) => {
            this.__err_res = arg;
            this.status = 'err';
            this.__queue.forEach(json => {
                json.reject(...arg);
            });
        });
    }
    then(onFulfilled, onRejected) {
        //箭头函数绑定了this，如果使用es5写法，需要定义一个替代的this
        return new Promise2((resFn, rejFn) => {
            function handle(value) {
                let returnVal = onFulfilled instanceof Function && onFulfilled(value) || value;
                if (returnVal && returnVal['then'] instanceof Function) {
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
                onRejected(reason);
                resFn();//这样处理，和原生一样，不影响后面的Promise——yes
            };
            if (this.status === 'succ') {
                handle(...this.__succ_res);
            } else if (this.status === 'err') {
                errBack(...this.__err_res);
            } else {
                this.__queue.push({resolve: handle, reject: onRejected});
            };
        })
    }
}
Promise2.all = (arr) => {
    let result = [];
    return new Promise2(function(resolve, reject) {
        let i = 0;
        next();
        function next() {
            arr[i].then(res => {
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
}