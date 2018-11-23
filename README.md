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
- 已实现Promise基本功能，`MyPromise.prototype.then()`方法正常，与原生一样，异步、同步操作均ok
- `MyPromise.all()`功能已完美实现
- `MyPromise.prototype.catch()`功能大部分实现
- `rejected`状态的冒泡处理也已解决，当前Promise的reject如果没有捕获，会一直冒泡到最后，直到catch

### 不足之处：
- 还有一些方法没有实现，正在尝试；
- 代码的错误暂时无法被catch捕获，如异步错误……