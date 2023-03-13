const  query  = require('@/db/index')

// 获取分类列表
exports.getArtCateList = async (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    let result = await query(sql)
    if (result.length == 0) return res.cc('获取文章分类列表失败！').catch((error) => { res.cc(error) })
    res.send({
        status: 0,
        message: '获取文章分类列表成功！',
        data: result
    })
}

// 新增分类
exports.addCates = async (req, res) => {
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    const sqlStr = 'insert into ev_article_cate set ?'
    try {
        let result = await query(sql, [req.body.name, req.body.alias])
        if (result.length) return res.cc('分类名称或别名被占用，请更换后重试！')
        let results = await query(sqlStr, req.body)
        if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
        res.cc('新增文章分类成功！', 0)
    } catch (error) {
        res.cc(error)
    }
}

exports.deleteCateById = async (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    let result = await query(sql, req.params.id)
    if (result.affectedRows !== 1) return res.cc('删除文章分类失败')
    res.cc('删除文章分类成功！', 0)
}

exports.getArtCateById = async (req, res) => {
    const sql = 'select * from ev_article_cate where id=?'
    let result = await query(sql, req.params.id).catch((error) => { res.cc(error) })
    console.log(result);
    if (!result.length) return res.cc('查询失败')
    res.send({
        status: 0,
        message: '查询成功！',
        data: result[0]
    })
}

exports.updateCateById = async (req, res) => {
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
    const sqlStr = 'update ev_article_cate set ? where id=?'
    try {
        let result = await query(sql, [req.body.id, req.body.name, req.body.alias])
        if (result.length) return res.cc('分类名或分类别名被占用')
        let results = await query(sqlStr, [req.body, req.body.id])
        if (results.affectedRows !== 1) return res.cc('修改分类失败')
        res.cc('更新文章分类成功', 0)
    } catch (error) {
        res.cc(error)
    }
}