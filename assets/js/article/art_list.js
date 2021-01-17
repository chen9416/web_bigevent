// 为 art-template 定义时间过滤器
template.defaults.imports.dateFormat = function(dtStr) {
    var dt = new Date(dtStr)
  
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
  
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
  
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  
  // 在个位数的左侧填充 0
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  
  $(function() {
    var laypage = layui.laypage
    var form = layui.form
    // 总数据条数
    var total = 0
    // 查询对象
    var queryObj = {
      cate_id: '', // 类型Id
      state: '', // 文章状态
      pagesize: 2, // 每页显示多少条数据
      pagenum: 1 // 页码值 
    }
  
    // 页面首次加载时，获取文章列表数据
    getArticleList()
  
    // 1. 渲染分类下拉框
    $.get('/my/article/cates', function(res) {
      if (res.status !== 0) {
        return layer.msg('获取文章分类失败！')
      }
      var htmlStr = template('cateTemp', res)
      $('#catesList').html(htmlStr)
      form.render()
    })
  
    // 2. 监听搜索区域的 submit 事件
    $('#formSearch').on('submit', function(e) {
      e.preventDefault()
  
      // 将表单序列化为一个参数对象
      var formArr = $(this).serializeArray()
      // 循环参数对象，将每个参数挂载到 queryObj 中
      $.each(formArr, function(i, item) {
        queryObj[item.name] = item.value
      })
  
      // 搜索条件变化时，重置页码值，并重新获取文章列表数据
      queryObj.pagenum = 1
      getArticleList()
    })
  
    // 3. 发起请求，获取列表数据
    function getArticleList() {
      $.get('/my/article/list', queryObj, function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        // 为总数据条数赋值
        total = res.total
        // 使用 art-template 模板引擎渲染页面结构
        var htmlStr = template('listTemp', res)
        $('#art-list-body').html(htmlStr)
        // 重新渲染分页区域
        renderPager()
      })
    }
  
    // 4. 渲染你底部的分页区域
    function renderPager() {
      // 3. 执行一个 laypage 实例
      laypage.render({
        elem: 'page-box', // 注意，这里的 page-box 是 ID，不用加 # 号
        count: total, // 数据总数，从服务端得到
        limit: queryObj.pagesize, // 每页显示多少条数据
        limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器
        curr: queryObj.pagenum,
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        jump: function(obj, first) {
          // 得到当前的页码值
          queryObj.pagenum = obj.curr
          // 得到每页显示的条数
          queryObj.pagesize = obj.limit
          //首次不执行
          if (!first) {
            // 页码发生跳转时，重新获取文章列表数据
            getArticleList()
          }
        }
      })
    }
  
    // 5. 监听删除按钮的点击事件
    $('body').on('click', '.btn_delete', function() {
      var id = $(this).attr('data-id')
      // 询问用户是否要删除
      layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
        // 发起请求，删除文章
        $.get('/my/article/delete/' + id, function(res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          getArticleList()
        })
        layer.close(index)
      })
    })
  
    // 6. 监听编辑按钮的点击事件
    $('body').on('click', '.btn_edit', function() {
      location.href = '/article/art_edit.html?id=' + $(this).attr('data-id')
    })
  })