//测试用例

//post请求
let ajax_post = myAjax({url:'program/test_post.php', method:'POST', dataType: 'json', data: {name:'ysh',age:23}});
//get请求
let ajax_get = myAjax({url:'program/test_get.php', method:'GET', dataType: 'json', data: {name:'ysh',age:23}});
Promise.all([ajax_post, ajax_get]).then(res => {
    console.log(res);
}).catch( err => {
    console.log('请求出错了', err);
});

//资源get请求
let arr = myAjax({url:'data/arr.txt', dataType: 'json'}),
    json = myAjax({url:'data/json.txt', dataType: 'json'}),
    text = myAjax({url:'data/text.txt', dataType:'text'}),
    xml = myAjax({url:'data/xmlData.xml', dataType:'xml'});
Promise.all([arr, json, text, xml]).then(res => {
    console.log(res);
}).catch(err => {
    console.log('请求出错了', err);
});
