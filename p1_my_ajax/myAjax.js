/**
 * ajax请求
 * @description 自己写的ajax请求
 * @param {Object} options 请求配置信息
 * @param {String} options.url 请求地址
 * @param {String} options.dataType 数据格式 json/text/xml
 * @param {String} options.method 请求方式，默认get
 * @param {Object} options.data 请求参数，json格式
 * [options={url, dataType, method}]
 * @returns {Object} 返回一个Promise对象
 */
function myAjax(options) {
    function transformData(object){
        let oStr = '';
    　　for(var key in object){
    　　　　oStr += key+"="+object[key]+"&";
    　　};
    　　return oStr.slice(0,-1);
    };
    return new Promise(function (resolve, reject) {
        let method = options.method ? options.method.toUpperCase() : 'GET';
        let xhr = new XMLHttpRequest();//创建请求对象
        if (method === 'POST') {
            xhr.open(method, options.url);//连接服务器
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");//post请求添加请求头
            xhr.send(transformData(options.data));//发送请求，带处理过的参数
        } else if(method === 'GET') {
            xhr.open(method, options.url + '?' + transformData(options.data));//get请求url需要拼接参数
            xhr.send();
        } else {//其他请求方式
            xhr.open(method, options.url);
            xhr.send();
        };
        //接收返回结果
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (
                    (xhr.status >= 200 && xhr.status < 300) ||
                    xhr.status === 304
                ) {
                    let dataType = options.dataType || 'TEXT',
                        data = null;
                    switch (dataType.toUpperCase()) {
                        case 'JSON':
                            data = JSON.parse(xhr.responseText);
                            break;
                        case 'TEXT':
                            data = xhr.responseText;
                            break;
                        case 'XML':
                            data = xhr.responseXML;
                            break;
                    };
                    resolve(data);
                } else {
                    reject({
                        statusCode: xhr.status,
                        msg: '请求错误'
                    });
                }
            };
        }
    });
};