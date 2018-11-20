# learning-demo
Collection of demos in daily learning and working. Share more, learn more.
平时学习、工作中研究的一些demo。

## Demo1 封装了一个ajax请求方法
路径：`p1_my_ajax`  
实现功能：
- 可以实现常用的get/post请求
- 支持text/json/xml几种返回数据类型

参数：`options`
- url: 请求地址
- dataType: 数据格式，text/json/xml，默认text，不区分大小写
- method: 请求方式，默认get，不区分大小写
- data: 请求参数，oject类型

*注意：get请求若需带参数，参数仍丢入data属性，自动拼接url

测试：`index.js`  
- 写了两个简单的php程序测试了post和get请求
- 请求了4种不同类型数据的本地文件，包括：数组、对象、文本、xml