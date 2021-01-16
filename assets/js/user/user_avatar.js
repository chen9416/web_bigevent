$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
    }
  
    // 1.3 创建裁剪区域
    $image.cropper(options)
  
    // 2.1 点击选择图片
    $('#btnChooseImage').on('click', function() {
      // 模拟文件选择框的点击事件
      $('#iptAvatar').click()
    })
  
    // 2.2 监听头像文本框的 change 事件
    $('#iptAvatar').on('change', function(e) {
      // 2.2.1 判断选择的文件个数
      if (e.target.files.length === 0) {
        return
      }
  
      // 2.2.2 拿到用户选择的文件
      const file = e.target.files[0]
      // 2.2.3 ★★★ 根据选择的文件，创建一个对应的 URL
      const newImgURL = URL.createObjectURL(file)
      // 2.2.4 ★★★ 先销毁原来的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
      $image
        .cropper('destroy')
        .attr('src', newImgURL)
        .cropper(options)
    })
  
    // 3. 点击确定按钮，创建新头像
    $('#btnCreateAvatar').on('click', function() {
      // 3.1 判断用户是否选用的 sample.jpg
      const src = $('#image').attr('src')
      if (src.indexOf('/assets/images/sample.jpg') !== -1) {
        return layer.msg('请上传图片后再生成头像！')
      }
      // 3.2 将裁剪后的图片，输出为 base64 格式的字符串
      var dataURL = $image
        .cropper('getCroppedCanvas', {
          width: 100,
          height: 100
        })
        .toDataURL('image/png')
  
      // 3.3 发起请求，将新头像上传到后台
      $.post('/my/update/avatar', { avatar: dataURL }, function(res) {
        if (res.status !== 0) {
          return layer.msg('更新头像失败！')
        }
  
        // 3.4 重新渲染用户头像
        reRenderUserAvatar()
      })
    })
  
    // 3.4 重新渲染用户的头像
    function reRenderUserAvatar() {
      $.get('/my/userinfo', function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        layer.msg('更新头像成功！')
        window.parent.renderAvatar(res.data)
      })
    }
  })