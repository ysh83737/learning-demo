# learning-demo
Collection of demos in daily learning and working. Share more, learn more.
平时学习、工作中研究的一些demo。  
**代码同时同步到github和码云**
***
## Demo1 封装了一个ajax请求方法
### 路径：`p1_my_ajax`  
### 实现功能：
- 可以实现常用的get/post请求
- 支持text/json/xml几种返回数据类型
- 返回的是一个Promise对象

### 不足之处：  
- 除常用的post/get请求外，其他请求方式不熟悉，没测试过，可能会不适用
- 方法返回的是Promise对象，不是最终结果（以后有空再琢磨）

### 参数：`options`
- url: 请求地址
- dataType: 数据格式，text/json/xml，默认text，不区分大小写
- method: 请求方式，默认get，不区分大小写
- data: 请求参数，oject类型

> *注意：get请求若需带参数，参数仍丢入data属性，自动拼接url

### 测试：`index.js`  
- 写了两个简单的php程序测试了post和get请求
- 请求了4种不同类型数据的本地文件，包括：数组、对象、文本、xml

***
## Demo2 封装一个Promise对象

### 路径： p2_my_promise  

### 实现功能：
- 已实现 `Promise` 基本功能，与原生一样，异步、同步操作均ok，具体包括：
    - `MyPromise.prototype.then()`
    - `MyPromise.prototype.catch()` 与原生 `Promise` 略有出入
    - `MyPromise.prototype.finally()`
    - `MyPromise.all()`
    - `MyPromise.race()`
    - `MyPromise.resolve()`
    - `MyPromise.reject()`
- `rejected` 状态的冒泡处理也已解决，当前Promise的reject如果没有捕获，会一直冒泡到最后，直到catch
- `MyPromise` 状态一旦改变，将不能再改变它的状态

### 不足之处：
- 代码的错误被catch捕获时，提示的信息（捕获的错误对象）比原生Promise要多
- 代码是es6写的，会考虑再用es5写，以便于应用到es5项目中；es5写的话，不用箭头函数，要考虑this的问题

### 测试： `index.html`
- 这个页面中包含了27个测试例子，分别测试了各项功能、各个方法，还有一些特殊情况测试；或许还有有遗漏的，感兴趣自己可以玩一下；
- 可视化的操作，方便测试，每次运行一个例子，打开调试台即可看到结果；建议同时打开 `index.js` 边看代码边玩；
- 同一套代码，上面的 `MyPromise` 的运行结果，下面是原生 `Promise` 运行的结果；

### 收获
- 这个过程很开心，能够自己挑战原生的东西，这是我第一回；
- 花了好多天时间去折腾 `Promise` 先是弄懂他，再去思考他，最后一步步把功能实现出来，怼他的理解不断加深，越来越透彻；
- 当写到一个新功能时，发现在这个新功能里，上一个功能有遗漏，这时候需要了解他们俩之间的关系，还要重新理解上一个功能；在这种重复当中，无疑又加深了一层理解；
- then/catch方法是最难的，要不停地修修补补；
- 最后所有功能都实现了，才想起来一个关键点“Promise状态一旦确定，不能再改变”，又添加了一些逻辑才得以解决。因此，这个过程，难以做到滴水不漏，或许现在的代码里还有些隐藏问题没被发现。
- `reject` 状态的冒泡是个难题，但在下面的代码中我没有专门提及，我也没有办法具体说清楚他，我是在整个过程中不停地调才最终调出来正确的冒泡结果。

### 参考文章
- [ECMAScript 6 入门 - Promise 对象][1]
- [es6 promise源码实现][2]
- [手把手教你实现一个完整的 Promise][3]


[1]: http://es6.ruanyifeng.com/#docs/promise
[2]: https://segmentfault.com/a/1190000006103601
[3]: https://www.cnblogs.com/huansky/p/6064402.html