$(function() {
    getArticleCateList()
    // 1. 获取文章分类列表
    function getArticleCateList() {
      $.get('/my/article/cates', function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        var htmlStr = template('catelist', res)
        $('.layui-table tbody').html(htmlStr)
      })
    }
  
    // 2.1 添加文章分类的弹出层的编号
    var addIndex = null
    $('#btnAddCate').on('click', function() {
      addIndex = layer.open({
        // 指定弹出层的类型
        type: 1,
        // 指定弹出层的标题
        title: '添加文章分类',
        // 指定弹出层的内容
        content: $('#boxAddCate').html(),
        // 设置弹出层的宽高
        area: ['500px', '250px']
      })
    })
  
    // 2.2 监听添加表单的提交事件
    $('body').on('submit', '#boxAddCate', function(e) {
      // 阻止表单的默认提交行为
      e.preventDefault()
      // 发起请求，添加新的文章分类
      $.post('/my/article/addcates', $(this).serialize(), function(res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        getArticleCateList()
        // 根据弹出层的编号，关闭对应的弹出层
        layer.close(addIndex)
      })
    })
  
    // 3. 删除文章分类
    $('body').on('click', '.btnDelete', function() {
      // 获取要删除的分类Id
      const id = $(this).attr('data-id')
      // 询问用户是否删除该分类
      layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
        $.get('/my/article/deletecate/' + id, function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败！')
          }
          layer.msg('删除文章分类成功！')
          getArticleCateList()
        })
        layer.close(index)
      })
    })
  
    // 4. 修改文章分类信息
    var layerEditId = null
    $('body').on('click', '.btnEdit', function() {
      // 获取到要修改的分类Id
      var id = $(this).attr('data-id')
      // 获取分类数据
      $.get('/my/article/cates/' + id, function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 显示弹出层
        layerEditId = layer.open({
          type: 1,
          title: '修改文章分类',
          area: ['500px', '250px'],
          content: $('#boxEditCate').html(),
          success: function() {
            // 弹出层显示出来以后，为弹出层中的表单赋值
            var form = layui.form
            form.val('editDialog', res.data)
          }
        })
      })
    })
  
    // 5. 监听修改表单提交的行为
    $('body').on('submit', '#boxEditCate', function(e) {
      e.preventDefault()
      var data = $(this).serialize()
      $.post('/my/article/updatecate', data, function(res) {
        if (res.status !== 0) {
          return layer.msg('更新分类信息失败！')
        }
        layer.msg('更新分类信息成功！')
        getArticleCateList()
        layer.close(layerEditId)
      })
    })
  })