$(function () {
    // 获取用户的信息
    getUserInfo()
    // 点击退出 弹出提示框
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            //清空本地存储中的 token
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = 'login.html';
            //关闭询问框
            layer.close(index);
          });
    })
})
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.leyer.msg('获取用户失败！');
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        complete : function () {
            console.log('执行了complete 回调');
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空
                localStorage.removeItem('token');
                //强制跳转到login
                location.href = 'login.html';
            }
        } 
    })
    function renderAvatar(user) {
        // 获取用户名称
        var name = user.nickname || user.username;
        // 设置欢迎文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        // 按需渲染用户的头像
        if (user.user_pic !== null) {
            //渲染图片头像
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avater').hide();
        } else {
            //渲染文本头像
            $('.layui-nav-img').hide();
            var first = name[0].toUpperCase();
            $('.text-avater').html(first).show();
        }
    }
}