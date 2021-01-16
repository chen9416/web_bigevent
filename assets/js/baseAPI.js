//注意:每次调用$.get()或 $.post()或$.ajax()的时候，
//都会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    // 拼接url
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    
    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    
    //全局统一挂载complete回调函数
    // 不论成功还是失败，最终都会调用complete函数
    options.complete = function () {
        console.log('执行了complete 回调');
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空
            localStorage.removeItem('token');
            //强制跳转到login
            location.href = 'login.html';
        }
    }
})


