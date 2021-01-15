$(function () {
    // 点击切换登录与注册
    $('.link_reg').on('click', function () {
        $('.login-box').hide(); // 隐藏
        $('#form_login')[0].reset(); // 清除表单内容
        $('.reg-box').show();
    })
    $('.link_login').on('click', function () {
        $('.reg-box').hide();
        $('#form_reg')[0].reset();
        $('.login-box').show();
    })

    // 从layui.js中获取form对象
    var form = layui.form;
    // 通过layui的verify()函数自定义校验规则
    form.verify({
        //自定义了一个pwd校验规则
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            var pwdVal = $('.reg-box [name="pwd"]').val();
            console.log(pwdVal);
            if(value !== pwdVal) {
                return '两次密码不一致';
            }
        }
    })
    // 从layui.js中获取layer对象
    var layer = layui.layer;
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/reguser',$(this).serialize(), // 有了baseAPI.js 就不用写域名
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录');
                $('.link_login').click();
            }
        )
    })
    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        location.href = 'index.html';
        // $.post('/api/login', $(this).serialize(),
        //     function (res) {
        //         if (res.status !== 0) {
        //             return layer.msg(res.message);
        //         }
        //         layer.msg('登录成功！');
        //         //将登录成功得到的 token字符串，保存到localStorage中
        //         localStorage.setItem('token',res.token);
        //         //跳转到首页
        //         Location.herf = '/index.html';
        //     }
        // )
    })
})
